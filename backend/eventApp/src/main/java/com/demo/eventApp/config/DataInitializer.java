package com.demo.eventApp.config;

import com.demo.eventApp.entity.User;
import com.demo.eventApp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist
        if (userRepository.count() == 0) {
            logger.info("Initializing database with default users...");
            
            LocalDateTime today = LocalDateTime.now();
            
            // Create user1
            User user1 = new User("user1", "123", User.UserType.USER, today);
            userRepository.save(user1);
            logger.info("Created user: user1");
            
            // Create user2 (assuming user1 was meant to be user2 in the second entry)
            User user2 = new User("user2", "123", User.UserType.USER, today);
            userRepository.save(user2);
            logger.info("Created user: user2");
            
            // Create user3
            User user3 = new User("user3", "123", User.UserType.USER, today);
            userRepository.save(user3);
            logger.info("Created user: user3");
            
            // Create admin
            User admin = new User("admin", "123", User.UserType.ADMIN, today);
            userRepository.save(admin);
            logger.info("Created user: admin");
            
            logger.info("Database initialization completed. Total users: {}", userRepository.count());
        } else {
            logger.info("Database already contains users. Skipping initialization.");
        }
    }
}
