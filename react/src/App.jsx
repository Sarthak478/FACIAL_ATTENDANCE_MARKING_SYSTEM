import React, { useState } from 'react';
import './App.css';

import AdminPanel from './AdminPanel';
import AdminLogin from './components/AdminLogin'; 
import AutoAttendance from './Auto_attendance';
import StartupGate from './components/StartupGate';

const BG_VIDEO = "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4";

function App() {
  const [currentMode, setCurrentMode] = useState('home');

  return (
    <>
      {currentMode === 'home' && (
        <div className="fixed inset-0 flex items-center justify-center font-sans overflow-hidden bg-slate-950">

          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          >
            <source src={BG_VIDEO} type="video/mp4" />
          </video>

          <div className="absolute inset-0 z-[1] bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-sky-950/60" />

          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.70) 100%)' }}
          />

          <div className="absolute top-[10%] left-[10%] w-[28rem] h-[28rem] rounded-full bg-sky-600/10 blur-[100px] z-[1] pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-[22rem] h-[22rem] rounded-full bg-indigo-600/12 blur-[90px] z-[1] pointer-events-none" />

          <div className="relative z-10 w-full max-w-xl px-6">

            <div className="
              relative
              rounded-[2.25rem]
              border border-white/[0.09]
              bg-white/[0.05]
              backdrop-blur-2xl
              shadow-[0_40px_120px_-20px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.10)]
              px-10 sm:px-14 py-14
              text-white text-center
              overflow-hidden
            ">

              <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none">
                <div className="w-3/5 h-px bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" />
              </div>

              {/* HEADER */}
              <div className="mb-12">
                <div className="
                  inline-flex items-center justify-center
                  w-[5.5rem] h-[5.5rem] rounded-[1.4rem]
                  bg-gradient-to-br from-sky-500/25 to-indigo-600/25
                  border border-white/10
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_30px_rgba(14,165,233,0.2)]
                  mb-6 text-[3rem] select-none
                ">
                  🎓
                </div>

                <h1 className="
                  text-[2.75rem] sm:text-5xl font-black tracking-tight leading-none
                  bg-gradient-to-b from-white via-slate-100 to-slate-400
                  bg-clip-text text-transparent
                ">
                  Smart Campus
                </h1>

                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  border border-sky-500/25 bg-sky-500/10 text-sky-300
                  text-[0.7rem] font-semibold tracking-[0.18em] uppercase"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
                  AI Powered Facial Attendance System
                </div>

                <div className="mt-10 mx-auto w-12 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center">

                <button
                  onClick={() => setCurrentMode('user')}
                  className="
                    group relative w-full sm:w-56 h-44 rounded-2xl overflow-hidden
                    bg-gradient-to-br from-emerald-500 to-teal-600
                    hover:from-emerald-400 hover:to-teal-500
                    active:scale-[0.97]
                    transition-all duration-300 ease-out
                    shadow-[0_8px_28px_rgba(16,185,129,0.30)]
                    hover:shadow-[0_14px_40px_rgba(16,185,129,0.50)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
                    flex flex-col items-center justify-center gap-2 cursor-pointer
                  "
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
                  <span className="text-[2.5rem] mb-1 drop-shadow transition-transform duration-300 group-hover:-translate-y-1 select-none">📸</span>
                  <span className="text-lg font-bold tracking-tight">Mark Attendance</span>
                  <span className="text-[0.7rem] font-semibold tracking-widest uppercase opacity-80 bg-black/20 px-3 py-1 rounded-full">
                    Student Entry
                  </span>
                </button>

                <button
                  onClick={() => setCurrentMode('admin_login')}
                  className="
                    group relative w-full sm:w-56 h-44 rounded-2xl overflow-hidden
                    bg-gradient-to-br from-indigo-500 to-blue-600
                    hover:from-indigo-400 hover:to-blue-500
                    active:scale-[0.97]
                    transition-all duration-300 ease-out
                    shadow-[0_8px_28px_rgba(99,102,241,0.30)]
                    hover:shadow-[0_14px_40px_rgba(99,102,241,0.50)]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
                    flex flex-col items-center justify-center gap-2 cursor-pointer
                  "
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
                  <span className="text-[2.5rem] mb-1 drop-shadow transition-transform duration-300 group-hover:-translate-y-1 select-none">🛡️</span>
                  <span className="text-lg font-bold tracking-tight">Admin Panel</span>
                  <span className="text-[0.7rem] font-semibold tracking-widest uppercase opacity-80 bg-black/20 px-3 py-1 rounded-full">
                    Authorized Access
                  </span>
                </button>

              </div>

              <div className="mt-12 flex items-center justify-center gap-2.5 text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-slate-500">
                System Status
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Online
                </span>
              </div>

              <div className="absolute bottom-0 inset-x-0 flex justify-center pointer-events-none">
                <div className="w-2/5 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
              </div>

            </div>

            <p className="mt-5 text-center text-slate-600 text-[0.65rem] tracking-[0.25em] uppercase select-none">
              Smart Campus · v2.0 · Powered by AI
            </p>

          </div>
        </div>
      )}

      {/* ADMIN LOGIN */}
      {currentMode === 'admin_login' && (
        <AdminLogin
          onLoginSuccess={() => setCurrentMode('admin_dashboard')}
          onCancel={() => setCurrentMode('home')}
        />
      )}

      {/* ADMIN DASHBOARD */}
      {currentMode === 'admin_dashboard' && (
        <AdminPanel onBackHome={() => setCurrentMode('home')} />
      )}

      {/* USER PANEL */}
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