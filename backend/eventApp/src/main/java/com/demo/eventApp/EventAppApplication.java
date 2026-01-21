package com.demo.eventApp;

import com.demo.eventApp.util.Constants;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@SpringBootApplication
public class EventAppApplication {

	public static void main(String[] args) {
		// #region agent log
		try {
			java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
			java.nio.file.Path parentDir = logPath.getParent();
			if (parentDir != null && !Files.exists(parentDir)) {
				Files.createDirectories(parentDir);
			}
			String logEntry = String.format("{\"location\":\"EventAppApplication.java:15\",\"message\":\"Application starting - checking JWT class availability\",\"data\":{\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
				System.currentTimeMillis());
			Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
		} catch (IOException e) {
			System.err.println("Failed to write debug log: " + e.getMessage());
		}
		// #endregion

		// #region agent log
		try {
			Class<?> claimsClass = Class.forName("io.jsonwebtoken.Claims");
			java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
			String logEntry = String.format("{\"location\":\"EventAppApplication.java:25\",\"message\":\"JWT Claims class found on classpath\",\"data\":{\"className\":\"%s\",\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
				claimsClass.getName(), System.currentTimeMillis());
			Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
		} catch (ClassNotFoundException e) {
			try {
				java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
				String logEntry = String.format("{\"location\":\"EventAppApplication.java:30\",\"message\":\"JWT Claims class NOT found on classpath\",\"data\":{\"error\":\"%s\",\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
					e.getMessage(), System.currentTimeMillis());
				Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
			} catch (IOException ioException) {
				System.err.println("Failed to write debug log: " + ioException.getMessage());
			}
		} catch (Exception e) {
			try {
				java.nio.file.Path logPath = Paths.get(Constants.LOG_PATH);
				String logEntry = String.format("{\"location\":\"EventAppApplication.java:37\",\"message\":\"Error checking JWT class\",\"data\":{\"error\":\"%s\",\"hypothesisId\":\"A\"},\"timestamp\":%d,\"sessionId\":\"debug-session\",\"runId\":\"run1\"}\n",
					e.getMessage(), System.currentTimeMillis());
				Files.write(logPath, logEntry.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.APPEND);
			} catch (IOException ioException) {
				System.err.println("Failed to write debug log: " + ioException.getMessage());
			}
		}
		// #endregion

		SpringApplication.run(EventAppApplication.class, args);
	}

}
