package com.demo.eventApp.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

	// Static initializer to check class availability when class is loaded
	static {
		// #region agent log
		try {
			java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
			java.nio.file.Path parentDir = logPath.getParent();
			if (parentDir != null && !Files.exists(parentDir)) {
				Files.createDirectories(parentDir);
			}
			String logEntry = String.format("{\"location\":\"JwtUtil.java:static\",\"message\":\"JwtUtil class being loaded by classloader\",\"data\":{\"classLoader\":\"%s\",\"hypothesisId\":\"B\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
				JwtUtil.class.getClassLoader().getClass().getName(), System.currentTimeMillis());
			Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
		} catch (Exception e) {
			// Ignore logging errors in static block
		}
		// #endregion

		// #region agent log
		try {
			Class<?> claimsClass = Class.forName("io.jsonwebtoken.Claims");
			java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
			String logEntry = String.format("{\"location\":\"JwtUtil.java:static\",\"message\":\"Claims class found during JwtUtil static init\",\"data\":{\"className\":\"%s\",\"classLoader\":\"%s\",\"hypothesisId\":\"B\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
				claimsClass.getName(), claimsClass.getClassLoader().getClass().getName(), System.currentTimeMillis());
			Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
		} catch (ClassNotFoundException e) {
			try {
				java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
				String logEntry = String.format("{\"location\":\"JwtUtil.java:static\",\"message\":\"Claims class NOT found during JwtUtil static init\",\"data\":{\"error\":\"%s\",\"classLoader\":\"%s\",\"hypothesisId\":\"B\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
					e.getMessage(), JwtUtil.class.getClassLoader().getClass().getName(), System.currentTimeMillis());
				Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
			} catch (IOException ioException) {
				// Ignore
			}
		} catch (Exception e) {
			try {
				java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
				String logEntry = String.format("{\"location\":\"JwtUtil.java:static\",\"message\":\"Error checking Claims in static init\",\"data\":{\"error\":\"%s\",\"hypothesisId\":\"B\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
					e.getMessage(), System.currentTimeMillis());
				Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
			} catch (IOException ioException) {
				// Ignore
			}
		}
		// #endregion
	}

    private static final String SECRET_KEY = "mySecretKeyForJWTTokenGenerationAndValidationMustBeAtLeast256BitsLong";
    private static final long JWT_EXPIRATION = 86400000; // 24 hours in milliseconds

    private SecretKey getSigningKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username, String userType) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .subject(username)
                .claim("userType", userType)
                .claim("roles", userType)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractUserType(String token) {
        return extractClaim(token, claims -> claims.get("userType", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
