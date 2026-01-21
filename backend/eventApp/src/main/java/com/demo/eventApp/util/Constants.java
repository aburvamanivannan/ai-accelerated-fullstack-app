package com.demo.eventApp.util;

public class Constants {
    
    // Log Path
    public static final String LOG_PATH = "/Users/aburvamanivannan/Documents/Ai-Project/event-booking-app/.cursor/debug.log";
    
    // API Base Paths
    public static final String API_BASE = "/api";
    public static final String API_ADMIN_BASE = "/api/admin";
    
    // Authentication Endpoints
    public static final String API_AUTHENTICATE = "/api/authenticate";
    public static final String API_SIGNUP = "/api/signup";
    
    // Event Endpoints
    public static final String API_EVENTS = "/api/events";
    public static final String API_EVENTS_MINE = "/api/events/mine";
    
    // Admin Event Endpoints
    public static final String API_ADMIN_EVENTS = "/api/admin/events";
    public static final String API_ADMIN_EVENTS_APPROVE = "/api/admin/events/{eventId}/approve";
    public static final String API_ADMIN_EVENTS_REJECT = "/api/admin/events/{eventId}/reject";
    
    // Security Config Paths
    public static final String[] PUBLIC_PATHS = {
        API_AUTHENTICATE,
        API_SIGNUP
    };
    
    public static final String[] USER_ADMIN_PATHS = {
        API_EVENTS,
        API_EVENTS + "/**"
    };
    
    public static final String[] ADMIN_ONLY_PATHS = {
        API_ADMIN_BASE + "/**"
    };
}
