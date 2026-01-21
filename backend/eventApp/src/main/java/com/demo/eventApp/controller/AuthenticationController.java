package com.demo.eventApp.controller;

import com.demo.eventApp.entity.User;
import com.demo.eventApp.service.AuthenticationService;
import com.demo.eventApp.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(Constants.API_BASE)
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, String>> authenticateUser(@RequestBody Map<String, String> credentials) {
        // #region agent log
        try {
            java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
            java.nio.file.Path parentDir = logPath.getParent();
            if (parentDir != null && !Files.exists(parentDir)) {
                Files.createDirectories(parentDir);
            }
            String logEntry = String.format("{\"location\":\"AuthenticationController.java:23\",\"message\":\"Request received at controller\",\"data\":{\"hasCredentials\":%s},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\",\"hypothesisId\":\"C\"}\n",
                credentials != null, System.currentTimeMillis());
            Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            logger.error("Failed to write debug log", e);
        }
        // #endregion
        
        String username = credentials != null ? credentials.get("username") : null;
        String password = credentials != null ? credentials.get("password") : null;
        
        // #region agent log
        try {
            java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
            java.nio.file.Path parentDir = logPath.getParent();
            if (parentDir != null && !Files.exists(parentDir)) {
                Files.createDirectories(parentDir);
            }
            String logEntry = String.format("{\"location\":\"AuthenticationController.java:30\",\"message\":\"Credentials extracted\",\"data\":{\"username\":\"%s\",\"hasPassword\":%s},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\",\"hypothesisId\":\"C\"}\n",
                username != null ? username : "null", password != null, System.currentTimeMillis());
            Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            logger.error("Failed to write debug log", e);
        }
        // #endregion
        
        try {
            User authenticatedUser = authenticationService.authenticateUser(username, password);
            String jwtToken = authenticationService.generateToken(authenticatedUser);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Authentication successful");
            response.put("username", authenticatedUser.getUserId());
            response.put("userType", authenticatedUser.getUserType().name());
            response.put("jwtToken", jwtToken);
            
            // #region agent log
            try {
                java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
                java.nio.file.Path parentDir = logPath.getParent();
                if (parentDir != null && !Files.exists(parentDir)) {
                    Files.createDirectories(parentDir);
                }
                String logEntry = String.format("{\"location\":\"AuthenticationController.java:40\",\"message\":\"Returning response with JWT token\",\"data\":{\"username\":\"%s\",\"userType\":\"%s\",\"hasToken\":true},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\",\"hypothesisId\":\"C\"}\n",
                    username != null ? username : "null", authenticatedUser.getUserType().name(), System.currentTimeMillis());
                Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException e) {
                logger.error("Failed to write debug log", e);
            }
            // #endregion
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Authentication failed: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUpUser(@RequestBody(required = false) Map<String, String> signupData) {
        // #region agent log
        try {
            java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
            java.nio.file.Path parentDir = logPath.getParent();
            if (parentDir != null && !Files.exists(parentDir)) {
                Files.createDirectories(parentDir);
            }
            String logEntry = String.format("{\"location\":\"AuthenticationController.java:99\",\"message\":\"Sign up request received\",\"data\":{\"hasSignupData\":%s,\"signupDataSize\":%d,\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
                signupData != null, signupData != null ? signupData.size() : 0, System.currentTimeMillis());
            Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            logger.error("Failed to write debug log", e);
        }
        // #endregion

        logger.info("Sign up request received");
        logger.info("Sign up data: {}", signupData);
        
        if (signupData == null) {
            // #region agent log
            try {
                java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
                String logEntry = String.format("{\"location\":\"AuthenticationController.java:108\",\"message\":\"Sign up data is null\",\"data\":{\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
                    System.currentTimeMillis());
                Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException e) {
                logger.error("Failed to write debug log", e);
            }
            // #endregion

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Request body is required");
            errorResponse.put("error", "Request body is required");
            return ResponseEntity.status(400).body(errorResponse);
        }
        
        String username = signupData.get("username");
        String password = signupData.get("password");
        String userTypeStr = signupData.get("userType");
        
        logger.info("Extracted - Username: {}, Password: {}, UserType: {}", 
            username != null ? username : "null", 
            password != null ? "***" : "null", 
            userTypeStr);
        
        if (username == null || username.trim().isEmpty() || 
            password == null || password.trim().isEmpty() || 
            userTypeStr == null || userTypeStr.trim().isEmpty()) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Username, password, and user type are required");
            errorResponse.put("error", "Username, password, and user type are required");
            logger.error("Missing required fields");
            return ResponseEntity.status(400).body(errorResponse);
        }
        
        try {
            User.UserType userType;
            try {
                userType = User.UserType.valueOf(userTypeStr.toUpperCase().trim());
            } catch (IllegalArgumentException e) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Invalid user type. Must be USER or ADMIN");
                errorResponse.put("error", "Invalid user type. Must be USER or ADMIN");
                logger.error("Invalid user type: {}", userTypeStr);
                return ResponseEntity.status(400).body(errorResponse);
            }
            
            User newUser = authenticationService.signUpUser(username.trim(), password, userType);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User created successfully");
            response.put("username", newUser.getUserId());
            response.put("userType", newUser.getUserType().name());
            
            logger.info("Sign up successful for user: {}", username);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // #region agent log
            try {
                java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
                String logEntry = String.format("{\"location\":\"AuthenticationController.java:151\",\"message\":\"Sign up RuntimeException caught\",\"data\":{\"error\":\"%s\",\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
                    e.getMessage() != null ? e.getMessage().replace("\"", "\\\"") : "null", System.currentTimeMillis());
                Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException ioException) {
                logger.error("Failed to write debug log", ioException);
            }
            // #endregion

            logger.error("Sign up failed: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Sign up failed";
            errorResponse.put("message", errorMessage);
            errorResponse.put("error", errorMessage);
            
            // #region agent log
            try {
                java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
                String logEntry = String.format("{\"location\":\"AuthenticationController.java:157\",\"message\":\"Returning error response\",\"data\":{\"status\":400,\"errorResponse\":%s,\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
                    errorResponse.toString(), System.currentTimeMillis());
                Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException ioException) {
                logger.error("Failed to write debug log", ioException);
            }
            // #endregion

            return ResponseEntity.status(400).body(errorResponse);
        } catch (Exception e) {
            // #region agent log
            try {
                java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
                String logEntry = String.format("{\"location\":\"AuthenticationController.java:164\",\"message\":\"Sign up unexpected Exception caught\",\"data\":{\"error\":\"%s\",\"errorClass\":\"%s\",\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
                    e.getMessage() != null ? e.getMessage().replace("\"", "\\\"") : "null", e.getClass().getName(), System.currentTimeMillis());
                Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException ioException) {
                logger.error("Failed to write debug log", ioException);
            }
            // #endregion

            logger.error("Unexpected error during sign up: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            String errorMessage = "An unexpected error occurred. Please try again.";
            errorResponse.put("message", errorMessage);
            errorResponse.put("error", errorMessage);
            
            // #region agent log
            try {
                java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
                String logEntry = String.format("{\"location\":\"AuthenticationController.java:172\",\"message\":\"Returning 500 error response\",\"data\":{\"status\":500,\"errorResponse\":%s,\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
                    errorResponse.toString(), System.currentTimeMillis());
                Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException ioException) {
                logger.error("Failed to write debug log", ioException);
            }
            // #endregion

            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
