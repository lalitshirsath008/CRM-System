
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types.ts';
import { mockUsers } from './services/mockData.ts';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import EmployeeManagement from './pages/EmployeeManagement.tsx';
import AttendancePage from './pages/Attendance.tsx';
import LeaveManagement from './pages/LeaveManagement.tsx';
import ChatPage from './pages/Chat.tsx';
import LoginPage from './pages/Login.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false);
  }, []);

  const handleLogin = (email: string) => {
    const foundUser = mockUsers.find(u => u.email === email) || mockUsers[0];
    setUser(foundUser);
    localStorage.setItem('nexus_user', JSON.stringify(foundUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  if (isAuthLoading) {
      return (
          <div className="h-screen flex items-center justify-center bg-slate-900">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
      );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} stats={{}} />;
      case 'employees':
        return <EmployeeManagement />;
      case 'attendance':
        return <AttendancePage userId={user.id} />;
      case 'leaves':
        return <LeaveManagement role={user.role} userId={user.id} />;
      case 'chat':
        return <ChatPage />;
      case 'reports':
        return (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <h3 className="text-xl font-bold text-slate-800">Advanced Analytics Hub</h3>
             <p className="text-slate-500 max-w-sm mx-auto">Detailed productivity and financial reports are available for Super Admins. Generating current month summary...</p>
             <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                Export Monthly Report (CSV)
             </button>
          </div>
        );
      default:
        return <Dashboard user={user} stats={{}} />;
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
      {renderContent()}
    </Layout>
  );
};

export default App;
