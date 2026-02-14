import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/daily/history";

const SearchIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>;
const CalendarIcon = () => <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;
const UserIcon = () => <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;

const AttendanceHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchId, setSearchId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = { userId: searchId, startDate, endDate };
      const res = await axios.get(API_URL, { params });
      setLogs(res.data);
      if (searchId) calculateStats(res.data, searchId);
      else setStats(null);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchLogs(), 500);
    return () => clearTimeout(timer);
  }, [searchId, startDate, endDate]);

  const calculateStats = (userLogs, targetUserId) => {
    if (!userLogs.length) return;
    const getDay = (d) => new Date(d).toISOString().split('T')[0];
    const allDays = new Set(userLogs.map(log => getDay(log.date || log.timestamp)));
    const totalDays = allDays.size;
    const myLogs = userLogs.filter(log => log.userId && log.userId.toLowerCase().includes(targetUserId.toLowerCase()));
    const myDays = new Set(myLogs.map(log => getDay(log.date || log.timestamp))).size;
    const percentage = totalDays === 0 ? 0 : ((myDays / totalDays) * 100).toFixed(1);
    setStats({ totalDays, present: myDays, absent: totalDays - myDays, percentage });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      
      <div className="bg-white border-b border-slate-200">
        <div className="w-full px-4 md:px-32 lg:px-64 py-6">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Attendance Reports</h1>
          <p className="text-slate-500 text-sm mt-1">View logs and track student attendance.</p>
        </div>
      </div>

      <div className="w-full px-4 md:px-32 lg:px-64 mt-8 space-y-6">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="md:col-span-5 p-4">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Search Student</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-slate-400"><SearchIcon /></div>
                <input 
                  type="text" 
                  placeholder="Enter User ID"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-3 p-4">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">From</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-slate-400"><CalendarIcon /></div>
                <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>
            <div className="md:col-span-4 p-4">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">To</label>
              <div className="relative group">
                <div className="absolute left-3 top-3 text-slate-400"><CalendarIcon /></div>
                <input type="date" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {searchId && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-xs font-bold uppercase">Total Days</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.totalDays}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-xs font-bold uppercase">Present</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.present}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-xs font-bold uppercase">Absent</p>
              <p className="text-3xl font-extrabold text-rose-500 mt-1">{stats.absent}</p>
            </div>
            <div className={`p-5 rounded-2xl shadow-sm border flex flex-col justify-center
              ${Number(stats.percentage) < 75 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className={`text-xs font-bold uppercase ${Number(stats.percentage) < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>Score</p>
              <p className={`text-4xl font-black mt-1 ${Number(stats.percentage) < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>{stats.percentage}%</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 shrink-0"><UserIcon /></div>
                          <div>
                            <div className="font-semibold text-slate-900">{log.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{log.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase
                          ${(log.role || '').toLowerCase() === 'faculty' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {log.role || 'Student'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{new Date(log.date || log.timestamp).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">{log.time || new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Present
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><SearchIcon /></div>
              <h3 className="text-lg font-semibold text-slate-900">No records found</h3>
              <p className="text-slate-500 max-w-sm mt-1">Try adjusting the dates or ID.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AttendanceHistory;