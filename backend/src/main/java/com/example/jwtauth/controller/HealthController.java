package com.example.jwtauth.controller;

import com.example.jwtauth.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Health check controller used by Render, Docker, and monitoring services.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", "JWT Authentication Backend API");
        healthInfo.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(ApiResponse.success("Backend service is operational", healthInfo));
    }
}
