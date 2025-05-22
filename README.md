# Event-Management-System

### Project Overview 📖
Repository for the **Event Management System**, focusing exclusively on **testing and validation**, providing API specifications, Postman collections, and comprehensive Mocha/Selenium E2E tests to verify functionality, security, and UI workflows for a full-stack web application that enables creating, managing, and RSVPing to events with JWT-based authentication and role-based access control.

### Key Features 💡
- **Admin Functionality**
  - Create, update, and delete events
  - View RSVP lists for each event

- **User Functionality**
  - Browse upcoming events
  - RSVP to events

- **Authentication & Security**
  - JWT-based authentication for session security
  - Role-based access: Admin vs. User

### Tech Stack 🔧
- **Frontend:** React (clean, responsive UI)
- **Backend:** Node.js + Express.js (RESTful APIs)
- **Database:** MariaDB (relational data storage)

### Deliverables 📦 
- **Postman Collection (`.json` + environment):**
  - User registration & login
  - Admin-only endpoints for event management
  - User endpoints for viewing events & RSVPing

- **Automated Tests (`test/`):**  
  - **Mocha + Selenium E2E tests covering:**  
    - User login/navigation 
    - Admin event creation/deletion
    - RSVP workflows
    - Comprehensive registration form validation (missing/invalid input scenarios)

- **SQL Script Documentation:**
  - SQL queries used for test setup (e.g., creating admin/user accounts)
  - Rationale for each manual query
