# Professional JWT Authentication & Role-Based Security System

> **Full-Stack Java Spring Boot 3 + React.js + MySQL Authentication Architecture**  
> *Engineered for high-level technical interviews at LVC Solutions.*

---

## 🌟 Project Overview

This project is a modern, production-grade **Authentication and Role-Based Authorization System** built using **Java 21, Spring Boot 3.3, Spring Security 6, Spring Data JPA, MySQL, and React.js**.

It enforces stateless identity verification using **JSON Web Tokens (JWT)** signed with **HMAC SHA-256** and secures user credentials with **BCrypt password hashing**. The frontend is built as a single-page application (SPA) with **React, Vite, React Router, and Axios**, featuring interactive JWT token inspection and role-gated page rendering.

---

## 🚀 Key Features

- 🔐 **Stateless JWT Authentication:** No server-side HTTP session storage; tokens contain signed identity claims.
- 🛡️ **BCrypt Password Hashing:** One-way password hashing using Spring Security's `BCryptPasswordEncoder` (strength 10).
- 🔑 **Role-Based Authorization (RBAC):** Strict route protection distinguishing standard `USER` accounts from `ADMIN` portals.
- 📐 **Clean Layered Architecture:** Strict separation of concerns (`controller`, `service`, `repository`, `entity`, `dto`, `security`, `exception`).
- ⚡ **Global Exception Handling:** `@RestControllerAdvice` returning standardized JSON responses with accurate HTTP status codes (200, 201, 400, 401, 403, 404, 409).
- 🎨 **Modern React UI:** Built with Vite, CSS Glassmorphism design system, interactive JWT inspector tool, and quick demo-fill buttons for instant interview testing.
- 🔌 **Automated Interceptor:** Axios request interceptor auto-attaches `Bearer <token>` and handles 401 token expiration.
- 📊 **MySQL Persistence:** Fully structured relational schema with JPA indexing and constraints.

---

## 🏗️ System Architecture

### High-Level Component Flow

```text
┌─────────────────────────┐               ┌─────────────────────────────────┐
│     React Frontend      │  HTTP Requests│       Spring Boot Backend       │
│   (Vite + React Router) │──────────────>│    (Spring MVC Controllers)     │
│                         │<──────────────│                                 │
└─────────────────────────┘  JSON Payload └─────────────────────────────────┘
             │                                             │
             │ Authorization: Bearer <JWT>                 │ JPA / Hibernate ORM
             ▼                                             ▼
┌─────────────────────────┐               ┌─────────────────────────────────┐
│   Axios Interceptor     │               │          MySQL Database         │
│ (LocalStorage Token)    │               │            (jwtdb.users)        │
└─────────────────────────┘               └─────────────────────────────────┘
```

### Authentication & Security Flow

```text
[ React Login Form ]
         │
         │ 1. POST /api/auth/login { email, password }
         ▼
[ AuthController ]
         │
         │ 2. Delegate execution
         ▼
[ AuthService ]
         │
         │ 3. Authenticate credentials
         ▼
[ Spring Security AuthenticationManager ]
         │
         │ 4. Load UserDetails from MySQL via CustomUserDetailsService
         │ 5. Verify password hash via BCryptPasswordEncoder
         ▼
[ JwtService ]
         │
         │ 6. Generate signed JWT token (HMAC SHA-256)
         ▼
[ AuthResponse returned to React ]
         │
         │ 7. Save JWT in localStorage
         ▼
[ Protected REST API Request ]
         │
         │ 8. Send header: Authorization: Bearer <token>
         ▼
[ JwtAuthenticationFilter ]
         │
         │ 9. Parse JWT, verify HMAC signature, check expiration date
         │ 10. Extract username and role claims
         │ 11. Populate SecurityContextHolder with UsernamePasswordAuthenticationToken
         ▼
[ Target Controller / Admin Endpoint ]
```

---

## 📊 Database Schema

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🔌 API Documentation

### Public Endpoints

| Method | Endpoint | Description | Request Body | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | `RegisterRequest` | `201 CREATED` |
| `POST` | `/api/auth/login` | Log in and receive JWT token | `LoginRequest` | `200 OK` |

### User Endpoints (`USER` & `ADMIN` Roles)

| Method | Endpoint | Header Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | `Authorization: Bearer <token>` | Returns current user profile details |
| `GET` | `/api/user/dashboard` | `Authorization: Bearer <token>` | Returns protected user dashboard data |

### Admin-Only Endpoints (`ADMIN` Role)

| Method | Endpoint | Header Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | `Authorization: Bearer <admin_token>` | Lists all registered users in MySQL |
| `DELETE` | `/api/admin/users/{id}` | `Authorization: Bearer <admin_token>` | Deletes user record by ID |

---

## 🔒 Security Best Practices Implemented

1. **BCrypt Password Hashing:** Passwords are hashed before storage. Plain-text passwords are never logged, stored, or returned in API responses.
2. **Stateless Sessions:** Server session creation is disabled (`SessionCreationPolicy.STATELESS`), mitigating CSRF risks for REST APIs.
3. **Parametric Queries:** Spring Data JPA prevents SQL Injection by escaping input.
4. **JWT Verification:** HMAC SHA-256 signatures ensure tokens cannot be tampered with by clients.
5. **CORS Hardening:** Configured with explicit origin whitelists (`http://localhost:5173`) rather than wildcards (`*`).
6. **Config Externalization:** Credentials and secret keys use environment variables (`${JWT_SECRET}`).

---

## 🛠️ How to Run Locally

### Prerequisites

- Java 21 JDK
- Maven 3.8+
- Node.js 18+ & npm
- MySQL Server (running on port 3306)

### Step 1: Database Setup

Ensure MySQL is running and execute the setup script:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/data.sql
```

*(Alternatively, the backend automatically seeds default sample accounts if `jwtdb` is empty on startup!)*

### Step 2: Backend Setup

Navigate to the `backend/` directory:

```bash
cd backend
mvn clean spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.

### Step 3: Frontend Setup

Open a new terminal and navigate to the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

The React frontend will start on **`http://localhost:5173`**.

---

## 🧪 Default Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **USER** | `user@example.com` | `User@123` |
| **ADMIN** | `admin@example.com` | `Admin@123` |

*(You can also use the **Quick Demo Fill** buttons on the login page for one-click testing!)*

---

## 📚 Interview Documentation Links

- 📖 [Interview Q&A Guide (25 Core Questions)](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/INTERVIEW_GUIDE.md)
- 🔍 [Step-by-Step Code Walkthrough](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/CODE_WALKTHROUGH.md)
