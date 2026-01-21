package com.demo.eventApp.service;

import com.demo.eventApp.entity.Event;
import com.demo.eventApp.entity.User;
import com.demo.eventApp.repository.EventRepository;
import com.demo.eventApp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Event createEvent(String eventName, LocalDate eventDate, String username) {
        logger.info("Creating event: {} for user: {}", eventName, username);
        
        Optional<User> userOpt = userRepository.findById(username);
        if (userOpt.isEmpty()) {
            logger.error("User not found: {}", username);
            throw new RuntimeException("User not found: " + username);
        }

        User user = userOpt.get();
        Event event = new Event();
        event.setEventName(eventName);
        event.setEventDate(eventDate);
        event.setCreatedBy(user);
        event.setStatus(Event.EventStatus.PENDING);
        event.setCreatedDate(LocalDateTime.now());

        Event savedEvent = eventRepository.save(event);
        logger.info("Event created successfully with ID: {}", savedEvent.getEventId());
        return savedEvent;
    }

    public List<Event> getEventsByUser(String username) {
        logger.info("Fetching events for user: {}", username);
        
        Optional<User> userOpt = userRepository.findById(username);
        if (userOpt.isEmpty()) {
            logger.error("User not found: {}", username);
            return List.of();
        }

        User user = userOpt.get();
        List<Event> events = eventRepository.findByCreatedBy(user);
        logger.info("Found {} events for user: {}", events.size(), username);
        return events;
    }
}
