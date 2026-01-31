
import React from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { UserRole, User } from '../types.ts';

interface DashboardProps {
  user: User;
  stats: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isEmployee = user.role === UserRole.EMPLOYEE;
  
  const data = [
    { name: 'Mon', hours: 8.5 },
    { name: 'Tue', hours: 9.2 },
    { name: 'Wed', hours: 7.8 },
    { name: 'Thu', hours: 8.0 },
    { name: 'Fri', hours: 8.4 },
    { name: 'Sat', hours: 0 },
    { name: 'Sun', hours: 0 },
  ];

  const attendanceData = [
    { name: 'HR', count: 12 },
    { name: 'Eng', count: 45 },
    { name: 'Sales', count: 22 },
    { name: 'Mkt', count: 18 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.name} 👋</h2>
          <p className="text-slate-500">Here's what's happening in NexusOffice today.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <Calendar className="text-blue-600" size={24} />
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today's Date</p>
            <p className="text-sm font-semibold text-slate-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isEmployee ? (
          <>
            <StatCard icon={Clock} label="Today Login" value="08:45 AM" color="blue" />
            <StatCard icon={CheckCircle2} label="Status" value="On Time" color="emerald" />
            <StatCard icon={Calendar} label="Leave Balance" value="14 Days" color="amber" />
            <StatCard icon={TrendingUp} label="This Month" value="168 hrs" color="indigo" />
          </>
        ) : (
          <>
            <StatCard icon={Users} label="Total Employees" value="124" color="blue" />
            <StatCard icon={CheckCircle2} label="Present Today" value="112" color="emerald" />
            <StatCard icon={AlertCircle} label="Leave Requests" value="5" color="amber" />
            <StatCard icon={TrendingUp} label="Avg Productivity" value="94%" color="indigo" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Working Hours (Current Week)</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>This Week</option>
                <option>Last Week</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="hours" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">{isEmployee ? 'Department Performance' : 'Presence by Department'}</h3>
            <button className="text-blue-600 text-xs font-semibold hover:underline">View Details</button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Attendance</h3>
            <button className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Clock In</th>
                        <th className="px-6 py-4">Clock Out</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3].map((item) => (
                        <tr key={item} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                                        <img src={`https://picsum.photos/seed/user${item}/100`} alt="" />
                                    </div>
                                    <span className="font-medium text-slate-700">Employee {item}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 text-sm">May 18, 2024</td>
                            <td className="px-6 py-4 text-slate-600 text-sm font-semibold">09:00 AM</td>
                            <td className="px-6 py-4 text-slate-600 text-sm">05:30 PM</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item % 2 === 0 ? 'On Time' : 'Late'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) => {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start space-x-4">
            <div className={`p-3 rounded-2xl ${colorMap[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
        </div>
    );
};

export default Dashboard;
