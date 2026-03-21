// import React, { useState } from "react";
// import Register from "./Register";
// import AttendanceHistory from "./AttendanceHistory";

// const UserPlusIcon = () => (
//   <svg className="w-12 h-12 text-emerald-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//   </svg>
// );

// const HistoryIcon = () => (
//   <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//   </svg>
// );

// const BackIcon = () => (
//   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//   </svg>
// );

// const AdminPanel = () => {
//   const [currentView, setCurrentView] = useState("menu");

//   if (currentView === "register") {
//     return (
//       <div className="relative">
//         <FloatingBackButton onClick={() => setCurrentView("menu")} />
//         <Register />
//       </div>
//     );
//   }

//   if (currentView === "history") {
//     return (
//       <div className="relative">
//         <FloatingBackButton onClick={() => setCurrentView("menu")} />
//         <AttendanceHistory />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-6">
      
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard</h1>
//         <p className="text-slate-500 mt-2 text-lg">Select an action to proceed</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
//         <button
//           onClick={() => setCurrentView("register")}
//           className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
//         >
//           <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
//             <UserPlusIcon />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-800 mt-6 group-hover:text-emerald-600 transition-colors">
//             New Registration
//           </h2>
//           <p className="text-slate-500 mt-2">
//             Enroll new students or faculty into the biometric system.
//           </p>
//         </button>

//         <button
//           onClick={() => setCurrentView("history")}
//           className="group bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
//         >
//           <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
//             <HistoryIcon />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-800 mt-6 group-hover:text-blue-600 transition-colors">
//             Attendance History
//           </h2>
//           <p className="text-slate-500 mt-2">
//             View logs, check absenteeism, and export reports.
//           </p>
//         </button>

//       </div>
//     </div>
//   );
// };

// const FloatingBackButton = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="fixed top-6 left-6 z-60 flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-black rounded-full shadow-lg hover:bg-slate-700 transition-all hover:pr-6 group font-medium text-sm"
//   >
//     <span className="group-hover:-translate-x-1 transition-transform">
//       <BackIcon />
//     </span>
//     Back to Dashboard
//   </button>
// );

// export default AdminPanel;

import React, { useState } from "react";
import Register from "./Register";
import AttendanceHistory from "./AttendanceHistory";

const UserPlusIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const HistoryIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const BackIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const AdminPanel = ({ onBackHome }) => {
  const [currentView, setCurrentView] = useState("menu");

  if (currentView === "register") {
    return (
      <div className="relative">
        <FloatingBackButton onClick={() => setCurrentView("menu")} label="Back to Dashboard" />
        <Register />
      </div>
    );
  }

  if (currentView === "history") {
    return (
      <div className="relative">
        <FloatingBackButton onClick={() => setCurrentView("menu")} label="Back to Dashboard" />
        <AttendanceHistory />
      </div>
    );
  }

  return (
    /* ROOT: fixed inset-0 = true 100vw × 100vh, same pattern as App.jsx & AttendanceHistory */
    <div
      className="fixed inset-0 font-sans flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #f0f4ff 0%, #f8fafc 45%, #eef9f6 100%)',
      }}
    >

      {/* ── TOP HEADER — same DNA as AttendanceHistory header ────────────── */}
      <div
        className="relative overflow-hidden w-full shrink-0"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c4a6e 100%)',
        }}
      >
        {/* Ambient glow blobs */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 50%, #38bdf8 0%, transparent 50%), radial-gradient(circle at 85% 20%, #6366f1 0%, transparent 45%)',
          }}
        />

        {/* Back to home — sits inside header, left-aligned */}
        <button
          onClick={onBackHome}
          className="
            absolute left-6 top-1/2 -translate-y-1/2 z-20
            flex items-center gap-2 px-4 py-2 rounded-xl
            bg-white/10 border border-white/15 text-slate-300
            hover:bg-white/20 hover:text-white
            active:scale-95
            transition-all duration-200 text-sm font-semibold
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
          "
        >
          <BackIcon />
          Home
        </button>

        {/* Centred header content */}
        <div className="relative z-10 w-full px-8 py-9 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-sky-300 mb-3">
            <ShieldIcon />
          </div>
          <p className="text-sky-400 text-[0.62rem] font-black tracking-[0.28em] uppercase mb-1">
            Smart Campus · Authorized Access
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Select an action to proceed
          </p>

          {/* Shimmer line — matches AttendanceHistory */}
          <div className="mt-7 h-px w-full bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
        </div>
      </div>

      {/* ── MAIN CONTENT — vertically centred in remaining space ─────────── */}
      <div className="flex-1 flex items-center justify-center px-8 py-10 overflow-y-auto">
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── NEW REGISTRATION CARD ────────────────────────────────────── */}
          <button
            onClick={() => setCurrentView("register")}
            className="
              group relative overflow-hidden
              bg-white rounded-3xl border border-slate-200/80
              p-10 flex flex-col items-center text-center
              hover:-translate-y-1.5 hover:border-emerald-300
              active:scale-[0.98]
              transition-all duration-300 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
            "
            style={{
              boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px -8px rgba(16,185,129,0.20), 0 4px 12px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)'}
          >
            {/* Colour accent rail — top */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-3xl
              scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

            {/* Icon */}
            <div className="
              w-20 h-20 rounded-2xl mb-6
              bg-gradient-to-br from-emerald-100 to-teal-100
              border border-emerald-200/60
              flex items-center justify-center text-emerald-600
              group-hover:from-emerald-200 group-hover:to-teal-200
              transition-colors duration-300
            ">
              <UserPlusIcon />
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors duration-200">
              New Registration
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Enroll new students or faculty into the biometric system.
            </p>

            {/* CTA hint */}
            <div className="mt-6 inline-flex items-center gap-1.5 text-[0.68rem] font-black tracking-[0.18em] uppercase
              text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Get Started
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

          {/* ── ATTENDANCE HISTORY CARD ──────────────────────────────────── */}
          <button
            onClick={() => setCurrentView("history")}
            className="
              group relative overflow-hidden
              bg-white rounded-3xl border border-slate-200/80
              p-10 flex flex-col items-center text-center
              hover:-translate-y-1.5 hover:border-sky-300
              active:scale-[0.98]
              transition-all duration-300 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
            "
            style={{
              boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px -8px rgba(14,165,233,0.22), 0 4px 12px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)'}
          >
            {/* Colour accent rail — top */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-t-3xl
              scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

            {/* Icon */}
            <div className="
              w-20 h-20 rounded-2xl mb-6
              bg-gradient-to-br from-sky-100 to-indigo-100
              border border-sky-200/60
              flex items-center justify-center text-sky-600
              group-hover:from-sky-200 group-hover:to-indigo-200
              transition-colors duration-300
            ">
              <HistoryIcon />
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-sky-700 transition-colors duration-200">
              Attendance History
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              View logs, check absenteeism, and export reports.
            </p>

            {/* CTA hint */}
            <div className="mt-6 inline-flex items-center gap-1.5 text-[0.68rem] font-black tracking-[0.18em] uppercase
              text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View Reports
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>

        </div>
      </div>

      {/* ── FOOTER WATERMARK ─────────────────────────────────────────────── */}
      <div className="shrink-0 pb-5 text-center">
        <p className="text-[0.62rem] text-slate-400 font-medium tracking-[0.25em] uppercase select-none">
          Smart Campus · v2.0 · Powered by AI
        </p>
      </div>

    </div>
  );
};

const FloatingBackButton = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="
      fixed top-6 left-6 z-[60]
      flex items-center gap-2 px-4 py-2.5 rounded-xl
      bg-slate-900/90 backdrop-blur-sm border border-white/10
      text-slate-300 hover:text-white hover:bg-slate-800
      active:scale-95
      shadow-lg transition-all duration-200 text-sm font-semibold
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400
    "
  >
    <BackIcon />
    {label}
  </button>
);

export default AdminPanel;