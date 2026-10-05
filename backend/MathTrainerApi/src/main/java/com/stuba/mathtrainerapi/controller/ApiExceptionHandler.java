package com.stuba.mathtrainerapi.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.List;

@RestControllerAdvice
public class ApiExceptionHandler {
    public record InputError(String error, List<String> fields) {}

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<InputError> invalidInput(MethodArgumentNotValidException exception) {
        // Do not return or log rejected values: these can include credentials.
        List<String> fields = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField()).distinct().sorted().toList();
        return ResponseEntity.badRequest().body(new InputError("invalid_request", fields));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<InputError> unreadableInput() {
        return ResponseEntity.badRequest().body(new InputError("invalid_request", List.of()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<InputError> conflict() {
        return ResponseEntity.status(409).body(new InputError("data_conflict", List.of()));
    }
}
