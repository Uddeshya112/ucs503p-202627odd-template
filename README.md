# TimeTable Maker

An intelligent academic timetable scheduling, room allocation, and lecture-swap management web application built with React, Vite, Tailwind CSS, and Node.js.

## ✨ Features

- **Multi-Role Access Control**:
  - **Academic Coordinator**: Master scheduling, room management, faculty workload limits, conflict detection, and timetable generation.
  - **Faculty / Teachers**: Personalized weekly teaching timetable, preference submissions, and lecture-swap requests.
  - **Students**: Filterable batch timetables, room numbers, subject details, and print/export functionality.
- **Interactive Registration & Login**: Real-time sign in and new user registration for Students, Teachers, and Coordinators.
- **Conflict Avoidance Engine**: Intelligent slot validation avoiding overlapping room, faculty, or batch assignments.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```

## 🌐 Deploying to Vercel
This repository is configured with `vercel.json`:
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- Set root directory to `./` and deployment will build automatically.

## 🔑 Default Demo Accounts
- **Coordinator**: `admin@college.edu` / `password`
- **Faculty / Teacher**: `sharma@college.edu` / `password`
- **Student**: `student@college.edu` / `password`
