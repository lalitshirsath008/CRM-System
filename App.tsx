
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types.ts';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import EmployeeManagement from './pages/EmployeeManagement.tsx';
import AttendancePage from './pages/Attendance.tsx';
import LeaveManagement from './pages/LeaveManagement.tsx';
import ChatPage from './pages/Chat.tsx';
import TasksPage from './pages/Tasks.tsx';
import LoginPage from './pages/Login.tsx';
import { api } from './services/api.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = api.auth.onAuthState((userData) => {
        setUser(userData);
        setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const heartbeat = () => api.users.updatePresence(user.id, 'online');
    heartbeat();
    const interval = setInterval(heartbeat, 30000); 
    
    const handleVisibility = () => {
        api.users.updatePresence(user.id, document.hidden ? 'idle' : 'online');
    };
    
    window.addEventListener('visibilitychange', handleVisibility);
    return () => {
        clearInterval(interval);
        window.removeEventListener('visibilitychange', handleVisibility);
        if (user) api.users.updatePresence(user.id, 'offline');
    };
  }, [user]);

  const handleLogout = async () => {
    if (user) await api.users.updatePresence(user.id, 'offline');
    await api.auth.logout();
    setUser(null);
  };

  if (isAuthLoading) {
      return (
          <div className="h-screen flex items-center justify-center bg-slate-950">
              <div className="w-16 h-16 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  if (!user) return <LoginPage />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'tasks': return <TasksPage user={user} />;
      case 'employees': return <EmployeeManagement companyId={user.companyId} />;
      case 'attendance': return <AttendancePage user={user} />;
      case 'leaves': return <LeaveManagement role={user.role} userId={user.id} user={user} />;
      case 'chat': return <ChatPage user={user} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userRole={user.role} 
      userName={user.name}
      onLogout={handleLogout}
    >
      <div className="max-w-[1440px] mx-auto">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
