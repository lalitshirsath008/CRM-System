
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  mobile: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  duration: number; // minutes
  isLate: boolean;
}

export interface TaskTimer {
  id: string;
  userId: string;
  taskName: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: 'running' | 'paused' | 'completed';
}

export interface LeaveRequest {
  id: string;
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

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId?: string; // empty for group
  groupId?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}
