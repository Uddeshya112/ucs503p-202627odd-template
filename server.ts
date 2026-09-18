import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- IN-MEMORY DATABASE ENGINE ---
  // Designed to be easily ported to Vercel Serverless Functions + a real DB later
  let users: any[] = [
    { id: "u1", email: "admin@college.edu", password: "password", role: "coordinator", name: "Dr. Admin" },
    { id: "sharma", email: "sharma@college.edu", password: "password", role: "faculty", name: "Prof. Sharma" },
    { id: "gupta", email: "gupta@college.edu", password: "password", role: "faculty", name: "Prof. Gupta" },
    { id: "csea", email: "student@college.edu", password: "password", role: "student", name: "Student CSE-A" }
  ];

  // College Data Setup (PDF Pages 8-10)
  let setupRooms: any[] = [
    { id: "r1", name: "Room 101", capacity: 60, type: "Lecture" },
    { id: "r2", name: "Room 204", capacity: 40, type: "Lecture" },
    { id: "r3", name: "Lab 1", capacity: 30, type: "Laboratory" },
    { id: "r4", name: "Lab 2", capacity: 30, type: "Laboratory" }
  ];
  let setupCourses: any[] = [
    { id: "c1", name: "DBMS", hours: 4, type: "Lecture" },
    { id: "c2", name: "OS", hours: 3, type: "Lecture" },
    { id: "c3", name: "Mathematics", hours: 4, type: "Lecture" },
    { id: "c4", name: "DBMS Lab", hours: 2, type: "Laboratory" },
    { id: "c5", name: "OS Lab", hours: 2, type: "Laboratory" }
  ];
  let setupFaculty: any[] = [
    { id: "sharma", name: "Prof. Sharma", department: "Computer Science", subjects: ["c1", "c4"] },
    { id: "gupta", name: "Prof. Gupta", department: "Computer Science", subjects: ["c2", "c5"] },
    { id: "math_prof", name: "Dr. Rao", department: "Mathematics", subjects: ["c3"] },
    { id: "admin", name: "Dr. Admin", department: "Administration", subjects: [] }
  ];
  
  let setupBatches: any[] = [
    { id: "b1", groupNumber: "2C4", department: "Computer Science", totalStudents: 60, subgroups: 2, subgroupNames: ["2C4-SG1", "2C4-SG2"] }
  ];

  // Initial Timetable
  let timetable: any[] = [
    { id: "t1", day: "Monday", time: "08:00 - 09:00", subject: "DBMS", section: "CSE-A", facultyId: "sharma", room: "204", status: "cancelled" },
    { id: "t2", day: "Monday", time: "09:00 - 10:00", subject: "FREE", section: "CSE-A", facultyId: null, room: null, status: "planned" },
    { id: "t3", day: "Thursday", time: "10:00 - 11:00", subject: "Mathematics", section: "CSE-A", facultyId: "math_prof", room: "101", status: "planned" },
    { id: "t4", day: "Thursday", time: "11:00 - 12:00", subject: "OS", section: "CSE-A", facultyId: "gupta", room: "205", status: "planned" },
    { id: "t5", day: "Friday", time: "14:00 - 15:00", subject: "DBMS Lab", section: "CSE-A", facultyId: "sharma", room: "Lab 1", status: "planned" },
  ];

  let pendingMakeups = [
    { id: "mk_1", subject: "DBMS", section: "CSE-A", facultyId: "sharma", originalSlotId: "t1", priority: 94 }
  ];

  let makeupOpportunities: any[] = [];
  let approvals: any[] = [];

  // --- CORE LOGIC: RECOVERY ENGINE ---
  // PDF Sec 58: Cross-Cancellation Algorithm
  const runRecoveryEngine = () => {
    makeupOpportunities = []; // Reset opportunities
    
    pendingMakeups.forEach(makeup => {
      // Find freed slots for this section
      const freedSlots = timetable.filter(t => t.section === makeup.section && t.status === "cancelled");
      
      freedSlots.forEach(slot => {
        // Check if the faculty is available at this time
        // (In a full app, we'd check the faculty's entire schedule. Here we do a simple mock check)
        const facultyBusy = timetable.some(t => t.facultyId === makeup.facultyId && t.day === slot.day && t.time === slot.time && t.status === "planned");
        
        if (!facultyBusy) {
          // Found a match!
          makeupOpportunities.push({
            id: `opp_${makeup.id}_${slot.id}`,
            makeupId: makeup.id,
            freedSlotId: slot.id,
            subject: makeup.subject,
            section: makeup.section,
            facultyId: makeup.facultyId,
            day: slot.day,
            time: slot.time,
            room: slot.room || "TBD",
            matchScore: 96 // Mock high score
          });
        }
      });
    });
  };

  // Run once on startup
  runRecoveryEngine();

  // --- API ROUTES ---

  app.post("/api/generate-timetable", (req, res) => {
    const { targetGroup, targetSubgroup, setupData: clientSetup } = req.body || {};
    
    // Sync setup data if passed from client
    if (clientSetup) {
      if (Array.isArray(clientSetup.rooms) && clientSetup.rooms.length > 0) setupRooms = clientSetup.rooms;
      if (Array.isArray(clientSetup.courses) && clientSetup.courses.length > 0) setupCourses = clientSetup.courses;
      if (Array.isArray(clientSetup.faculty) && clientSetup.faculty.length > 0) setupFaculty = clientSetup.faculty;
      if (Array.isArray(clientSetup.batches) && clientSetup.batches.length > 0) setupBatches = clientSetup.batches;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00"];
    
    const targetGroupStr = (targetGroup || "").trim().toLowerCase();

    // If regenerating for a specific group, retain other groups' classes
    let newTimetable: any[] = [];
    if (targetGroupStr) {
      newTimetable = timetable.filter(t => {
        const sec = (t.section || "").trim().toLowerCase();
        const bch = (t.batch || "").trim().toLowerCase();
        const isTarget = sec === targetGroupStr || bch === targetGroupStr || sec.startsWith(`${targetGroupStr}-`) || sec.startsWith(`${targetGroupStr}_`);
        return !isTarget;
      });
    }

    let idCounter = Date.now();

    let batchesToProcess = targetGroupStr 
      ? setupBatches.filter(b => (b.groupNumber || b.department || "").trim().toLowerCase() === targetGroupStr)
      : setupBatches;

    // Safety fallback: if target group wasn't found in setupBatches, auto-register it
    if (batchesToProcess.length === 0 && targetGroupStr) {
      const dynamicBatch = {
        id: `b_${idCounter}`,
        groupNumber: targetGroup,
        department: targetGroup,
        totalStudents: 60,
        subgroups: 2,
        subgroupNames: [`${targetGroup}-SG1`, `${targetGroup}-SG2`]
      };
      batchesToProcess = [dynamicBatch];
      setupBatches.push(dynamicBatch);
    }

    batchesToProcess.forEach(batch => {
      const groupName = (batch.groupNumber || batch.department || "General").trim();
      const numSubgroups = Math.max(1, Number(batch.subgroups) || Number(batch.sections) || 1);
      
      const subgroupNames: string[] = (batch.subgroupNames && batch.subgroupNames.length > 0)
        ? batch.subgroupNames
        : Array.from({ length: numSubgroups }, (_, i) => `${groupName}-SG${i + 1}`);

      setupCourses.forEach(course => {
        const isLabOrPractical = 
          course.type === 'Laboratory' || 
          course.type === 'Practical' || 
          course.type === 'Tutorial' ||
          (course.name && course.name.toLowerCase().includes('lab'));

        // If practical or lab: schedule each individual subgroup separately!
        // If lecture: schedule for the common batch section attended by all subgroups
        const entitiesToSchedule: { name: string; isSubgroup: boolean; requiredHours: number }[] = isLabOrPractical
          ? subgroupNames.map(sg => ({ name: sg, isSubgroup: true, requiredHours: Math.min(course.hours || 2, 2) }))
          : [{ name: groupName, isSubgroup: false, requiredHours: Math.min(course.hours || 3, 4) }];

        entitiesToSchedule.forEach(({ name: sectionName, isSubgroup, requiredHours }) => {
          let hoursAssigned = 0;
          
          // Eligible faculty for this course
          let eligibleFaculty = setupFaculty.filter(f => f.subjects && (f.subjects.includes(course.id) || f.subjects.includes(course.name)));
          if (eligibleFaculty.length === 0) {
            eligibleFaculty = setupFaculty;
          }
          const fac = eligibleFaculty.length > 0 
            ? eligibleFaculty[idCounter % eligibleFaculty.length] 
            : { id: 'faculty_1', name: 'Faculty' };

          let attempts = 0;
          while (hoursAssigned < requiredHours && attempts < 600) {
            attempts++;
            const randDay = days[Math.floor(Math.random() * days.length)];
            const randSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];

            // Check clash:
            const clash = newTimetable.some(t => {
              if (t.day !== randDay || t.time !== randSlot) return false;
              // Faculty clash: teacher cannot teach two classes at once
              if (t.facultyId && fac.id && t.facultyId === fac.id) return true;

              const tSec = (t.section || "").trim().toLowerCase();
              const currSec = sectionName.trim().toLowerCase();
              const currGroup = groupName.trim().toLowerCase();

              // Exact section clash: cannot double-book the same section/subgroup
              if (tSec === currSec) return true;

              // If current session is for entire batch, no subgroup of this batch can have a class
              if (!isSubgroup && (subgroupNames.some(s => s.trim().toLowerCase() === tSec) || tSec.startsWith(`${currGroup}-`))) {
                return true;
              }

              // If current session is for a subgroup, the entire batch cannot have a common lecture at the same time
              if (isSubgroup && tSec === currGroup) {
                return true;
              }

              // Note: Different subgroups of the same batch CAN have different labs concurrently in different rooms!
              return false;
            });

            if (!clash) {
              const usedRoomsThisSlot = newTimetable
                .filter(t => t.day === randDay && t.time === randSlot)
                .map(t => (t.room || "").trim().toLowerCase());

              let freeRooms = setupRooms.filter(r => !usedRoomsThisSlot.includes((r.name || "").trim().toLowerCase()));

              const desiredType = isLabOrPractical ? 'Laboratory' : (course.type || 'Lecture');
              const matchedTypeRooms = freeRooms.filter(r => (r.type || "").toLowerCase() === desiredType.toLowerCase());
              if (matchedTypeRooms.length > 0) {
                freeRooms = matchedTypeRooms;
              }

              if (freeRooms.length > 0) {
                const chosenRoom = freeRooms[Math.floor(Math.random() * freeRooms.length)];
                newTimetable.push({
                  id: `gen_${idCounter++}`,
                  day: randDay,
                  time: randSlot,
                  subject: course.name,
                  section: sectionName,
                  batch: groupName,
                  subgroup: isSubgroup ? sectionName : 'all',
                  isSubgroup,
                  courseType: isLabOrPractical ? 'Laboratory' : (course.type || 'Lecture'),
                  facultyId: fac.id,
                  room: chosenRoom.name,
                  status: "planned"
                });
                hoursAssigned++;
              }
            }
          }
        });
      });
    });

    timetable = newTimetable;
    res.json({ success: true, count: newTimetable.length, timetable: newTimetable });
  });

  app.get("/api/setup-data", (req, res) => {
    res.json({
      rooms: setupRooms,
      courses: setupCourses,
      faculty: setupFaculty,
      batches: setupBatches
    });
  });

  app.post("/api/setup-data", (req, res) => {
    const { type, payload } = req.body;
    if (!payload) return res.status(400).json({ error: "Missing payload" });
    const newItem = { id: payload.id || `${type.slice(0, 1)}_${Date.now()}`, ...payload };
    if (type === 'room') setupRooms.push(newItem);
    if (type === 'course') setupCourses.push(newItem);
    if (type === 'faculty') setupFaculty.push(newItem);
    if (type === 'batch') setupBatches.push(newItem);
    res.json({ success: true, item: newItem });
  });

  app.put("/api/setup-data/:type/:id", (req, res) => {
    const { type, id } = req.params;
    const { payload } = req.body;
    if (type === 'room') {
      const idx = setupRooms.findIndex(r => r.id === id);
      if (idx > -1) setupRooms[idx] = { ...setupRooms[idx], ...payload };
    }
    if (type === 'course') {
      const idx = setupCourses.findIndex(c => c.id === id);
      if (idx > -1) setupCourses[idx] = { ...setupCourses[idx], ...payload };
    }
    if (type === 'faculty') {
      const idx = setupFaculty.findIndex(f => f.id === id);
      if (idx > -1) setupFaculty[idx] = { ...setupFaculty[idx], ...payload };
    }
    if (type === 'batch') {
      const idx = setupBatches.findIndex(b => b.id === id);
      if (idx > -1) setupBatches[idx] = { ...setupBatches[idx], ...payload };
    }
    res.json({ success: true });
  });

  app.delete("/api/setup-data/:type/:id", (req, res) => {
    const { type, id } = req.params;
    if (type === 'room') setupRooms = setupRooms.filter(r => r.id !== id);
    if (type === 'course') setupCourses = setupCourses.filter(c => c.id !== id);
    if (type === 'faculty') setupFaculty = setupFaculty.filter(f => f.id !== id);
    if (type === 'batch') setupBatches = setupBatches.filter(b => b.id !== id);
    res.json({ success: true });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email.toLowerCase() === (email || "").trim().toLowerCase() && u.password === password);
    if (user) {
      res.json({ success: true, token: `token_${user.id}`, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, password, role, department, batchId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, email, password, and role are required." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const newId = `user_${Date.now()}`;
    const newUser: any = {
      id: newId,
      name: name.trim(),
      email: trimmedEmail,
      password,
      role: role.toLowerCase(), // 'student' | 'faculty' | 'coordinator'
      department: department || "Computer Science",
      batchId: batchId || (role.toLowerCase() === "student" ? "CSE-A" : undefined)
    };

    users.push(newUser);

    // If registered as faculty, also register into setupFaculty so they appear in coordinator schedules!
    if (newUser.role === "faculty") {
      setupFaculty.push({
        id: newId,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        maxHours: 16,
        color: "#6366f1"
      });
    }

    res.json({
      success: true,
      token: `token_${newUser.id}`,
      user: newUser
    });
  });

  // PDF Page 26: Free-Slot Marketplace
  app.get("/api/marketplace", (req, res) => {
    res.json({
      opportunities: [
        { id: 'm1', title: 'DBMS makeup', group: 'CSE-A', type: 'Lecture' },
        { id: 'm2', title: 'Tutorial', group: 'CSE-B', type: 'Tutorial' },
        { id: 'm3', title: 'Project mentoring', group: 'CSE-C', type: 'Mentoring' },
        { id: 'm4', title: 'Doubt session', group: 'ECE-A', type: 'Doubt' },
      ]
    });
  });

  // PDF Page 29: What-If Simulator
  app.post("/api/simulate", (req, res) => {
    setTimeout(() => {
      res.json({
        affectedClasses: 31,
        roomChanges: 14,
        newConflicts: 0,
        stability: 92,
        healthScore: 91.3
      });
    }, 1500); // simulate calculation time
  });

  // PDF Page 28: Substitute Faculty Engine
  app.get("/api/substitutes/:subject", (req, res) => {
    res.json({
      candidates: [
        { id: "gupta", name: "Dr. Gupta", compatibility: 95, status: "Available", reasons: ["Subject expert", "Room available", "Workload OK"] },
        { id: "verma", name: "Prof. Verma", compatibility: 82, status: "Available", reasons: ["Related expertise", "No conflict"] },
        { id: "singh", name: "Dr. Singh", compatibility: 45, status: "Unavailable", reasons: ["Workload limit exceeded"] }
      ]
    });
  });

  app.get("/api/dashboard/coordinator", (req, res) => {
    const healthScore = Math.max(0, 100 - (pendingMakeups.length * 2) - (approvals.length * 1));
    
    // PDF Page 32: Academic Inbox
    const inbox = [
      { id: 1, type: "error", message: "Makeup request from CSE-A" },
      { id: 2, type: "warning", message: "Room changed for OS (CSE-B)" },
      { id: 3, type: "success", message: "Class confirmed for Mathematics" },
      { id: 4, type: "info", message: "Department meeting at 4 PM" },
      { id: 5, type: "success", message: "Timetable updated to Version 4" }
    ];

    // PDF Page 30: Syllabus Intelligence
    const syllabusData = [
      { subject: "DBMS", required: 45, planned: 45, completed: 38, cancelled: 2, remaining: 7, risk: "HIGH", statusColor: "red" },
      { subject: "OS", required: 40, planned: 40, completed: 30, cancelled: 0, remaining: 10, risk: "LOW", statusColor: "green" },
      { subject: "Mathematics", required: 50, planned: 50, completed: 42, cancelled: 1, remaining: 8, risk: "MEDIUM", statusColor: "yellow" }
    ];

    res.json({
      healthScore: healthScore.toFixed(1),
      pendingMakeups: pendingMakeups,
      approvals: approvals,
      timetable: timetable,
      inbox: inbox,
      syllabus: syllabusData,
      stats: {
        totalClasses: timetable.length,
        cancelled: timetable.filter(t => t.status === "cancelled").length
      }
    });
  });

  app.get("/api/dashboard/faculty/:id", (req, res) => {
    const facultyId = req.params.id;
    const routine = timetable.filter(t => t.facultyId === facultyId);
    const opportunities = makeupOpportunities.filter(o => o.facultyId === facultyId);
    
    // PDF Page 31: Faculty Workload Dashboard
    const workload = {
      teaching: 16,
      tutorial: 2,
      labs: 2,
      visiting: 2,
      research: 6,
      meetings: 1,
      status: "Balanced", // or "Potential overload"
      statusColor: "green"
    };
    
    res.json({ routine, opportunities, workload });
  });

  app.get("/api/dashboard/student/:section", (req, res) => {
    const target = (req.params.section || "").trim().toLowerCase();
    const routine = timetable.filter(t => {
      const sec = (t.section || "").trim().toLowerCase();
      const bch = (t.batch || "").trim().toLowerCase();
      return sec === target || bch === target || sec.startsWith(`${target}-`) || sec.startsWith(`${target}_`);
    });
    res.json({ routine });
  });

  app.post("/api/cancel-class", (req, res) => {
    const { slotId } = req.body;
    const slot = timetable.find(t => t.id === slotId);
    if (slot && slot.status !== "cancelled") {
      slot.status = "cancelled";
      
      // Create makeup task
      pendingMakeups.push({
        id: `mk_${Date.now()}`,
        subject: slot.subject,
        section: slot.section,
        facultyId: slot.facultyId as string,
        originalSlotId: slot.id,
        priority: 85 + Math.floor(Math.random() * 10)
      });
      
      // Trigger Self-Healing Engine
      runRecoveryEngine();
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Slot not found or already cancelled" });
    }
  });

  app.post("/api/accept-opportunity", (req, res) => {
    const { opportunityId } = req.body;
    const opp = makeupOpportunities.find(o => o.id === opportunityId);
    
    if (opp) {
      // Remove from opportunities
      makeupOpportunities = makeupOpportunities.filter(o => o.id !== opportunityId);
      
      // Send to coordinator for approval
      approvals.push({
        id: `app_${Date.now()}`,
        ...opp,
        status: "pending_approval"
      });
      
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Opportunity not found" });
    }
  });

  app.post("/api/approve-makeup", (req, res) => {
    const { approvalId } = req.body;
    const apprv = approvals.find(a => a.id === approvalId);
    
    if (apprv) {
      // 1. Remove from approvals
      approvals = approvals.filter(a => a.id !== approvalId);
      // 2. Remove from pending makeups
      pendingMakeups = pendingMakeups.filter(m => m.id !== apprv.makeupId);
      // 3. Update the timetable slot to reflect the new class
      const slot = timetable.find(t => t.id === apprv.freedSlotId);
      if (slot) {
        slot.status = "rescheduled";
        slot.subject = apprv.subject;
        slot.facultyId = apprv.facultyId;
      }
      
      runRecoveryEngine(); // Re-run engine to clear stale opportunities
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Approval not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
