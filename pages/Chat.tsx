
import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile, Circle, Loader2 } from 'lucide-react';
import { User } from '../types.ts';
import { api } from '../services/api.ts';

const ChatPage: React.FC<{ user: User }> = ({ user }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubUsers = api.users.getAll(user.companyId, (data) => setUsers(data));
    const unsubMsgs = api.chat.subscribeMessages(user.companyId, (data) => {
        setMessages(data);
        setLoading(false);
    });

    return () => {
        unsubUsers();
        unsubMsgs();
    };
  }, [user.companyId]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    await api.chat.sendMessage(user.companyId, user, text);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar - Real Users */}
      <div className="w-80 border-r border-slate-100 flex flex-col hidden md:flex">
        <div className="p-6 pb-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Global Channel</h2>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
            <div className="px-6 mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Online Teammates</p>
                {users.map((u) => (
                    <div key={u.id} className="flex items-center space-x-3 py-3">
                        <div className="relative">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random`} className="w-10 h-10 rounded-xl" alt="" />
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${u.presence === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{u.department}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
                    #
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Company General</h3>
                    <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Real-time Node Active</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar" ref={scrollRef}>
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400">
                    <Loader2 className="animate-spin" />
                    <p className="text-xs font-bold uppercase tracking-widest">Loading Conversation...</p>
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-slate-400 text-sm italic">No messages yet. Start the conversation!</p>
                </div>
            ) : messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${msg.senderId === user.id ? 'order-2' : ''}`}>
                        {msg.senderId !== user.id && <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-4">{msg.senderName}</p>}
                        <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm ${
                            msg.senderId === user.id 
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/20' 
                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                        }`}>
                            {msg.content}
                        </div>
                        <p className={`text-[10px] text-slate-400 mt-1 ${msg.senderId === user.id ? 'text-right mr-2' : 'ml-2'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            ))}
        </div>

        <footer className="p-6 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center space-x-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-500 transition-colors">
                <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Paperclip size={20} /></button>
                <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    type="text" 
                    placeholder="Message company-wide..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                />
                <button type="submit" className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50">
                    <Send size={18} />
                </button>
            </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
