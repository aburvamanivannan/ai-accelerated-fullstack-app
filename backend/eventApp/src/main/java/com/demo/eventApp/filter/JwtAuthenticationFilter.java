package com.demo.eventApp.filter;

import com.demo.eventApp.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // #region agent log
        if (request.getRequestURI().contains("/signup") || request.getRequestURI().contains("/authenticate")) {
            try {
                java.nio.file.Path logPath = java.nio.file.Paths.get("/Users/aburvamanivannan/Documents/Ai-Project/event-booking-app/.cursor/debug.log");
                java.nio.file.Path parentDir = logPath.getParent();
                if (parentDir != null && !java.nio.file.Files.exists(parentDir)) {
                    java.nio.file.Files.createDirectories(parentDir);
                }
                String logEntry = String.format("{\"location\":\"JwtAuthenticationFilter.java:28\",\"message\":\"JWT filter processing request\",\"data\":{\"uri\":\"%s\",\"method\":\"%s\",\"hasAuthHeader\":%s,\"hypothesisId\":\"D\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
                    request.getRequestURI(), request.getMethod(), request.getHeader("Authorization") != null, System.currentTimeMillis());
                java.nio.file.Files.write(logPath, logEntry.getBytes(), java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
            } catch (Exception e) {
                logger.error("Failed to write debug log", e);
            }
        }
        // #endregion

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
            } catch (Exception e) {
                // #region agent log
                try {
                    java.nio.file.Path logPath = java.nio.file.Paths.get("/Users/aburvamanivannan/Documents/Ai-Project/event-booking-app/.cursor/debug.log");
                    String logEntry = String.format("{\"location\":\"JwtAuthenticationFilter.java:36\",\"message\":\"Error extracting username from token\",\"data\":{\"error\":\"%s\",\"uri\":\"%s\",\"hypothesisId\":\"D\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
                        e.getMessage() != null ? e.getMessage().replace("\"", "\\\"") : "null", request.getRequestURI(), System.currentTimeMillis());
                    java.nio.file.Files.write(logPath, logEntry.getBytes(), java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
                } catch (Exception logException) {
                    // Ignore logging errors
                }
                // #endregion
                logger.error("Error extracting username from token", e);
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                String userType = jwtUtil.extractUserType(token);
                String role = "ROLE_" + userType;

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(role))
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
