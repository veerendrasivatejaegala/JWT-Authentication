package com.example.jwtauth.controller;

import com.example.jwtauth.dto.ApiResponse;
import com.example.jwtauth.dto.UserResponse;
import com.example.jwtauth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller exposing protected user endpoints accessible by both USER and ADMIN roles.
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Retrieves profile details for the currently logged-in user.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getUserProfile(Authentication authentication) {
        String currentEmail = authentication.getName();
        UserResponse userResponse = userService.getUserByEmail(currentEmail);
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully", userResponse));
    }

    /**
     * Protected user dashboard overview endpoint.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserDashboard(Authentication authentication) {
        String currentEmail = authentication.getName();
        UserResponse userResponse = userService.getUserByEmail(currentEmail);

        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("welcomeMessage", "Welcome back, " + userResponse.getUsername() + "!");
        dashboardData.put("user", userResponse);
        dashboardData.put("grantedAuthorities", authentication.getAuthorities());
        dashboardData.put("serverTimestamp", System.currentTimeMillis());

        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics fetched successfully", dashboardData));
    }
}
