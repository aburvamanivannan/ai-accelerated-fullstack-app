package com.demo.eventApp.controller;

import com.demo.eventApp.entity.Event;
import com.demo.eventApp.service.AdminService;
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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping(Constants.API_ADMIN_BASE)
@CrossOrigin(origins = "*")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    @GetMapping("/events")
    public ResponseEntity<List<Map<String, Object>>> getAllEvents(@RequestParam(required = false) String status) {
        // #region agent log
        try {
            java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
            java.nio.file.Path parentDir = logPath.getParent();
            if (parentDir != null && !Files.exists(parentDir)) {
                Files.createDirectories(parentDir);
            }
            String logEntry = String.format("{\"location\":\"AdminController.java:26\",\"message\":\"GET /api/admin/events request received\",\"data\":{\"status\":\"%s\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\",\"hypothesisId\":\"C\"}\n",
                status != null ? status : "null", System.currentTimeMillis());
            Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            logger.error("Failed to write debug log", e);
        }
        // #endregion
        
        logger.info("Admin fetching all events with status filter: {}", status);
        
        List<Event> events;
        if (status != null && !status.isEmpty()) {
            try {
                Event.EventStatus eventStatus = Event.EventStatus.valueOf(status.toUpperCase());
                events = adminService.getEventsByStatus(eventStatus);
            } catch (IllegalArgumentException e) {
                logger.error("Invalid status: {}", status);
                return ResponseEntity.badRequest().build();
            }
        } else {
            events = adminService.getAllEvents();
        }

        List<Map<String, Object>> eventList = events.stream().map(event -> {
            Map<String, Object> eventMap = new HashMap<>();
            eventMap.put("eventId", event.getEventId());
            eventMap.put("eventName", event.getEventName());
            eventMap.put("eventDate", event.getEventDate().toString());
            eventMap.put("status", event.getStatus().toString());
            eventMap.put("createdDate", event.getCreatedDate() != null ? event.getCreatedDate().toString() : "");
            eventMap.put("decisionDate", event.getDecisionDate() != null ? event.getDecisionDate().toString() : "");
            eventMap.put("rejectionReason", event.getRejectionReason() != null ? event.getRejectionReason() : "");
            eventMap.put("requestedUser", event.getCreatedBy() != null ? event.getCreatedBy().getUserId() : "");
            return eventMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(eventList);
    }

    @PostMapping("/events/{eventId}/approve")
    public ResponseEntity<Map<String, Object>> approveEvent(
            @PathVariable Long eventId,
            @RequestBody Map<String, String> request) {
        logger.info("Admin approving event ID: {}", eventId);
        
        String adminUsername = request.get("username");
        if (adminUsername == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }

        try {
            Event event = adminService.approveEvent(eventId, adminUsername);
            return ResponseEntity.ok(Map.of(
                "eventId", event.getEventId(),
                "eventName", event.getEventName(),
                "status", event.getStatus().toString(),
                "message", "Event approved successfully"
            ));
        } catch (Exception e) {
            logger.error("Error approving event", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/events/{eventId}/reject")
    public ResponseEntity<Map<String, Object>> rejectEvent(
            @PathVariable Long eventId,
            @RequestBody Map<String, String> request) {
        logger.info("Admin rejecting event ID: {}", eventId);
        
        String adminUsername = request.get("username");
        String rejectionReason = request.get("rejectionReason");
        
        if (adminUsername == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }

        try {
            Event event = adminService.rejectEvent(eventId, adminUsername, rejectionReason);
            return ResponseEntity.ok(Map.of(
                "eventId", event.getEventId(),
                "eventName", event.getEventName(),
                "status", event.getStatus().toString(),
                "message", "Event rejected successfully"
            ));
        } catch (Exception e) {
            logger.error("Error rejecting event", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
