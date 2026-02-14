import React, { useState } from "react";
import Register from "./Register";
import AttendanceHistory from "./AttendanceHistory";

const UserPlusIcon = () => (
  <svg className="w-12 h-12 text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const AdminPanel = () => {
  const [currentView, setCurrentView] = useState("menu");

  if (currentView === "register") {
    return (
      <div className="relative">
        <FloatingBackButton onClick={() => setCurrentView("menu")} />
        <Register />
      </div>
    );
  }

  if (currentView === "history") {
    return (
      <div className="relative">
        <FloatingBackButton onClick={() => setCurrentView("menu")} />
        <AttendanceHistory />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-6">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">Select an action to proceed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        <button
          onClick={() => setCurrentView("register")}
          className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
        >
          <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
            <UserPlusIcon />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-6 group-hover:text-emerald-600 transition-colors">
            New Registration
          </h2>
          <p className="text-slate-500 mt-2">
            Enroll new students or faculty into the biometric system.
          </p>
        </button>

        <button
          onClick={() => setCurrentView("history")}
          className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
        >
          <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
            <HistoryIcon />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-6 group-hover:text-blue-600 transition-colors">
            Attendance History
          </h2>
          <p className="text-slate-500 mt-2">
            View logs, check absenteeism, and export reports.
          </p>
        </button>

      </div>
    </div>
  );
};

const FloatingBackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed top-6 left-6 z-60 flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-black rounded-full shadow-lg hover:bg-slate-700 transition-all hover:pr-6 group font-medium text-sm"
  >
    <span className="group-hover:-translate-x-1 transition-transform">
      <BackIcon />
    </span>
    Back to Dashboard
  </button>
);

export default AdminPanel;