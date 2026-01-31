
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  MessageSquare, 
  Clock, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  FileText
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  userRole, 
  userName,
  onLogout 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { id: 'employees', label: 'Employees', icon: Users, roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER] },
    { id: 'attendance', label: 'Attendance', icon: Clock, roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { id: 'leaves', label: 'Leave Management', icon: CalendarCheck, roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { id: 'chat', label: 'Messages', icon: MessageSquare, roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: [UserRole.SUPER_ADMIN, UserRole.MANAGER] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Backdrop */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static inset-y-0 left-0 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out z-30 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">N</div>
            <span className="text-xl font-bold tracking-tight">NexusOffice</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 p-2">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white rounded-full flex items-center justify-center">3</span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{userName}</p>
                <p className="text-xs text-slate-500 capitalize">{userRole.replace('-', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
