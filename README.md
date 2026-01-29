

**Architecture Pattern**
3-Tier Architecture: Frontend → Backend API → Database
RESTful API communication between frontend and backend
JWT-based Authentication with role-based access control (RBAC)
Tech Stack Breakdown

**Frontend**
Framework: Next.js 16.1.3 (React 19.2.3)
Language: TypeScript 5
Styling: Tailwind CSS 4
Fonts: Geist Sans & Geist Mono (via next/font)
State Management: Local Storage (for JWT tokens)
HTTP Client: Native Fetch API
Port: 3000 (default Next.js dev server)

**Backend**
Framework: Spring Boot 4.0.1
Language: Java 17
Build Tool: Maven
Security: Spring Security with JWT authentication
ORM: Spring Data JPA / Hibernate
Database Dialect: Hibernate Community Dialects (SQLite)
JWT Library: JJWT 0.12.5 (io.jsonwebtoken)
Port: 8080

**Database**
Database: SQLite
Database File: event_booking.db
ORM: JPA/Hibernate with auto-update DDL (spring.jpa.hibernate.ddl-auto=update)


**Authentication Flow**
User logs in via POST /auth/login
Backend validates credentials and returns JWT token
Frontend stores token in localStorage
All subsequent requests include Authorization: Bearer <token> header
JWT Filter validates token on each request

**User Roles**
USER: Can create events, view own events
ADMIN: Can view all events, approve/reject pending events

**Event Lifecycle**
PENDING → APPROVED       ↘ REJECTED

**API Endpoints**
**Authentication**
POST /auth/login - Login (public)
POST /auth/signup - Signup (public)

**User Endpoints (requires USER/ADMIN role)**
POST /events - Create event
GET /events/mine - Get user's own events

**Admin Endpoints (requires ADMIN role)**
GET /admin/events?status=PENDING - Get all events (filterable)
POST /admin/events/{eventId}/approve - Approve event
POST /admin/events/{eventId}/reject - Reject event


**Database Schema**

**T_USER Table**
user_id (PK, String)
password_hash (String)
user_type (ENUM: USER/ADMIN)
created_at (LocalDateTime)


**T_EVENT Table**
event_id (PK, Long, Auto-generated)
event_name (String)
created_by (FK → T_USER.user_id)
approved_by (FK → T_USER.user_id, nullable)
status (ENUM: PENDING/APPROVED/REJECTED)
evet_date (LocalDate) - Note: typo in column name
created_date (LocalDateTime)
decision_date (LocalDateTime, nullable)
rejection_reason (String, nullable)

**Security Features**
JWT Authentication: Stateless token-based auth
Role-Based Access Control: USER vs ADMIN permissions
Password Hashing: Passwords stored as hashes (not plain text)
CORS Configuration: Configured for cross-origin requests
CSRF Protection: Disabled (typical for JWT stateless APIs)


**Development Setup**
Frontend: npm run dev → http://localhost:3000
Backend: Spring Boot Maven app → http://localhost:8080
Database: SQLite file created automatically on first run
This is a full-stack event booking application with a modern React frontend and a Spring Boot REST API backend, using JWT for authentication and SQLite for data persistence.	

####################################################################################################

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
