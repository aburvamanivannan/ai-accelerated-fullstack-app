package com.demo.eventApp.service;

import com.demo.eventApp.entity.User;
import com.demo.eventApp.repository.UserRepository;
import com.demo.eventApp.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public User authenticateUser(String username, String password) {
        logger.info("=== Authentication Request Received ===");
        logger.info("Username: {}", username);
        logger.info("Password: {}", password != null ? "***" : "null");
        logger.info("Attempting to authenticate user: {}", username);
        
        if (username == null || password == null) {
            throw new RuntimeException("Username and password are required");
        }
        
        Optional<User> userOpt = userRepository.findById(username);
        if (userOpt.isEmpty()) {
            logger.error("User not found: {}", username);
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        
        // Simple password comparison (in production, use password hashing)
        if (!user.getPasswordHash().equals(password)) {
            logger.error("Invalid password for user: {}", username);
            throw new RuntimeException("Invalid credentials");
        }

        logger.info("User {} authenticated successfully. User type: {}", username, user.getUserType());
        logger.info("=== Authentication Request Completed ===");
        
        return user;
    }

    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getUserId(), user.getUserType().name());
    }

    public User signUpUser(String username, String password, User.UserType userType) {
        logger.info("=== Sign Up Request Received ===");
        logger.info("Username: {}", username);
        logger.info("User Type: {}", userType);
        
        if (username == null || username.trim().isEmpty() || 
            password == null || password.trim().isEmpty() || 
            userType == null) {
            logger.error("Missing required fields for sign up");
            throw new RuntimeException("Username, password, and user type are required");
        }
        
        // Check if user already exists
        Optional<User> existingUser = userRepository.findById(username.trim());
        if (existingUser.isPresent()) {
            logger.error("User already exists: {}", username);
            throw new RuntimeException("Username already exists");
        }
        
        try {
            // Create new user
            User newUser = new User();
            newUser.setUserId(username.trim());
            newUser.setPasswordHash(password);
            newUser.setUserType(userType);
            newUser.setCreatedAt(LocalDateTime.now());
            
            User savedUser = userRepository.save(newUser);
            logger.info("User {} created successfully with type: {}", username, userType);
            logger.info("=== Sign Up Request Completed ===");
            
            return savedUser;
        } catch (Exception e) {
            logger.error("Error saving user to database: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create user: " + e.getMessage());
        }
    }
}
