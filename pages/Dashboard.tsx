
import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, TrendingUp, Bell, Activity, Terminal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserRole, User, Announcement, AuditLog } from '../types.ts';
import { api } from '../services/api.ts';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [news, setNews] = useState<Announcement[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    const unsubUsers = api.users.getAll(user.companyId, (data) => setOnlineUsers(data));
    const unsubNews = api.announcements.subscribe(user.companyId, (data) => setNews(data));
    const unsubLogs = api.audit.subscribe(user.companyId, (data) => setLogs(data));

    return () => {
        unsubUsers();
        unsubNews();
        unsubLogs();
    };
  }, [user.companyId]);

  const data = [
    { name: 'Mon', hours: 8.5 }, { name: 'Tue', hours: 9.2 }, { name: 'Wed', hours: 7.8 },
    { name: 'Thu', hours: 8.0 }, { name: 'Fri', hours: 8.4 }, { name: 'Sat', hours: 2.1 }, { name: 'Sun', hours: 0 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-950 tracking-tight">Corporate Dashboard</h2>
          <p className="text-slate-500 font-medium">Real-time Node: {user.companyId}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Sync Active</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard icon={TrendingUp} label="Efficiency" value="94.2%" color="blue" />
                <StatCard icon={Clock} label="System Latency" value="12ms" color="emerald" />
                <StatCard icon={Users} label="Total Staff" value={onlineUsers.length.toString()} color="indigo" />
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <h3 className="font-black text-slate-800 mb-10 uppercase tracking-widest text-xs flex items-center gap-2">
                    <Activity size={16} className="text-blue-600" />
                    Global Workforce Activity
                </h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                            <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 800}} />
                            <Area type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={4} fill="url(#colorHours)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {user.role !== UserRole.EMPLOYEE && (
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                    <h3 className="font-black mb-8 uppercase tracking-widest text-[10px] flex items-center gap-3 text-blue-400">
                        <Terminal size={16} />
                        Security Event Stream
                    </h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                        {logs.map(log => (
                            <div key={log.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                                        {log.action.split('_')[0]}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-100">{log.details}</p>
                                        <p className="text-[10px] text-slate-500">{log.userName}</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono text-slate-600">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-widest text-[10px]">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    Live Presence
                </h3>
                <div className="space-y-6 max-h-80 overflow-y-auto pr-2">
                    {onlineUsers.map(u => (
                        <div key={u.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`} className="w-10 h-10 rounded-2xl" />
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-4 border-white rounded-full ${u.presence === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{u.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{u.department}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="font-black mb-6 flex items-center gap-3 uppercase tracking-widest text-[10px] text-blue-100">
                    <Bell size={18} />
                    Corporate News
                </h3>
                <div className="space-y-6">
                    {news.map(n => (
                        <div key={n.id} className="relative pl-6">
                            <div className="absolute left-0 top-1 w-1 h-12 bg-white/20 rounded-full" />
                            <h4 className="text-sm font-black mb-2">{n.title}</h4>
                            <p className="text-xs text-blue-100/70 line-clamp-2">{n.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    };
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex items-center gap-6 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className={`p-4 rounded-2xl ${colors[color]}`}><Icon size={24} /></div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
        </div>
    );
};

export default Dashboard;
