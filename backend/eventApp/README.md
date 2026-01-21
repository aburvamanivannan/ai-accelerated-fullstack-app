1. Architecture 
	Frontend (Node.js + TypeScript)
        * Next.js (TS) for UI + API calls
	Backend REST
        * Java Spring Boot (JWT + role-based access)
	Database
		*  


2. Roles and core flows
    Roles
    * USER
        * Login
        * Create event (goes to “PENDING”)
        * View their own events (and status)
    * ADMIN
        * Login
        * View all events (filter by status)
        * Approve / Reject pending events

    Status lifecycle
        * PENDING → APPROVED OR REJECTED

3. Database design (recommended)
    Table Name: T_USER
        user_id (PK, text or int)
        password_hash (don’t store plain password)
        user_type (USER / ADMIN)
        created_at

    Table Name: T_EVENT
        event_id (PK)
        event_name
        created_by (FK → T_USER.user_id)
        approved_by (nullable FK → T_USER.user_id)
        status (PENDING/APPROVED/REJECTED)
        evet_date
        created_date
        decision_date (nullable)
        rejection_reason (nullable, optional but useful)

4) REST API contract
    Auth
        1. POST /auth/login
        body: { "userId": "u1", "password": "xxx" }
        response: { "accessToken": "jwt...", "userType":"USER" }
        Use JWT with claims: sub=userId, role=USER|ADMIN.

    User endpoints
        1.POST /events (USER)
        body: { "eventName":"...", "eventDate":"2026-02-01" }   
        serer sets: created_by, created_date, status=PENDING

        2. GET /events/mine (USER)
        returns list of events created by logged-in user

    Admin endpoints
        1.GET /admin/events (ADMIN)
        query optional: ?status=PENDING

        2.POST /admin/events/{eventId}/approve (ADMIN)

        3. POST /admin/events/{eventId}/reject (ADMIN)
        body optional: { "reason": "..." }  