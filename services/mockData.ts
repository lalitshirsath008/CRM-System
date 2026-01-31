
import { User, UserRole, LeaveRequest, AttendanceRecord, Announcement } from '../types.ts';

export const mockUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP-001',
    name: 'Sarah Jenkins',
    email: 'admin@nexus.com',
    role: UserRole.SUPER_ADMIN,
    department: 'Human Resources',
    companyId: 'nexus-corp',
    mobile: '+1 555-0101',
    joiningDate: '2023-01-15',
    status: 'active',
    presence: 'online',
    lastSeen: '2024-05-18T09:00:00Z',
    // Added missing leaveBalance property
    leaveBalance: {
      sick: 10,
      casual: 12,
      paid: 20
    },
    avatar: 'https://picsum.photos/seed/sarah/200'
  },
  {
    id: '2',
    employeeId: 'EMP-002',
    name: 'Marcus Chen',
    email: 'manager@nexus.com',
    role: UserRole.MANAGER,
    department: 'Engineering',
    companyId: 'nexus-corp',
    mobile: '+1 555-0102',
    joiningDate: '2023-03-10',
    status: 'active',
    presence: 'offline',
    lastSeen: '2024-05-18T10:00:00Z',
    // Added missing leaveBalance property
    leaveBalance: {
      sick: 8,
      casual: 10,
      paid: 15
    },
    avatar: 'https://picsum.photos/seed/marcus/200'
  },
  {
    id: '3',
    employeeId: 'EMP-003',
    name: 'Alice Cooper',
    email: 'alice@nexus.com',
    role: UserRole.EMPLOYEE,
    department: 'Design',
    companyId: 'nexus-corp',
    mobile: '+1 555-0103',
    joiningDate: '2023-06-22',
    status: 'active',
    presence: 'idle',
    lastSeen: '2024-05-18T11:20:00Z',
    // Added missing leaveBalance property
    leaveBalance: {
      sick: 12,
      casual: 8,
      paid: 10
    },
    avatar: 'https://picsum.photos/seed/alice/200'
  }
];

export const mockLeaves: LeaveRequest[] = [
  {
    id: 'l1',
    companyId: 'nexus-corp',
    userId: '3',
    userName: 'Alice Cooper',
    type: 'sick',
    startDate: '2024-05-20',
    endDate: '2024-05-22',
    reason: 'Flu symptoms',
    status: 'pending',
    createdAt: '2024-05-18T10:00:00Z'
  },
  {
    id: 'l2',
    companyId: 'nexus-corp',
    userId: '2',
    userName: 'Marcus Chen',
    type: 'casual',
    startDate: '2024-05-25',
    endDate: '2024-05-26',
    reason: 'Family event',
    status: 'approved',
    createdAt: '2024-05-15T09:30:00Z'
  }
];

export const mockAttendance: AttendanceRecord[] = [
    { id: 'a1', companyId: 'nexus-corp', userId: '1', date: '2024-05-18', checkIn: '08:45', checkOut: '17:30', duration: 525, isLate: false },
    { id: 'a2', companyId: 'nexus-corp', userId: '2', date: '2024-05-18', checkIn: '09:15', checkOut: '18:00', duration: 525, isLate: true },
    { id: 'a3', companyId: 'nexus-corp', userId: '3', date: '2024-05-18', checkIn: '08:55', checkOut: '17:45', duration: 530, isLate: false },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    companyId: 'nexus-corp',
    title: 'New Health Policy',
    content: 'We have updated our health insurance provider to ensure better coverage for all employees.',
    authorName: 'Sarah Jenkins',
    priority: 'info',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    companyId: 'nexus-corp',
    title: 'Urgent: Server Maintenance',
    content: 'The engineering servers will be down for maintenance this Sunday from 2 AM to 6 AM.',
    authorName: 'Marcus Chen',
    priority: 'urgent',
    createdAt: new Date().toISOString()
  }
];
