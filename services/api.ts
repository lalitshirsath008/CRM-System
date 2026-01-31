
import { User, UserRole, LeaveRequest, AttendanceRecord } from '../types';
import { mockUsers, mockLeaves, mockAttendance } from './mockData';

// Simulated latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  users: {
    getAll: async () => {
      await delay(500);
      return [...mockUsers];
    },
    create: async (userData: Partial<User>) => {
      await delay(800);
      const newUser = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        employeeId: `EMP-${Math.floor(Math.random() * 900) + 100}`,
        status: 'active'
      } as User;
      mockUsers.push(newUser);
      return newUser;
    }
  },
  leaves: {
    getAll: async () => {
      await delay(400);
      return [...mockLeaves];
    },
    getByUserId: async (userId: string) => {
      await delay(300);
      return mockLeaves.filter(l => l.userId === userId);
    },
    create: async (leave: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => {
      await delay(600);
      const newLeave: LeaveRequest = {
        ...leave,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      mockLeaves.push(newLeave);
      return newLeave;
    },
    updateStatus: async (id: string, status: 'approved' | 'rejected', comment?: string) => {
      await delay(500);
      const idx = mockLeaves.findIndex(l => l.id === id);
      if (idx !== -1) {
        mockLeaves[idx] = { ...mockLeaves[idx], status, managerComment: comment };
        return mockLeaves[idx];
      }
      throw new Error("Leave not found");
    }
  },
  attendance: {
    getStats: async () => {
        await delay(300);
        return [...mockAttendance];
    },
    checkIn: async (userId: string) => {
        await delay(400);
        const now = new Date();
        const isLate = now.getHours() >= 9 && now.getMinutes() > 0;
        const record: AttendanceRecord = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            date: now.toISOString().split('T')[0],
            checkIn: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: 0,
            isLate
        };
        mockAttendance.push(record);
        return record;
    }
  }
};
