
import { 
  collection, doc, setDoc, getDocs, updateDoc, query, orderBy, 
  limit, onSnapshot, where, addDoc, serverTimestamp, getDoc,
  Timestamp, runTransaction
} from "firebase/firestore";
import { ref, set, onDisconnect } from "firebase/database";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  deleteUser
} from "firebase/auth";
import { db, rtdb, auth } from "./firebase.ts";
import { User, UserRole, LeaveRequest, Task, Announcement, AuditLog, AttendanceRecord } from '../types.ts';

const handleFirestoreError = (err: any, source: string) => {
    if (err.code === 'failed-precondition') {
        console.error(`[INDEX MISSING] ${source}: Click the link in the browser console error to create the required Firestore index.`);
        // Note: Not alerting every time to avoid UX friction, just logging
    } else {
        console.error(`[FIRESTORE ERROR] ${source}:`, err);
    }
};

const logAction = async (user: User, action: string, details: string) => {
    try {
        await addDoc(collection(db, "audit_logs"), {
            companyId: user.companyId,
            userId: user.id,
            userName: user.name,
            action,
            details,
            timestamp: new Date().toISOString(),
            ip: 'client-node'
        });
    } catch (e) {
        console.error("Audit Logging Failed:", e);
    }
};

export const api = {
  auth: {
    register: async (userData: any) => {
        const { email, password, name, companyId, department, forcedRole } = userData;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        let role = forcedRole;
        if (!role) {
            const companyQuery = query(collection(db, "users"), where("companyId", "==", companyId.toUpperCase()), limit(1));
            const companySnap = await getDocs(companyQuery);
            role = companySnap.empty ? UserRole.SUPER_ADMIN : UserRole.EMPLOYEE;
        }

        const newUser: User = {
            id: uid,
            employeeId: `NEX-${Math.floor(1000 + Math.random() * 9000)}`,
            name,
            email,
            role,
            department: department || 'General',
            companyId: companyId.toUpperCase(),
            mobile: '',
            joiningDate: new Date().toISOString().split('T')[0],
            status: 'active',
            presence: 'online',
            lastSeen: new Date().toISOString(),
            leaveBalance: { sick: 10, casual: 12, paid: 20 }
        };

        await setDoc(doc(db, "users", uid), newUser);
        await logAction(newUser, 'REGISTRATION', `User ${name} registered`);
        return newUser;
    },
    
    seedDemoUsers: async (companyId: string) => {
        const demoUsers = [
            { name: "Global Admin", email: `admin@${companyId.toLowerCase()}.com`, password: "password123", companyId, department: "Management", forcedRole: UserRole.SUPER_ADMIN },
            { name: "John Employee", email: `john@${companyId.toLowerCase()}.com`, password: "password123", companyId, department: "Engineering", forcedRole: UserRole.EMPLOYEE }
        ];

        for (const u of demoUsers) {
            try {
                const createdUser = await api.auth.register(u);
                
                // Seed some data for this company
                if (u.forcedRole === UserRole.SUPER_ADMIN) {
                    await addDoc(collection(db, "announcements"), {
                        companyId: companyId.toUpperCase(),
                        title: "Welcome to NexusOffice",
                        content: `Welcome to the new corporate workspace for ${companyId}. Start managing your tasks and attendance here.`,
                        authorName: u.name,
                        priority: 'info',
                        createdAt: new Date().toISOString()
                    });
                }
                
                await signOut(auth);
            } catch (e: any) {
                if (e.code !== 'auth/email-already-in-use') throw e; 
            }
        }
    },

    login: async (email: string, password: string) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", cred.user.uid));
        if (!userDoc.exists()) throw new Error("Profile Not Found.");
        return userDoc.data() as User;
    },
    logout: () => signOut(auth),
    onAuthState: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const userDoc = await getDoc(doc(db, "users", fbUser.uid));
                callback(userDoc.exists() ? userDoc.data() as User : null);
            } else {
                callback(null);
            }
        });
    }
  },
  users: {
    getAll: (companyId: string, callback: (users: User[]) => void) => {
        const q = query(collection(db, "users"), where("companyId", "==", companyId));
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
        }, (err) => handleFirestoreError(err, 'Users List'));
    },
    updatePresence: (userId: string, presence: 'online' | 'idle' | 'offline') => {
        const userStatusRef = ref(rtdb, `/status/${userId}`);
        onDisconnect(userStatusRef).set({ state: 'offline', last_changed: serverTimestamp() }).then(() => {
            set(userStatusRef, { state: presence, last_changed: serverTimestamp() });
        });
        updateDoc(doc(db, "users", userId), { presence, lastSeen: new Date().toISOString() }).catch(() => {});
    }
  },
  tasks: {
    subscribe: (companyId: string, callback: (tasks: Task[]) => void) => {
        const q = query(collection(db, "tasks"), where("companyId", "==", companyId), orderBy("createdAt", "desc"));
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
        }, (err) => handleFirestoreError(err, 'Task Board'));
    },
    create: async (taskData: any, creator: User) => {
        await addDoc(collection(db, "tasks"), {
            companyId: creator.companyId,
            title: taskData.title,
            description: taskData.description,
            assignedTo: taskData.assignedTo,
            assignedToName: taskData.assignedToName || 'Unknown',
            assignedByName: creator.name,
            status: 'todo',
            priority: taskData.priority,
            createdAt: new Date().toISOString(),
            timeSpent: 0
        });
        await logAction(creator, 'TASK_CREATED', `New Task: ${taskData.title}`);
    },
    updateStatus: async (taskId: string, status: Task['status'], user: User) => {
        await updateDoc(doc(db, "tasks", taskId), { status });
    },
    // Fix: Added toggleTimer method to handle task time tracking and fix the error in Tasks.tsx
    toggleTimer: async (taskId: string, start: boolean) => {
        const taskRef = doc(db, "tasks", taskId);
        if (start) {
            await updateDoc(taskRef, {
                timerStartedAt: new Date().toISOString(),
                status: 'in-progress'
            });
        } else {
            const taskSnap = await getDoc(taskRef);
            if (!taskSnap.exists()) return;
            const taskData = taskSnap.data() as Task;
            if (taskData.timerStartedAt) {
                const now = new Date().getTime();
                const started = new Date(taskData.timerStartedAt).getTime();
                const diff = Math.floor((now - started) / 1000);
                const newTimeSpent = (taskData.timeSpent || 0) + diff;
                
                await updateDoc(taskRef, {
                    timeSpent: newTimeSpent,
                    timerStartedAt: null
                });
            }
        }
    }
  },
  attendance: {
    getToday: async (userId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const q = query(collection(db, "attendance"), where("userId", "==", userId), where("date", "==", today), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as AttendanceRecord;
    },
    checkIn: async (user: User) => {
        const today = new Date().toISOString().split('T')[0];
        const checkInTime = new Date().toISOString();
        const docRef = await addDoc(collection(db, "attendance"), {
            companyId: user.companyId,
            userId: user.id,
            date: today,
            checkIn: checkInTime,
            isLate: new Date().getHours() >= 9,
            status: 'active'
        });
        return { id: docRef.id, checkIn: checkInTime };
    },
    checkOut: async (recordId: string) => {
        const checkOutTime = new Date().toISOString();
        await updateDoc(doc(db, "attendance", recordId), {
            checkOut: checkOutTime,
            status: 'completed'
        });
    }
  },
  leaves: {
    subscribe: (companyId: string, callback: (leaves: LeaveRequest[]) => void, userId?: string) => {
        let q = query(collection(db, "leaves"), where("companyId", "==", companyId), orderBy("createdAt", "desc"));
        if (userId) q = query(collection(db, "leaves"), where("companyId", "==", companyId), where("userId", "==", userId), orderBy("createdAt", "desc"));
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaveRequest)));
        }, (err) => handleFirestoreError(err, 'Leave Requests'));
    },
    create: async (leaveData: any, user: User) => {
        await addDoc(collection(db, "leaves"), {
            ...leaveData,
            companyId: user.companyId,
            userId: user.id,
            userName: user.name,
            status: 'pending',
            createdAt: new Date().toISOString()
        });
    },
    updateStatus: async (id: string, status: string, admin: User) => {
        await updateDoc(doc(db, "leaves", id), { status });
    }
  },
  audit: {
    subscribe: (companyId: string, callback: (logs: AuditLog[]) => void) => {
        const q = query(collection(db, "audit_logs"), where("companyId", "==", companyId), orderBy("timestamp", "desc"), limit(20));
        return onSnapshot(q, (snapshot) => {
            callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog)));
        }, (err) => handleFirestoreError(err, 'Security Logs'));
    }
  },
  announcements: {
    subscribe: (companyId: string, callback: (ans: Announcement[]) => void) => {
        const q = query(collection(db, "announcements"), where("companyId", "==", companyId), orderBy("createdAt", "desc"));
        return onSnapshot(q, snapshot => callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Announcement))), (err) => handleFirestoreError(err, 'Announcements'));
    }
  },
  chat: {
    subscribeMessages: (companyId: string, callback: (msgs: any[]) => void) => {
        const q = query(collection(db, "messages"), where("companyId", "==", companyId), orderBy("timestamp", "asc"), limit(100));
        return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))), (err) => handleFirestoreError(err, 'Chat Engine'));
    },
    sendMessage: async (companyId: string, sender: User, content: string) => {
        await addDoc(collection(db, "messages"), {
            companyId,
            senderId: sender.id,
            senderName: sender.name,
            content,
            timestamp: new Date().toISOString()
        });
    }
  }
};
