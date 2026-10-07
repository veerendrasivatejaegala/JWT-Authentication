package com.example.jwtauth.service;

import com.example.jwtauth.dto.AuthResponse;
import com.example.jwtauth.dto.LoginRequest;
import com.example.jwtauth.dto.RegisterRequest;
import com.example.jwtauth.entity.Role;
import com.example.jwtauth.entity.User;
import com.example.jwtauth.exception.UserAlreadyExistsException;
import com.example.jwtauth.repository.UserRepository;
import com.example.jwtauth.security.CustomUserDetailsService;
import com.example.jwtauth.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class handling core authentication logic: Registration and Login.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       CustomUserDetailsService customUserDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
    }

    /**
     * Registers a new user in the database.
     * 1. Checks if email or username is already registered.
     * 2. Hashes the raw password using BCrypt.
     * 3. Persists user entity.
     * 4. Generates and returns a JWT token.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email '" + request.getEmail() + "' is already registered");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username '" + request.getUsername() + "' is already taken");
        }

        // Determine user role (defaults to USER if unspecified)
        Role role = Role.USER;
        if (request.getRole() != null && request.getRole().trim().equalsIgnoreCase("ADMIN")) {
            role = Role.ADMIN;
        }

        // Create new User entity with BCrypt hashed password
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()), // BCrypt Password Hashing
                role
        );

        User savedUser = userRepository.save(user);

        // Load Spring Security UserDetails to generate JWT token
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwtToken = jwtService.generateToken(userDetails, savedUser.getRole().name());

        return new AuthResponse(
                jwtToken,
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                "User registered successfully"
        );
    }

    /**
     * Authenticates an existing user and returns a JWT token.
     * 1. Verifies credentials via Spring Security AuthenticationManager & BCrypt.
     * 2. Generates JWT token upon successful authentication.
     */
    public AuthResponse login(LoginRequest request) {
        // Authenticate user using Spring Security (triggers BCrypt match internally)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Retrieve user entity from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> userRepository.findByUsername(request.getEmail())
                        .orElseThrow(() -> new IllegalArgumentException("Invalid user details")));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateToken(userDetails, user.getRole().name());

        return new AuthResponse(
                jwtToken,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                "Login successful"
        );
    }
}
