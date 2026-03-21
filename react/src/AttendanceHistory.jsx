import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/daily/history";

// ── Icons ──────────────────────────────────────────────────────────────────
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
);
const CalendarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
);
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);
const GraduationIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
  </svg>
);

const AttendanceHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // FIX: Added 'isSilent' so the background updates don't flash the loading spinner
  const fetchLogs = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      // FIX: Added 't: Date.now()' to destroy the 304 browser cache
      const params = { 
        userId: searchId, 
        startDate, 
        endDate, 
        t: Date.now() 
      };
      
      const res = await axios.get(API_URL, { params });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };
  useEffect(() => {
    // 1. Fetch immediately on load (shows loading spinner)
    const initialTimer = setTimeout(() => fetchLogs(false), 300);

    // 2. Set up a silent background loop to fetch every 3 seconds
    const intervalId = setInterval(() => {
      fetchLogs(true);
    }, 3000); 

    // Cleanup interval on unmount or when filters change
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [searchId, startDate, endDate]);

  // ── 1. DATE FILTERING (Crash-Proof) ──────────────────────────────────────
  // ── 1. DATE FILTERING (Demo Bypass) ──────────────────────────────────────
  const dateFilteredLogs = logs.filter((log) => {
    // 🔥 DEMO FIX: If no dates are selected in the UI, show absolutely EVERYTHING
    if (!startDate && !endDate) return true; 

    const rawDate = log.date || log.timestamp;
    if (!rawDate) return true; 

    const logDate = new Date(rawDate);
    if (isNaN(logDate.getTime())) return true; // Don't hide unparseable dates

    logDate.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(0, 0, 0, 0);

    const matchesStart = !start || logDate >= start;
    const matchesEnd = !end || logDate <= end;

    return matchesStart && matchesEnd;
  });

  // ── 2. SEARCH FILTERING ──────────────────────────────────────────────────
  const searchLower = searchId.toLowerCase();
  const filteredLogs = dateFilteredLogs.filter((log) => {
    return searchId === "" || 
      (log.userId && log.userId.toLowerCase().includes(searchLower)) ||
      (log.name && log.name.toLowerCase().includes(searchLower));
  });

  // ── 3. DYNAMIC STATS CALCULATION (Crash-Proof) ───────────────────────────
  let stats = null;
  if (searchId) {
    const getDay = (d) => {
      if (!d) return null;
      const dateObj = new Date(d);
      return isNaN(dateObj.getTime()) ? null : dateObj.toISOString().split('T')[0];
    };
    
    const allDays = new Set(
      dateFilteredLogs.map(log => getDay(log.date || log.timestamp)).filter(Boolean)
    );
    const totalDays = allDays.size;
    
    const myDays = new Set(
      filteredLogs.map(log => getDay(log.date || log.timestamp)).filter(Boolean)
    ).size;
    
    const percentage = totalDays === 0 ? 0 : ((myDays / totalDays) * 100).toFixed(1);
    const absent = totalDays - myDays;
    
    stats = { totalDays, present: myDays, absent, percentage };
  }

  const isGoodScore = Number(stats?.percentage) >= 75;

  return (
    <div
      className="fixed inset-0 overflow-y-auto font-sans text-slate-800"
      style={{
        background: 'linear-gradient(145deg, #f0f4ff 0%, #f8fafc 45%, #eef9f6 100%)',
      }}
    >

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden w-full"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c4a6e 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 50%, #38bdf8 0%, transparent 50%), radial-gradient(circle at 85% 20%, #6366f1 0%, transparent 45%)',
          }}
        />

        <div className="relative z-10 w-full px-8 lg:px-16 py-9 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/15 text-sky-300 shrink-0">
              <GraduationIcon />
            </div>
            <div>
              <p className="text-sky-400 text-[0.62rem] font-black tracking-[0.28em] uppercase mb-1">
                Smart Campus · Admin Panel
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                Attendance Reports
              </h1>
              <p className="text-slate-400 text-sm mt-2 font-medium">
                View logs and track student attendance
              </p>
            </div>
          </div>
          <div className="mt-7 h-px w-full bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
        </div>
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────────────── */}
      <div className="w-full px-8 lg:px-16 mt-8 pb-16 space-y-6">

        {/* ── FILTER BAR ─────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden border border-slate-200/80 w-full"
          style={{ boxShadow: '0 4px 24px -4px rgba(14,165,233,0.10), 0 1px 4px rgba(0,0,0,0.05)' }}
        >
          <div className="bg-white/80 backdrop-blur-sm w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">

              <div className="md:col-span-5 px-6 py-5">
                <label className="block text-[0.62rem] font-black text-slate-400 tracking-[0.2em] uppercase mb-2.5">
                  Search Student
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <SearchIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter User ID or name…"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                      placeholder:text-slate-400 text-slate-700 font-medium
                      focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400
                      transition-all duration-200"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-3 px-6 py-5">
                <label className="block text-[0.62rem] font-black text-slate-400 tracking-[0.2em] uppercase mb-2.5">
                  From
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <CalendarIcon />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                      text-slate-700 font-medium
                      focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400
                      transition-all duration-200"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-4 px-6 py-5">
                <label className="block text-[0.62rem] font-black text-slate-400 tracking-[0.2em] uppercase mb-2.5">
                  To
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <CalendarIcon />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                      text-slate-700 font-medium
                      focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400
                      transition-all duration-200"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── STATS CARDS ────────────────────────────────────────────────── */}
        {searchId && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">

            <div
              className="bg-white rounded-2xl border border-slate-200/80 p-5 relative overflow-hidden"
              style={{ boxShadow: '0 4px 20px -4px rgba(0,0,0,0.07)' }}
            >
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-slate-300" />
              <p className="text-[0.62rem] font-black tracking-[0.2em] uppercase text-slate-400 ml-3">Total Days</p>
              <p className="text-4xl font-black text-slate-800 mt-1 ml-3">{stats.totalDays}</p>
            </div>

            <div
              className="bg-white rounded-2xl border border-emerald-100 p-5 relative overflow-hidden"
              style={{ boxShadow: '0 4px 20px -4px rgba(16,185,129,0.15)' }}
            >
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-emerald-400" />
              <p className="text-[0.62rem] font-black tracking-[0.2em] uppercase text-emerald-600 ml-3">Present</p>
              <p className="text-4xl font-black text-emerald-600 mt-1 ml-3">{stats.present}</p>
            </div>

            <div
              className="bg-white rounded-2xl border border-rose-100 p-5 relative overflow-hidden"
              style={{ boxShadow: '0 4px 20px -4px rgba(244,63,94,0.12)' }}
            >
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-rose-400" />
              <p className="text-[0.62rem] font-black tracking-[0.2em] uppercase text-rose-500 ml-3">Absent</p>
              <p className="text-4xl font-black text-rose-500 mt-1 ml-3">{stats.absent}</p>
            </div>

            <div
              className={`rounded-2xl border p-5 relative overflow-hidden ${
                isGoodScore ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
              }`}
              style={{
                boxShadow: isGoodScore
                  ? '0 4px 20px -4px rgba(16,185,129,0.2)'
                  : '0 4px 20px -4px rgba(244,63,94,0.15)',
              }}
            >
              <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${isGoodScore ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <p className={`text-[0.62rem] font-black tracking-[0.2em] uppercase ml-3 ${isGoodScore ? 'text-emerald-600' : 'text-rose-600'}`}>
                Score
              </p>
              <p className={`text-4xl font-black mt-1 ml-3 ${isGoodScore ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stats.percentage}%
              </p>
              <div className="ml-3 mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isGoodScore ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>

          </div>
        )}

        {/* ── TABLE ──────────────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden w-full"
          style={{ boxShadow: '0 4px 24px -4px rgba(14,165,233,0.08), 0 1px 4px rgba(0,0,0,0.04)' }}
        >

          {loading && (
            <div className="flex items-center justify-center gap-3 py-6 text-sky-500 text-sm font-semibold border-b border-slate-100">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Loading records…
            </div>
          )}

          {filteredLogs.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #f8fafc 0%, #f0f9ff 100%)' }}>
                    {['User', 'Role', 'Date', 'Time', 'Status'].map((h, i) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-[0.62rem] font-black text-slate-400 tracking-[0.2em] uppercase border-b border-slate-100 ${
                          i === 4 ? 'text-right' : ''
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => {
                    const rawLogDate = log.date || log.timestamp;
                    const logDateObj = new Date(rawLogDate);
                    const isValidDate = !isNaN(logDateObj.getTime());

                    return (
                      <tr
                        key={log._id || Math.random()}
                        className="group border-b border-slate-50 last:border-0 transition-colors duration-150 hover:bg-sky-50/60"
                      >
                        <td className="px-6 py-4">
  <div className="flex items-center gap-3">
    <div className="
      h-9 w-9 rounded-xl shrink-0
      bg-gradient-to-br from-indigo-100 to-sky-100
      border border-indigo-100
      flex items-center justify-center text-indigo-500
      group-hover:from-indigo-200 group-hover:to-sky-200
      transition-colors duration-150
    ">
      <UserIcon />
    </div>
    <div>
      {/* FIX: User ID is now the main bold text, Name is below it */}
      <div className="font-bold text-slate-800 text-sm leading-tight font-mono">
        {log.userId || "Unknown ID"}
      </div>
      <div className="text-[0.68rem] text-slate-400 mt-0.5 truncate max-w-[220px]">
        {log.name || "Unknown Name"}
      </div>
    </div>
  </div>
</td>

                        <td className="px-6 py-4">
                          <span className={`
                            inline-flex items-center px-2.5 py-1 rounded-lg text-[0.62rem] font-black tracking-wider uppercase
                            ${(log.role || '').toLowerCase() === 'faculty'
                              ? 'bg-violet-100 text-violet-700 border border-violet-200'
                              : 'bg-sky-100 text-sky-700 border border-sky-200'}
                          `}>
                            {log.role || 'Student'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
  {isValidDate 
    ? logDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
    : String(rawLogDate || "Just now").split('T')[0]
  }
</td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500 font-mono bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                            {log.time || (isValidDate ? logDateObj.toLocaleTimeString() : "—")}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span className="
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                            text-[0.62rem] font-black tracking-wider uppercase
                            bg-emerald-100 text-emerald-700 border border-emerald-200
                          ">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </span>
                            Present
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : !loading ? (
            <div className="flex flex-col items-center justify-center py-28 text-center px-6">
              <div className="
                w-16 h-16 rounded-2xl mb-5
                bg-gradient-to-br from-slate-100 to-sky-100
                border border-slate-200
                flex items-center justify-center text-slate-400
              ">
                <SearchIcon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-700">No records found</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-xs">
                Try adjusting the date range or entering a different User ID.
              </p>
            </div>
          ) : null}

          {filteredLogs.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <p className="text-[0.68rem] text-slate-400 font-medium">
                Showing <span className="text-slate-600 font-bold">{filteredLogs.length}</span> records
              </p>
              <div className="h-px flex-1 mx-4 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              <p className="text-[0.68rem] text-slate-400 font-medium tracking-widest uppercase">
                Smart Campus · Reports
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;