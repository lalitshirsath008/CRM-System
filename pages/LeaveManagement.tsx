
import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Clock, Calendar, MessageCircle } from 'lucide-react';
import { LeaveRequest, UserRole } from '../types';
import { api } from '../services/api';

const LeaveManagement: React.FC<{ role: UserRole, userId: string }> = ({ role, userId }) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setIsLoading(true);
    const data = role === UserRole.EMPLOYEE 
      ? await api.leaves.getByUserId(userId) 
      : await api.leaves.getAll();
    setLeaves(data);
    setIsLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await api.leaves.updateStatus(id, status);
    fetchLeaves();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Leave Management</h2>
          <p className="text-slate-500">Track and manage employee time-off requests.</p>
        </div>
        {role === UserRole.EMPLOYEE && (
            <button 
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
                <Plus size={20} />
                Apply for Leave
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Pending Requests</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{leaves.filter(l => l.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{leaves.filter(l => l.status === 'approved').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-rose-600 mt-1">{leaves.filter(l => l.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                {role !== UserRole.EMPLOYEE && <th className="px-6 py-4">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading leaves...</td></tr>
              ) : leaves.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No leave requests found.</td></tr>
              ) : leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{leave.userName}</p>
                    <p className="text-xs text-slate-500">Submitted {new Date(leave.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium capitalize text-slate-600">{leave.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex flex-col">
                        <span>{leave.startDate}</span>
                        <span className="text-slate-400 text-[10px]">to {leave.endDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{leave.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      leave.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {leave.status}
                    </span>
                  </td>
                  {role !== UserRole.EMPLOYEE && (
                    <td className="px-6 py-4">
                        {leave.status === 'pending' ? (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleUpdateStatus(leave.id, 'approved')}
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                                >
                                    <Check size={16} />
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(leave.id, 'rejected')}
                                    className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-400 italic">No actions</span>
                        )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">New Leave Application</h3>
                        <button onClick={() => setModalOpen(false)}><X className="text-slate-400" /></button>
                      </div>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                  <option>Sick Leave</option>
                                  <option>Casual Leave</option>
                                  <option>Paid Leave</option>
                              </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                  <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                              <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Please provide a brief reason..."></textarea>
                          </div>
                          <button 
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all mt-4"
                            onClick={() => setModalOpen(false)}
                          >
                              Submit Application
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LeaveManagement;
