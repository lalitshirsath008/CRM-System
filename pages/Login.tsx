
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, Info, Building2, UserPlus, HelpCircle, Zap, CheckCircle2, AlertTriangle, ShieldAlert, Loader2 } from 'lucide-react';
import { api } from '../services/api.ts';

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showHelper, setShowHelper] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyId: 'DEMO', // Pre-filled default to avoid empty field error
    department: 'Engineering'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    
    try {
        if (isRegister) {
            await api.auth.register(formData);
        } else {
            await api.auth.login(formData.email, formData.password);
        }
    } catch (err: any) {
        setError(err.message || 'Authentication failed. Check your connection.');
    } finally {
        setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (!formData.companyId || formData.companyId.trim() === '') {
        setError("Please type a Company Name in the 'Company Identifier' box first!");
        return;
    }
    setSeedLoading(true);
    setError('');
    setSuccessMsg('');
    try {
        await api.auth.seedDemoUsers(formData.companyId);
        setSuccessMsg(`SUCCESS! Demo accounts created for ${formData.companyId}. Please check the 'Authentication' tab in your Firebase Console.`);
        setShowHelper(true);
    } catch (err: any) {
        console.error("Seed Error:", err);
        setError(err.message || "Failed to push data. Is Email/Password Auth enabled?");
    } finally {
        setSeedLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white overflow-hidden font-sans">
      {/* Left Branding Side */}
      <div className="hidden lg:flex flex-1 relative bg-blue-600 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90" />
        <div className="relative z-10 max-w-lg p-12 space-y-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-3xl">N</div>
            <div>
                <h1 className="text-5xl font-black tracking-tighter leading-tight mb-4 text-white">NexusOffice Cloud Engine.</h1>
                <div className="bg-emerald-500/20 border border-emerald-500/50 p-6 rounded-3xl space-y-3">
                    <div className="flex items-center gap-3 text-emerald-400">
                        <CheckCircle2 size={24} />
                        <p className="font-black uppercase tracking-widest text-xs">Rules Updated</p>
                    </div>
                    <p className="text-emerald-100 text-sm leading-relaxed">
                        Aapne rules <span className="text-white font-mono">if request.auth != null</span> kar diye hain. Ab system secure hai aur data save ho jayega.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          <div className="text-center">
            <h2 className="text-4xl font-black tracking-tight mb-2">{isRegister ? 'Register' : 'Login'}</h2>
            <p className="text-slate-400 font-medium">Connect to your Nexus instance</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-3xl text-rose-500 text-xs font-bold flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="shrink-0" /> 
                    <span>{error}</span>
                </div>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-3xl text-emerald-500 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={24} className="shrink-0" /> 
                <span className="leading-relaxed">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="group">
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Full Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-600 transition-all font-bold text-white placeholder-slate-600" placeholder="e.g. Rahul Sharma" />
                </div>
              </div>
            )}

            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Company Identifier</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input required value={formData.companyId} onChange={(e) => setFormData({...formData, companyId: e.target.value.toUpperCase()})} className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-600 transition-all font-bold uppercase text-white placeholder-slate-600" placeholder="e.g. MY-OFFICE" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-600 transition-all font-bold text-white placeholder-slate-600" placeholder="email@example.com" />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-600 transition-all font-bold text-white placeholder-slate-600" placeholder="••••••••" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 group">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <span>{isRegister ? 'Deploy Workspace' : 'Secure Login'}</span>}
            </button>
          </form>

          <div className="flex flex-col items-center gap-4 pt-6 border-t border-slate-800">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); setSuccessMsg(''); }} className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">
              {isRegister ? 'Already have credentials? Login' : 'Need a new Company ID? Register'}
            </button>
            
            <div className="w-full h-px bg-slate-800 my-2" />
            
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Internal Tools</p>
            
            <button 
                type="button" 
                disabled={seedLoading} 
                onClick={handleSeed} 
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-700 active:scale-95 group"
            >
                {seedLoading ? <Loader2 className="animate-spin text-amber-500" size={20} /> : <Zap size={16} className="text-amber-500 group-hover:scale-125 transition-transform" />}
                {seedLoading ? 'Pushing Data...' : 'Push Demo Data to Firebase'}
            </button>

            <button onClick={() => setShowHelper(!showHelper)} className="text-[10px] font-black uppercase text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-2 mt-2">
                <HelpCircle size={14} /> View Login Credentials
            </button>
            
            {showHelper && (
                <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 text-xs text-slate-400 space-y-4 w-full shadow-2xl animate-in zoom-in-95">
                    <p className="font-bold">Credentials for <span className="text-white">{formData.companyId || 'DEMO'}</span>:</p>
                    <div className="space-y-3">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <p className="text-blue-400 font-bold text-[10px] uppercase mb-1">Admin Account</p>
                            <p className="mb-1">Email: <span className="text-white font-mono">admin@{(formData.companyId || 'demo').toLowerCase()}.com</span></p>
                            <p>Pass: <span className="text-white font-mono">password123</span></p>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                            <p className="text-blue-400 font-bold text-[10px] uppercase mb-1">Employee Account</p>
                            <p className="mb-1">Email: <span className="text-white font-mono">john@{(formData.companyId || 'demo').toLowerCase()}.com</span></p>
                            <p>Pass: <span className="text-white font-mono">password123</span></p>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
