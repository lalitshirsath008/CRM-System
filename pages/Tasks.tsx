
import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, CheckCircle, X } from 'lucide-react';
import { Task, User } from '../types.ts';
import { api } from '../services/api.ts';

const TasksPage: React.FC<{ user: User }> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    assignedTo: user.id, 
    assignedToName: user.name,
    priority: 'medium' as any 
  });

  useEffect(() => {
    setIsLoading(true);
    const unsubscribeTasks = api.tasks.subscribe(user.companyId, (data) => {
        setTasks(data);
        setIsLoading(false);
    });

    const unsubscribeUsers = api.users.getAll(user.companyId, (users) => setTeam(users));

    const interval = setInterval(() => setTasks(prev => [...prev]), 1000);
    
    return () => {
        unsubscribeTasks();
        unsubscribeUsers();
        clearInterval(interval);
    };
  }, [user.companyId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = team.find(u => u.id === newTask.assignedTo);
    await api.tasks.create({ ...newTask, assignedToName: assignee?.name }, user);
    setModalOpen(false);
    setNewTask({ title: '', description: '', assignedTo: user.id, assignedToName: user.name, priority: 'medium' });
  };

  const formatDuration = (task: Task) => {
    let total = task.timeSpent || 0;
    if (task.timerStartedAt) {
      const active = (new Date().getTime() - new Date(task.timerStartedAt).getTime()) / 1000;
      total += Math.floor(active);
    }
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = Math.floor(total % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'Backlog', color: 'bg-slate-100' },
    { id: 'in-progress', title: 'Active', color: 'bg-blue-50' },
    { id: 'completed', title: 'Verified', color: 'bg-emerald-50' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Task Engineering</h2>
          <p className="text-slate-500 font-medium">Node: {user.companyId}</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl transition-all"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map(col => (
          <div key={col.id} className={`${col.color} p-6 rounded-[2.5rem] min-h-[600px] border border-slate-200/40`}>
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-[10px]">{col.title}</h3>
              <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-500 border border-slate-100">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div className="space-y-6">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                      task.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority}
                    </span>
                    {task.status !== 'completed' && (
                        <CheckCircle 
                            size={18} 
                            className="text-slate-200 hover:text-emerald-500 cursor-pointer transition-colors" 
                            onClick={() => api.tasks.updateStatus(task.id, 'completed', user)} 
                        />
                    )}
                  </div>
                  
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">{task.title}</h4>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">{task.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedToName || 'U')}&background=random`} className="w-8 h-8 rounded-xl" />
                        <span className={`text-[11px] font-mono font-black ${task.timerStartedAt ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`}>
                            {formatDuration(task)}
                        </span>
                    </div>
                    
                    {task.status !== 'completed' && task.assignedTo === user.id && (
                        <button 
                          onClick={() => api.tasks.toggleTimer(task.id, !task.timerStartedAt)}
                          className={`p-3 rounded-2xl transition-all ${
                            task.timerStartedAt ? 'bg-rose-50 text-rose-600 shadow-inner' : 'bg-blue-600 text-white'
                          }`}
                        >
                          {task.timerStartedAt ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
                <form onSubmit={handleCreateTask} className="p-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Requirement</h3>
                        <button type="button" onClick={() => setModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl"><X size={24} /></button>
                    </div>

                    <div className="space-y-6">
                        <input 
                            required value={newTask.title}
                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold" 
                            placeholder="Task Name"
                        />
                        <textarea 
                            required value={newTask.description}
                            onChange={e => setNewTask({...newTask, description: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-medium" 
                            placeholder="Technical Requirements..."
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <select 
                                value={newTask.assignedTo}
                                onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold"
                            >
                                {team.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                            <select 
                                value={newTask.priority}
                                onChange={e => setNewTask({...newTask, priority: e.target.value})}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium</option>
                                <option value="high">Critical</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl">
                        Deploy Task
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
