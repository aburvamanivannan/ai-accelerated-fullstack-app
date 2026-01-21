package com.demo.eventApp.controller;

import com.demo.eventApp.entity.Event;
import com.demo.eventApp.service.EventService;
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
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(Constants.API_BASE)
@CrossOrigin(origins = "*")
public class EventController {

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    @Autowired
    private EventService eventService;

    @PostMapping("/events")
    public ResponseEntity<Map<String, Object>> createEvent(@RequestBody Map<String, String> request) {
        logger.info("Event creation request received");
        
        String eventName = request.get("eventName");
        String eventDateStr = request.get("eventDate");
        String username = request.get("username");

        if (eventName == null || eventDateStr == null || username == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }

        try {
            LocalDate eventDate = LocalDate.parse(eventDateStr);
            Event event = eventService.createEvent(eventName, eventDate, username);
            
            return ResponseEntity.ok(Map.of(
                "eventId", event.getEventId(),
                "eventName", event.getEventName(),
                "eventDate", event.getEventDate().toString(),
                "status", event.getStatus().toString(),
                "message", "Event created successfully"
            ));
        } catch (Exception e) {
            logger.error("Error creating event", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/events/mine")
    public ResponseEntity<List<Map<String, Object>>> getMyEvents(@RequestParam(required = false) String username) {
        // #region agent log
        try {
            java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
            java.nio.file.Path parentDir = logPath.getParent();
            if (parentDir != null && !Files.exists(parentDir)) {
                Files.createDirectories(parentDir);
            }
            String logEntry = String.format("{\"location\":\"EventController.java:56\",\"message\":\"GET /events/mine request received\",\"data\":{\"username\":\"%s\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\",\"hypothesisId\":\"C\"}\n",
                username != null ? username : "null", System.currentTimeMillis());
            Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            logger.error("Failed to write debug log", e);
        }
        // #endregion
        
        logger.info("Fetching events for user: {}", username);
        
        if (username == null) {
            // #region agent log
            try {
                java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
                java.nio.file.Path parentDir = logPath.getParent();
                if (parentDir != null && !Files.exists(parentDir)) {
                    Files.createDirectories(parentDir);
                }
                String logEntry = String.format("{\"location\":\"EventController.java:65\",\"message\":\"Username is null - returning bad request\",\"data\":{},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\",\"hypothesisId\":\"C\"}\n",
                    System.currentTimeMillis());
                Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException e) {
                logger.error("Failed to write debug log", e);
            }
            // #endregion
            return ResponseEntity.badRequest().build();
        }

        try {
            List<Event> events = eventService.getEventsByUser(username);
            
            // #region agent log
            try {
                java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
                java.nio.file.Path parentDir = logPath.getParent();
                if (parentDir != null && !Files.exists(parentDir)) {
                    Files.createDirectories(parentDir);
                }
                String logEntry = String.format("{\"location\":\"EventController.java:75\",\"message\":\"Events retrieved successfully\",\"data\":{\"eventCount\":%d},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\",\"hypothesisId\":\"C\"}\n",
                    events.size(), System.currentTimeMillis());
                Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            } catch (IOException e) {
                logger.error("Failed to write debug log", e);
            }
            // #endregion
            
            List<Map<String, Object>> eventList = events.stream().map(event -> {
                Map<String, Object> eventMap = new HashMap<>();
                eventMap.put("eventId", event.getEventId());
                eventMap.put("eventName", event.getEventName());
                eventMap.put("eventDate", event.getEventDate().toString());
                eventMap.put("status", event.getStatus().toString());
                eventMap.put("createdDate", event.getCreatedDate() != null ? event.getCreatedDate().toString() : "");
                eventMap.put("decisionDate", event.getDecisionDate() != null ? event.getDecisionDate().toString() : "");
                eventMap.put("rejectionReason", event.getRejectionReason() != null ? event.getRejectionReason() : "");
                return eventMap;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(eventList);
        } catch (Exception e) {
            logger.error("Error fetching events", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
