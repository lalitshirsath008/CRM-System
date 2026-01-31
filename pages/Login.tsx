
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight, Info } from 'lucide-react';

const LoginPage: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@nexus.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white overflow-hidden font-sans">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-1 relative bg-blue-600 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90" />
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-lg p-12 space-y-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-3xl">N</div>
            <div>
                <h1 className="text-5xl font-black tracking-tighter leading-tight mb-4">Elevate Your Corporate Operations.</h1>
                <p className="text-blue-100 text-lg leading-relaxed font-medium">NexusOffice provides an end-to-end solution for modern employee management, real-time tracking, and secure communication.</p>
            </div>
            
            <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex-1">
                    <p className="text-2xl font-bold">12k+</p>
                    <p className="text-xs text-blue-200 uppercase font-bold tracking-widest mt-1">Daily Logins</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl flex-1">
                    <p className="text-2xl font-bold">99.9%</p>
                    <p className="text-xs text-blue-200 uppercase font-bold tracking-widest mt-1">Uptime SLA</p>
                </div>
            </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">System Login</h2>
            <p className="text-slate-400 mt-2 font-medium">Please enter your credentials to access the nexus.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest group-focus-within:text-blue-500 transition-colors">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium" 
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-blue-500 transition-colors">Access Key</label>
                    <button type="button" className="text-xs font-bold text-blue-500 hover:underline">Forgot Key?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all font-medium" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group"
            >
              Confirm Access
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 flex items-start gap-4">
            <Info className="text-amber-500 flex-shrink-0 mt-1" size={18} />
            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Demo Credentials</p>
                <div className="text-[11px] text-slate-400 space-y-1">
                    <p><span className="text-slate-200 font-bold">Admin:</span> admin@nexus.com / password</p>
                    <p><span className="text-slate-200 font-bold">Manager:</span> manager@nexus.com / password</p>
                    <p><span className="text-slate-200 font-bold">Employee:</span> alice@nexus.com / password</p>
                </div>
            </div>
          </div>
          
          <p className="text-center text-slate-500 text-xs font-medium">
            © 2024 Nexus Solutions Group. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
