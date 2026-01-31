
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, MoreHorizontal, X } from 'lucide-react';
import { User, UserRole } from '../types.ts';
import { api } from '../services/api.ts';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
        const data = await api.users.getAll();
        setEmployees(data);
    } catch (error) {
        console.error("Failed to load employees", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Employee Directory</h2>
          <p className="text-slate-500">Manage your workforce and system access.</p>
        </div>
        <button 
            onClick={() => setModalOpen(true)}
            className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-xl transition-all active:scale-95"
        >
            <Plus size={20} />
            Add Employee
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search by name, email, department..." 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>
            <div className="flex gap-2">
                <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                    <option>All Departments</option>
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Sales</option>
                </select>
                <button className="bg-white border border-slate-200 p-2 rounded-xl text-slate-500 hover:bg-slate-50 shadow-sm">
                    <MoreHorizontal size={20} />
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Employee info</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joining Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading directory...</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`} alt="" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{emp.name}</p>
                        <p className="text-xs text-slate-400 truncate">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                        {emp.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 capitalize">{emp.role.replace('-', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {emp.joiningDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-xs font-bold text-slate-700 capitalize">{emp.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
               <div className="p-8">
                   <div className="flex justify-between items-center mb-8">
                     <div>
                        <h3 className="text-2xl font-bold text-slate-800">Register Employee</h3>
                        <p className="text-sm text-slate-500">Add a new staff member to the organization.</p>
                     </div>
                     <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="text-slate-400" /></button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Full Name</label>
                           <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Johnathan Doe" />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Email Address</label>
                           <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="j.doe@company.com" />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Department</label>
                           <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                               <option>Engineering</option>
                               <option>Design</option>
                               <option>Sales</option>
                               <option>Marketing</option>
                           </select>
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Role</label>
                           <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                               <option value={UserRole.EMPLOYEE}>Standard Employee</option>
                               <option value={UserRole.MANAGER}>Department Manager</option>
                               <option value={UserRole.SUPER_ADMIN}>System Admin</option>
                           </select>
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Mobile Number</label>
                           <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+1 (555) 000-0000" />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Joining Date</label>
                           <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                       </div>
                   </div>

                   <div className="mt-10 flex gap-4">
                        <button 
                            onClick={() => setModalOpen(false)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
                            onClick={() => setModalOpen(false)}
                        >
                            Create Account
                        </button>
                   </div>
               </div>
           </div>
       </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
