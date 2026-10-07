package com.example.jwtauth.config;

import com.example.jwtauth.entity.Role;
import com.example.jwtauth.entity.User;
import com.example.jwtauth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initializes default database seed data (Default Admin and User) if the database is empty on application startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Initializing default sample users...");

            // Create Default Admin User
            User admin = new User(
                    "AdminUser",
                    "admin@example.com",
                    passwordEncoder.encode("Admin@123"),
                    Role.ADMIN
            );
            userRepository.save(admin);
            logger.info("Created Default Admin -> Email: admin@example.com | Password: Admin@123");

            // Create Default Standard User
            User standardUser = new User(
                    "StandardUser",
                    "user@example.com",
                    passwordEncoder.encode("User@123"),
                    Role.USER
            );
            userRepository.save(standardUser);
            logger.info("Created Default User -> Email: user@example.com | Password: User@123");
        }
    }
}
