package com.demo.eventApp.service;

import com.demo.eventApp.entity.Event;
import com.demo.eventApp.entity.User;
import com.demo.eventApp.repository.EventRepository;
import com.demo.eventApp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Event> getAllEvents() {
        logger.info("Fetching all events for admin");
        List<Event> events = eventRepository.findAll();
        logger.info("Found {} total events", events.size());
        return events;
    }

    public List<Event> getEventsByStatus(Event.EventStatus status) {
        logger.info("Fetching events with status: {}", status);
        List<Event> events = eventRepository.findByStatus(status);
        logger.info("Found {} events with status: {}", events.size(), status);
        return events;
    }

    public Event approveEvent(Long eventId, String adminUsername) {
        logger.info("Approving event ID: {} by admin: {}", eventId, adminUsername);
        
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            logger.error("Event not found with ID: {}", eventId);
            throw new RuntimeException("Event not found with ID: " + eventId);
        }

        Event event = eventOpt.get();
        if (event.getStatus() != Event.EventStatus.PENDING) {
            logger.error("Event ID: {} is not in PENDING status. Current status: {}", eventId, event.getStatus());
            throw new RuntimeException("Event is not in PENDING status");
        }

        Optional<User> adminOpt = userRepository.findById(adminUsername);
        if (adminOpt.isEmpty()) {
            logger.error("Admin user not found: {}", adminUsername);
            throw new RuntimeException("Admin user not found: " + adminUsername);
        }

        User admin = adminOpt.get();
        event.setStatus(Event.EventStatus.APPROVED);
        event.setApprovedBy(admin);
        event.setDecisionDate(LocalDateTime.now());

        Event savedEvent = eventRepository.save(event);
        logger.info("Event ID: {} approved successfully by admin: {}", eventId, adminUsername);
        return savedEvent;
    }

    public Event rejectEvent(Long eventId, String adminUsername, String rejectionReason) {
        logger.info("Rejecting event ID: {} by admin: {}", eventId, adminUsername);
        
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            logger.error("Event not found with ID: {}", eventId);
            throw new RuntimeException("Event not found with ID: " + eventId);
        }

        Event event = eventOpt.get();
        if (event.getStatus() != Event.EventStatus.PENDING) {
            logger.error("Event ID: {} is not in PENDING status. Current status: {}", eventId, event.getStatus());
            throw new RuntimeException("Event is not in PENDING status");
        }

        Optional<User> adminOpt = userRepository.findById(adminUsername);
        if (adminOpt.isEmpty()) {
            logger.error("Admin user not found: {}", adminUsername);
            throw new RuntimeException("Admin user not found: " + adminUsername);
        }

        User admin = adminOpt.get();
        event.setStatus(Event.EventStatus.REJECTED);
        event.setApprovedBy(admin);
        event.setDecisionDate(LocalDateTime.now());
        event.setRejectionReason(rejectionReason);

        Event savedEvent = eventRepository.save(event);
        logger.info("Event ID: {} rejected successfully by admin: {}", eventId, adminUsername);
        return savedEvent;
    }
}
