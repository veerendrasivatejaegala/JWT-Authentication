# Step-by-Step Code Walkthrough for LVC Solutions Technical Interview

> Use this document to guide the interviewer step-by-step through the codebase. It presents files in the exact logical order an interviewer expects to see during a technical architecture review.

---

## Order of Presentation

```text
1. User Entity -> 2. UserRepository -> 3. Request DTOs -> 4. AuthController -> 
5. AuthService -> 6. CustomUserDetailsService -> 7. SecurityConfig -> 8. JwtService -> 
9. JwtAuthenticationFilter -> 10. User & Admin Controllers -> 11. GlobalExceptionHandler -> 12. React Frontend
```

---

### 1. User Entity — [User.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/entity/User.java)
- **Why it exists:** Maps the database table `users` to a Java object using JPA / Hibernate ORM.
- **What it does:** Defines fields (`id`, `username`, `email`, `password`, `role`, `createdAt`), table constraints (unique email/username), and automated timestamp generation via `@PrePersist`.
- **Key Annotations:**
  - `@Entity` & `@Table(name = "users")`: Specifies that this class is a JPA persistence model.
  - `@Enumerated(EnumType.STRING)`: Stores the enum role as a readable string (`USER`/`ADMIN`) rather than an integer ordinal in MySQL.
- **Connections:** Interacted with by `UserRepository` and instantiated inside `AuthService`.

---

### 2. UserRepository — [UserRepository.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/repository/UserRepository.java)
- **Why it exists:** Provides clean Data Access Object (DAO) operations for database queries.
- **What it does:** Extends `JpaRepository<User, Long>`, granting instant CRUD access and parameterized custom finder methods.
- **Important Methods:**
  - `Optional<User> findByEmail(String email)`: Used during authentication lookup.
  - `boolean existsByEmail(String email)`: Used during registration to prevent duplicate user creation.
- **Connections:** Used by `AuthService`, `UserService`, and `CustomUserDetailsService`.

---

### 3. Request DTOs — [RegisterRequest.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/dto/RegisterRequest.java) & [LoginRequest.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/dto/LoginRequest.java)
- **Why they exist:** Encapsulate incoming HTTP request payloads and enforce input validation rules.
- **What they do:** Use Jakarta Validation annotations (`@NotBlank`, `@Email`, `@Size(min = 6)`) to sanitize input before reaching business logic.
- **Connections:** Passed into `@Valid @RequestBody` in `AuthController`.

---

### 4. AuthController — [AuthController.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/controller/AuthController.java)
- **Why it exists:** Exposes public REST endpoints for user registration and authentication.
- **What it does:** Maps HTTP requests (`POST /api/auth/register` and `POST /api/auth/login`) and delegates execution to `AuthService`.
- **Important Methods:**
  - `register(@Valid @RequestBody RegisterRequest request)`: Returns HTTP 201 CREATED.
  - `login(@Valid @RequestBody LoginRequest request)`: Returns HTTP 200 OK with `AuthResponse`.
- **Connections:** Calls `AuthService` methods; public access allowed by `SecurityConfig`.

---

### 5. AuthService — [AuthService.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/service/AuthService.java)
- **Why it exists:** Houses core registration and authentication workflow logic.
- **What it does:**
  - `register()`: Checks duplicate email/username -> Hashes raw password using `PasswordEncoder` (BCrypt) -> Saves user entity -> Generates JWT token.
  - `login()`: Invokes `AuthenticationManager.authenticate()` to trigger BCrypt credential checking -> Fetches user details -> Generates JWT token.
- **Connections:** Injects `UserRepository`, `PasswordEncoder`, `JwtService`, and `AuthenticationManager`.

---

### 6. CustomUserDetailsService — [CustomUserDetailsService.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/security/CustomUserDetailsService.java)
- **Why it exists:** Bridges Spring Data JPA with Spring Security's authentication subsystem.
- **What it does:** Implements `loadUserByUsername(String identifier)` to load user credentials from MySQL and wrap them into Spring Security's `UserDetails` object with authorities (`ROLE_USER` / `ROLE_ADMIN`).
- **Connections:** Injected into `DaoAuthenticationProvider` inside `SecurityConfig` and used by `JwtAuthenticationFilter`.

