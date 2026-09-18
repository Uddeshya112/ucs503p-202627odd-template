# TimeTable Maker

**UCS503P Software Engineering Project (2026–27 ODD)**  
Thapar Institute of Engineering and Technology

**Live Application:**  
https://timetable-maker-ucs503p.vercel.app/

**GitHub Repository:**  
https://github.com/Uddeshya112/ucs503p-202627odd-template

---

## Team

| Name | Roll No. |
|---|---:|
| **Uddeshya Kumar** | **1024031184** |
| **Sahibjot Singh** | **1024030559** |
| **Sparsh Gupta** | **1024030557** |
| **Tamana** | **1024030566** |
| **Aarav** | **1024030482** |

---

# What this is

**TimeTable Maker** is an academic timetable scheduling and management system designed to make the process of creating, managing and accessing college timetables easier and more organized.

Academic timetable preparation involves multiple resources at the same time — subjects, faculty members, classrooms, student batches and lecture periods. A change to one part of the schedule can affect several other assignments.

TimeTable Maker provides a centralized web application for handling these activities through role-based interfaces.

The system supports three primary roles:

**Academic Coordinator, Faculty / Teacher, and Student.**

Each role receives access to the information and functionality relevant to that user.

The application is designed around:

- Academic timetable scheduling
- Classroom and room allocation
- Faculty schedule management
- Student timetable access
- Faculty workload management
- Timetable conflict detection
- Lecture-swap management
- Role-based access
- Simple and responsive interfaces

The production application is deployed on Vercel and is available online.

---

# User Roles

The system provides separate access and functionality for each type of user.

## Academic Coordinator

The coordinator manages the overall academic scheduling environment.

The coordinator can work with:

- Master timetable
- Timetable generation
- Classroom management
- Room allocation
- Faculty management
- Student management
- Faculty workload limits
- Conflict detection
- Lecture-swap management
- Academic scheduling information

---

## Faculty / Teachers

Faculty members have access to their own teaching-related information.

Faculty functionality includes:

- Personalized weekly teaching timetable
- Assigned lectures
- Teaching schedule
- Faculty preferences
- Classroom information
- Lecture-swap requests
- Academic schedule access

---

## Students

Students can access their class schedule through their own interface.

Student functionality includes:

- Batch timetable
- Subject details
- Lecture periods
- Classroom / room numbers
- Timetable filtering
- Print / export functionality
- Academic schedule access

---

# Core Features

## Timetable Scheduling

The system provides a centralized interface for creating and managing academic timetables.

## Conflict Avoidance

Timetable assignments are checked to help avoid overlapping:

- Faculty assignments
- Classroom assignments
- Student batch schedules
- Lecture periods

## Classroom Allocation

Classrooms and room information can be managed as part of the academic scheduling process.

## Faculty Workload

Faculty schedules and workload-related information can be managed by the coordinator.

## Lecture Swaps

Faculty can work with lecture-swap requests when schedule changes are required.

## Role-Based Access

Different users access different parts of the application based on their role.

## Student Timetable

Students can view their timetable, subjects, periods and classroom information through a dedicated interface.

---

# Application Structure

```text
                           TIME TABLE MAKER
                                  │
                                  ▼
                              Login
                                  │
                                  ▼
                         Role-Based Access
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        Coordinator            Faculty             Student
              │                   │                   │
              ▼                   ▼                   ▼
        Manage Timetable     Teaching Schedule    Class Timetable
        Manage Faculty       Assigned Lectures    Subjects
        Manage Students      Lecture Swaps        Room Details
        Manage Rooms         Preferences          Timetable Filters
        Detect Conflicts
