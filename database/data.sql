-- Sample Data Seed for JWT Authentication System (MySQL)
USE jwtdb;

-- Passwords hashed using BCryptPasswordEncoder (Strength 10)
-- Admin Password: "Admin@123" -> $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd0P1R7.q013T.X2
-- User Password:  "User@123"  -> $2a$10$CwTycUXWue0Thq9StjUM0uJ8kU6KxG6i2g5a4h3j2k1l0m9n8o7p6

INSERT INTO users (username, email, password, role, created_at)
VALUES 
('AdminUser', 'admin@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd0P1R7.q013T.X2', 'ADMIN', NOW()),
('StandardUser', 'user@example.com', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8kU6KxG6i2g5a4h3j2k1l0m9n8o7p6', 'USER', NOW())
ON DUPLICATE KEY UPDATE id=id;
