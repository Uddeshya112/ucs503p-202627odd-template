/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import CoordinatorView from "./components/CoordinatorView";
import FacultyView from "./components/FacultyView";
import StudentView from "./components/StudentView";
import LoginView from "./components/LoginView";
import { LogOut, User } from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Simple local storage persistence for demo purposes
  useEffect(() => {
    const saved = localStorage.getItem('intelli_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('intelli_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('intelli_user');
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-lg">
            IS
          </div>
          <div className="font-bold text-xl tracking-tight">TimeTable Maker</div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <User className="h-4 w-4" />
            <span className="font-medium text-slate-100">{currentUser.name}</span>
            <span className="opacity-50">({currentUser.role})</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {currentUser.role === "coordinator" && <CoordinatorView />}
        {currentUser.role === "faculty" && <FacultyView facultyId={currentUser.refId || currentUser.id} />}
        {currentUser.role === "student" && <StudentView sectionId={currentUser.refId || currentUser.id} />}
      </main>
    </div>
  );
}
