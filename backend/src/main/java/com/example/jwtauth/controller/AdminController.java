package com.example.jwtauth.controller;

import com.example.jwtauth.dto.ApiResponse;
import com.example.jwtauth.dto.UserResponse;
import com.example.jwtauth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller exposing administrative endpoints accessible ONLY by users with ADMIN role.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Admin Endpoint: Fetches all registered users.
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("All registered users retrieved successfully", users));
    }

    /**
     * Admin Endpoint: Deletes a user account by ID.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User with ID " + id + " has been successfully deleted"));
    }
}
