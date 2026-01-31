
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, MapPin, AlertCircle, Clock } from 'lucide-react';
import { AttendanceRecord, TaskTimer } from '../types';

const AttendancePage: React.FC<{ userId: string }> = ({ userId }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTaskRunning, setIsTaskRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isCheckedIn && !timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (!isCheckedIn && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCheckedIn]);

  const handleCheckIn = () => {
    const now = new Date();
    setIsCheckedIn(true);
    setCheckInTime(now.toLocaleTimeString());
    setElapsedTime(0);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Control Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock size={120} />
            </div>
            <p className="text-slate-400 font-medium mb-2">Current Session</p>
            <h2 className="text-5xl font-mono font-bold tracking-tighter mb-4">
              {formatTime(elapsedTime)}
            </h2>
            <div className="flex items-center justify-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-slate-300 font-medium">{isCheckedIn ? 'Active Session' : 'No Active Session'}</span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex flex-col space-y-4">
              {!isCheckedIn ? (
                <button 
                  onClick={handleCheckIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg shadow-blue-500/30"
                >
                  <Play size={24} />
                  <span>Office Check-In</span>
                </button>
              ) : (
                <button 
                  onClick={handleCheckOut}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg"
                >
                  <Square size={24} />
                  <span>Office Check-Out</span>
                </button>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Clocked In At</p>
                    <p className="text-lg font-bold text-slate-800">{checkInTime || '--:--'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Status</p>
                    <p className={`text-lg font-bold ${isCheckedIn ? 'text-emerald-600' : 'text-slate-400'}`}>{isCheckedIn ? 'In Office' : 'Offline'}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Info & Task Card */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertCircle size={18} className="text-blue-600" />
                    Office Guidelines
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-[10px] mt-0.5">1</div>
                        Check-in window is between 08:30 AM - 09:15 AM.
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-[10px] mt-0.5">2</div>
                        Late check-in requires a valid reason for manager approval.
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-[10px] mt-0.5">3</div>
                        Minimum 8.5 hours of work time is required daily.
                    </li>
                </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl shadow-blue-600/20">
                <h3 className="font-bold text-lg mb-4">Task Timer</h3>
                <input 
                    type="text" 
                    placeholder="What are you working on?" 
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/30 mb-4"
                />
                <div className="flex gap-3">
                    <button className="flex-1 bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-white/90 transition-colors">
                        Start Task
                    </button>
                    <button className="bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-colors">
                        <Pause size={20} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
