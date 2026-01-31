
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export interface User {
  id: string; // This will be the Firebase UID
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  companyId: string; // Added for multi-tenancy
  mobile: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  presence: 'online' | 'idle' | 'offline';
  lastSeen: string;
  leaveBalance: {
    sick: number;
    casual: number;
    paid: number;
  };
  avatar?: string;
}

export interface Task {
  id: string;
  companyId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  assignedByName: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  timeSpent: number;
  timerStartedAt?: string;
}

export interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface Announcement {
  id: string;
  companyId: string;
  title: string;
  content: string;
  authorName: string;
  priority: 'info' | 'urgent';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  companyId: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  duration: number;
  isLate: boolean;
}

export interface LeaveRequest {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  type: 'casual' | 'sick' | 'paid' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  managerComment?: string;
  createdAt: string;
}