---

### 7. SecurityConfig — [SecurityConfig.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/config/SecurityConfig.java)
- **Why it exists:** Central configuration bean for Spring Security filter chain and rules.
- **What it does:**
  1. Disables CSRF (since session is STATELESS).
  2. Sets session creation policy to `SessionCreationPolicy.STATELESS`.
  3. Configures route authorization rules (`/api/auth/**` permitAll, `/api/user/**` hasAnyRole, `/api/admin/**` hasRole).
  4. Registers `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`.
  5. Configures CORS policy bean allowing React origins.
  6. Exposes `BCryptPasswordEncoder` bean.
- **Connections:** Governs all HTTP traffic entering the application.

---

### 8. JwtService — [JwtService.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/security/JwtService.java)
- **Why it exists:** Encapsulates JSON Web Token generation, parsing, and cryptographic verification.
- **What it does:** Uses `io.jsonwebtoken` (JJWT) with HMAC SHA-256 (`HS256`) and a secret key configured via properties.
- **Important Methods:**
  - `generateToken(UserDetails, role)`: Builds JWT with subject, role claims, issue date, and 24-hour expiration.
  - `extractUsername(token)`: Parses token payload subject.
  - `isTokenValid(token, UserDetails)`: Validates username match and expiration date.
- **Connections:** Used by `AuthService` during login/registration and `JwtAuthenticationFilter` during request inspection.

---

### 9. JwtAuthenticationFilter — [JwtAuthenticationFilter.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/security/JwtAuthenticationFilter.java)
- **Why it exists:** Intercepts every incoming HTTP request once to inspect authentication credentials.
- **What it does:**
  1. Checks `Authorization` header for `Bearer <token>`.
  2. Extracts token and calls `JwtService.extractUsername()`.
  3. Loads `UserDetails` via `CustomUserDetailsService`.
  4. Validates token via `JwtService.isTokenValid()`.
  5. Instantiates `UsernamePasswordAuthenticationToken` and injects it into `SecurityContextHolder.getContext().setAuthentication()`.
- **Connections:** Positioned inside `SecurityConfig` filter chain.

---

### 10. UserController & AdminController — [UserController.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/controller/UserController.java) & [AdminController.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/controller/AdminController.java)
- **Why they exist:** Provide protected domain APIs for user profiles and administrative management.
- **What they do:**
  - `UserController`: Returns user profile and dashboard statistics.
  - `AdminController`: Exposes `GET /api/admin/users` (list users) and `DELETE /api/admin/users/{id}` (delete user).

---

### 11. GlobalExceptionHandler — [GlobalExceptionHandler.java](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/backend/src/main/java/com/example/jwtauth/exception/GlobalExceptionHandler.java)
- **Why it exists:** Intercepts exceptions thrown across controllers to return unified JSON error responses.
- **What it does:** Maps custom runtime exceptions (`UserAlreadyExistsException` -> 409 Conflict, `ResourceNotFoundException` -> 404 Not Found, `BadCredentialsException` -> 401 Unauthorized, `@Valid` validation errors -> 400 Bad Request) into `ApiResponse.error()`.

---

### 12. React Frontend — [Axios Client](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/frontend/src/api/axios.js) & [ProtectedRoute](file:///Users/veerusiphone/Desktop/Imp/JWT%20Authentication/frontend/src/components/ProtectedRoute.jsx)
- **Why they exist:** Handle frontend state management, route authorization, and HTTP API integration.
- **What they do:**
  - `axios.js`: Automatically attaches `Authorization: Bearer <token>` to request headers and handles 401 session expiration by clearing `localStorage`.
  - `ProtectedRoute.jsx`: Guards client-side routes, redirecting unauthenticated users to `/login` and non-admins away from `/admin`.
  - `JwtInspector.jsx`: Visualizes token header, payload claims, and signature in real-time.
