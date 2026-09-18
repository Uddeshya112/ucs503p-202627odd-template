# TimeTable Maker

### Academic Scheduling, Resource Management & Timetable Coordination Platform

<p align="center">
  <strong>UCS503P Software Engineering Project · 2026–27 ODD</strong><br>
  Thapar Institute of Engineering and Technology
</p>

<p align="center">

[![Live Application](https://img.shields.io/badge/Live%20Application-Vercel-black?style=for-the-badge&logo=vercel)](https://timetable-maker-ucs503p.vercel.app/)
[![Repository](https://img.shields.io/badge/Source%20Code-GitHub-black?style=for-the-badge&logo=github)](https://github.com/Uddeshya112/ucs503p-202627odd-template)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

</p>

---

## 1. Project Overview

**TimeTable Maker** is a role-based web application designed to simplify the creation, management, and distribution of academic timetables.

Academic scheduling requires coordination between multiple resources such as faculty members, classrooms, student batches, subjects, and lecture periods. A change in one schedule can affect several other assignments.

TimeTable Maker brings these activities into a centralized application where each user can access the tools and information relevant to their role.

The platform currently supports three primary roles:

- **Academic Coordinator**
- **Faculty / Teacher**
- **Student**

The project focuses on timetable management, classroom allocation, faculty scheduling, conflict avoidance, lecture-swap coordination, and easy access to academic schedules.

---

## 2. Live Application

### Production

**https://timetable-maker-ucs503p.vercel.app/**

The application is deployed on Vercel and connected to the project's GitHub repository.

### Source Code

**https://github.com/Uddeshya112/ucs503p-202627odd-template**

---

## 3. Why TimeTable Maker?

Traditional academic timetable management can become difficult when several constraints have to be considered simultaneously.

These include:

- Faculty availability
- Classroom availability
- Student batches
- Subject schedules
- Lecture periods
- Faculty workload
- Room allocation
- Schedule changes
- Lecture swaps
- Timetable conflicts

TimeTable Maker provides a single interface for organizing these requirements and making schedule information accessible to the appropriate users.

---

## 4. Core Capabilities

### Timetable Management

Create, view and manage academic timetable information through a centralized application.

### Resource Management

Organize information related to:

- Classrooms
- Faculty
- Students
- Subjects
- Lecture slots

### Conflict Avoidance

The application validates timetable assignments to help prevent overlapping room, faculty, and batch assignments.

### Faculty Scheduling

Faculty members can access their personalized teaching schedules and relevant lecture information.

### Student Scheduling

Students can view their batch timetable, subject details, lecture periods and classroom information.

### Lecture Swaps

Faculty users can work with lecture-swap requests when schedule changes are required.

### Role-Based Access

Each user receives an interface based on their role and responsibilities.

---

# 5. User Experience

## Academic Coordinator

The Coordinator provides the central management interface for the academic scheduling environment.

### Coordinator capabilities

- Master timetable management
- Timetable generation
- Classroom management
- Room allocation
- Faculty management
- Student management
- Faculty workload information
- Conflict detection
- Academic schedule management
- Lecture-swap management

---

## Faculty / Teacher

Faculty members receive a personalized view of their teaching responsibilities.

### Faculty capabilities

- Weekly teaching timetable
- Assigned lectures
- Teaching schedule
- Faculty preferences
- Classroom information
- Lecture-swap requests
- Schedule information

---

## Student

Students receive a simplified timetable-focused interface.

### Student capabilities

- Batch timetable
- Subject information
- Lecture periods
- Classroom / room numbers
- Timetable filtering
- Print / export functionality
- Academic schedule access

---

# 6. Role-Based Access Model

| Role | Primary Responsibilities |
|---|---|
| **Academic Coordinator** | Manage academic schedules, rooms, faculty, students and timetable assignments |
| **Faculty / Teacher** | View teaching schedules, lectures, preferences and lecture-swap requests |
| **Student** | View timetable, subjects, periods, rooms and academic schedule information |

---

# 7. Application Flow

```text
                         ┌─────────────────────┐
                         │        LOGIN        │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   ROLE-BASED ACCESS │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
      │ Coordinator  │       │   Faculty    │       │   Student    │
      └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
             │                      │                      │
             ▼                      ▼                      ▼
      ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
      │ Timetable    │       │ Teaching     │       │ Class        │
      │ Management   │       │ Schedule     │       │ Timetable    │
      └──────┬───────┘       └──────────────┘       └──────────────┘
             │
             ▼
      ┌─────────────────────────┐
      │ Rooms • Faculty •       │
      │ Students • Conflicts •  │
      │ Lecture Swaps           │
      └─────────────────────────┘
