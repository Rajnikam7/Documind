package com.raj.documind.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Global Exception Handler — catches errors from ANY controller in the app.
 *
 * @RestControllerAdvice → like a middleware that intercepts exceptions before
 * they reach the client, so you can return clean JSON error responses instead
 * of ugly Spring stack traces.
 *
 * Think of it as Express's app.use((err, req, res, next) => { ... })
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles file upload errors (e.g. file too large).
     * Triggered when uploaded file exceeds the size set in application.properties.
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        return buildError(HttpStatus.PAYLOAD_TOO_LARGE, "File size exceeds the maximum allowed limit (10MB)");
    }

    /**
     * Handles file I/O errors — e.g. disk full, bad path, permission denied.
     */
    @ExceptionHandler(java.io.IOException.class)
    public ResponseEntity<Map<String, Object>> handleIOException(java.io.IOException ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "File operation failed: " + ex.getMessage());
    }

    /**
     * Handles illegal arguments — e.g. null file name, empty file.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /**
     * Catch-all — handles any other unexpected exception.
     * Always good to have this so nothing leaks a raw stack trace to the client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong: " + ex.getMessage());
    }

    /**
     * Helper to build a consistent JSON error response shape:
     * {
     *   "status": 400,
     *   "error": "Bad Request",
     *   "message": "...",
     *   "timestamp": "2026-04-23T10:00:00"
     * }
     */
    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String message) {
        Map<String, Object> body = Map.of(
                "status", status.value(),
                "error", status.getReasonPhrase(),
                "message", message,
                "timestamp", LocalDateTime.now().toString()
        );
        return ResponseEntity.status(status).body(body);
    }
}
