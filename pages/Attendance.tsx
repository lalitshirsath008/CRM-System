
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { User } from '../types.ts';
import { api } from '../services/api.ts';

const AttendancePage: React.FC<{ user: User }> = ({ user }) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [activeRecord, setActiveRecord] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
        const record = await api.attendance.getToday(user.id);
        if (record && !record.checkOut) {
            setActiveRecord(record);
            setIsCheckedIn(true);
            const start = new Date(record.checkIn).getTime();
            setElapsedTime(Math.floor((new Date().getTime() - start) / 1000));
        }
        setLoading(false);
    };
    checkStatus();
  }, [user.id]);

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

  const handleCheckIn = async () => {
    setLoading(true);
    try {
        const res = await api.attendance.checkIn(user);
        setActiveRecord(res);
        setIsCheckedIn(true);
        setElapsedTime(0);
    } catch (e) {
        alert("Check-in failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!activeRecord?.id) return;
    setLoading(true);
    try {
        await api.attendance.checkOut(activeRecord.id);
        setIsCheckedIn(false);
        setActiveRecord(null);
    } catch (e) {
        alert("Check-out failed.");
    } finally {
        setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading && !isCheckedIn) {
      return (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Cloud Session...</p>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <span className="text-slate-300 font-medium">{isCheckedIn ? 'Active Session' : 'Offline'}</span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {!isCheckedIn ? (
                <button 
                  disabled={loading}
                  onClick={handleCheckIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg shadow-blue-500/30 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Play size={24} />}
                  <span>Check-In to Office</span>
                </button>
              ) : (
                <button 
                  disabled={loading}
                  onClick={handleCheckOut}
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-lg disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Square size={24} />}
                  <span>Finish Today's Work</span>
                </button>
              )}

            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Start Time</p>
                    <p className="text-lg font-bold text-slate-800">
                        {activeRecord ? new Date(activeRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Status</p>
                    <p className={`text-lg font-bold ${isCheckedIn ? 'text-emerald-600' : 'text-slate-400'}`}>{isCheckedIn ? 'Working' : 'Not Clocked In'}</p>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 tracking-tight">
                    <AlertCircle size={18} className="text-blue-600" />
                    Today's Context
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium">Daily Target</span>
                        <span className="font-bold">8.5 Hours</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-blue-600 h-full transition-all duration-1000" 
                            style={{ width: `${Math.min((elapsedTime / (8.5 * 3600)) * 100, 100)}%` }} 
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl">
                <h3 className="font-bold text-xl mb-2">Cloud Persistence</h3>
                <p className="text-blue-100/70 text-sm mb-6 leading-relaxed">Your attendance data is synced across all devices. Refreshing or closing this tab will not stop your timer.</p>
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    Secured Sync Active
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
