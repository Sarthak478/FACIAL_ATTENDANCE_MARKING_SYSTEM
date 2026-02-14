import React, { useState } from 'react';
import './App.css';

import AdminPanel from './AdminPanel';
import AdminLogin from './components/AdminLogin'; 
import AutoAttendance from './Auto_attendance';
import StartupGate from './components/StartupGate';

function App() {
  const [currentMode, setCurrentMode] = useState('home');

  return (
    <>
      {currentMode === 'home' && (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white relative overflow-hidden">
          
          <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]"></div>

          <div className="relative z-10 text-center mb-16 animate-in fade-in zoom-in duration-700">
            <div className="inline-block p-4 rounded-full bg-slate-800/50 border border-slate-700 shadow-2xl mb-6 backdrop-blur-md">
               <span className="text-5xl">🎓</span>
            </div>
            <h1 className="text-6xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Smart Campus
            </h1>
            <p className="text-slate-400 text-xl font-medium">Biometric Attendance & Management System</p>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            <button 
              onClick={() => setCurrentMode('user')}
              className="group w-72 h-48 bg-slate-800/80 backdrop-blur-xl border border-slate-700 hover:border-emerald-500 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <span className="text-3xl">📸</span>
              </div>
              <span className="text-2xl font-bold group-hover:text-emerald-400 transition-colors">User Panel</span>
              <span className="text-slate-400 text-sm mt-1 font-medium">Daily Attendance</span>
            </button>

            <button 
              onClick={() => setCurrentMode('admin_login')}
              className="group w-72 h-48 bg-slate-800/80 backdrop-blur-xl border border-slate-700 hover:border-indigo-500 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:-translate-y-2"
            >
               <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <span className="text-3xl">🛡️</span>
              </div>
              <span className="text-2xl font-bold group-hover:text-indigo-400 transition-colors">Admin Panel</span>
              <span className="text-slate-400 text-sm mt-1 font-medium">Restricted Access</span>
            </button>

          </div>

          <div className="absolute bottom-8 text-slate-600 text-sm font-medium">
            System Status: <span className="text-emerald-500">● Online</span>
          </div>
        </div>
      )}

{/* 2. ADMIN LOGIN GATE (The Security Layer) */}
      {currentMode === 'admin_login' && (
          <AdminLogin 
            onLoginSuccess={() => {
                console.log("🚀 App.jsx: Switching to Dashboard!");
                setCurrentMode('admin_dashboard');
            }} 
            onCancel={() => setCurrentMode('home')}
          />
      )}

      {currentMode === 'admin_dashboard' && (
         <AdminPanel onBackHome={() => setCurrentMode('home')} />
      )}

      {/* 4. USER PANEL (Kiosk) */}
      {currentMode === 'user' && (
         <div className="relative">
            <StartupGate>
               <AutoAttendance />
            </StartupGate>
         </div>
      )}
    </>
  );
}

export default App;