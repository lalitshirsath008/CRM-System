
# NexusOffice Architecture

## 1. System Overview
NexusOffice is a multi-tenant capable CRM and HRMS designed for modern corporate environments. It uses a tiered architecture for security and scalability.

## 2. Database Schema (PostgreSQL)

### Tables:
1. **users**
   - id (UUID, PK)
   - employee_id (VARCHAR, UNIQUE)
   - email (VARCHAR, UNIQUE)
   - password_hash (TEXT)
   - role (ENUM: super-admin, manager, employee)
   - department (VARCHAR)
   - status (ENUM: active, inactive)
   - joining_date (TIMESTAMP)

2. **attendance**
   - id (UUID, PK)
   - user_id (UUID, FK)
   - check_in (TIMESTAMP)
   - check_out (TIMESTAMP)
   - is_late (BOOLEAN)
   - work_date (DATE)

3. **leave_requests**
   - id (UUID, PK)
   - user_id (UUID, FK)
   - type (VARCHAR)
   - start_date (DATE)
   - end_date (DATE)
   - reason (TEXT)
   - status (ENUM: pending, approved, rejected)
   - manager_comment (TEXT)

4. **messages**
   - id (UUID, PK)
   - sender_id (UUID, FK)
   - recipient_id (UUID, FK, nullable)
   - group_id (UUID, FK, nullable)
   - content (TEXT)
   - created_at (TIMESTAMP)

## 3. API Endpoints (Express.js)

- `POST /api/auth/login` - Authenticate user
- `POST /api/employees` - Create new employee (Admin only)
- `GET /api/employees` - List all employees
- `POST /api/attendance/check-in` - Record start of day
- `POST /api/attendance/check-out` - Record end of day
- `GET /api/leaves` - List leave requests
- `POST /api/leaves` - Apply for leave
- `PATCH /api/leaves/:id` - Approve/Reject leave
- `GET /api/chat/:userId` - Get private messages
- `POST /api/chat/send` - Send message via WebSocket
