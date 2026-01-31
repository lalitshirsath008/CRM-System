
import React, { useState } from 'react';
import { Send, Search, MoreVertical, Paperclip, Smile, Circle } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState(0);
  const [message, setMessage] = useState('');

  const chats = [
    { id: 0, name: 'Design Team', type: 'group', lastMsg: 'Alice: Looking good!', time: '10:45 AM', unread: 3, avatar: 'D' },
    { id: 1, name: 'Marcus Chen', type: 'individual', lastMsg: 'Did you check the PR?', time: 'Yesterday', unread: 0, status: 'online' },
    { id: 2, name: 'Sarah Jenkins', type: 'individual', lastMsg: 'Meeting at 2pm confirmed', time: 'Yesterday', unread: 0, status: 'offline' },
    { id: 3, name: 'Eng Board', type: 'group', lastMsg: 'John: Deployment successful', time: 'Mon', unread: 0, avatar: 'E' },
  ];

  const messages = [
    { id: 1, sender: 'Alice Cooper', content: 'Hey team, I updated the dashboard designs for NexusOffice.', time: '10:30 AM', self: false },
    { id: 2, sender: 'You', content: 'Awesome, can you share the Figma link?', time: '10:32 AM', self: true },
    { id: 3, sender: 'Alice Cooper', content: 'Sure thing! Just sent it to the main channel.', time: '10:35 AM', self: false },
    { id: 4, sender: 'Alice Cooper', content: 'Looking good!', time: '10:45 AM', self: false },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col">
        <div className="p-6 pb-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="w-full bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
            {chats.map((chat) => (
                <button 
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`w-full flex items-center space-x-3 px-6 py-4 transition-all ${activeChat === chat.id ? 'bg-blue-50/50 border-r-4 border-blue-600' : 'hover:bg-slate-50'}`}
                >
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${chat.type === 'group' ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                            {chat.type === 'group' ? chat.avatar : (
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}&background=random`} className="rounded-2xl" alt="" />
                            )}
                        </div>
                        {chat.status === 'online' && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-slate-800 text-sm truncate">{chat.name}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                        </div>
                        <p className={`text-xs truncate ${chat.unread > 0 ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}>
                            {chat.lastMsg}
                        </p>
                    </div>
                    {chat.unread > 0 && (
                        <div className="w-5 h-5 bg-blue-600 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                            {chat.unread}
                        </div>
                    )}
                </button>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-8 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-white">
                    {chats[activeChat].avatar || 'M'}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">{chats[activeChat].name}</h3>
                    <p className="text-xs text-slate-400 font-medium">12 Members, 4 Online</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Search size={20} /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.self ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${msg.self ? 'order-2' : ''}`}>
                        {!msg.self && <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 ml-4">{msg.sender}</p>}
                        <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm ${
                            msg.self 
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/20' 
                            : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                        }`}>
                            {msg.content}
                        </div>
                        <p className={`text-[10px] text-slate-400 mt-1 ${msg.self ? 'text-right mr-2' : 'ml-2'}`}>{msg.time}</p>
                    </div>
                </div>
            ))}
        </div>

        <footer className="p-6 bg-white border-t border-slate-100">
            <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Paperclip size={20} /></button>
                <input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text" 
                    placeholder="Type your message..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                />
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Smile size={20} /></button>
                <button className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                    <Send size={18} />
                </button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
