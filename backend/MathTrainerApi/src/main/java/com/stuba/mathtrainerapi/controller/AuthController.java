package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.dto.AuthDTO;
import com.stuba.mathtrainerapi.api.dto.UserResponse;
import com.stuba.mathtrainerapi.api.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.AuthenticationException;
import com.stuba.mathtrainerapi.api.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository contexts;
    private final SessionAuthenticationStrategy sessionStrategy;

    @Autowired
    public AuthController(UserService userService, AuthenticationManager authenticationManager,
                          SecurityContextRepository contexts, SessionAuthenticationStrategy sessionStrategy) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.contexts = contexts;
        this.sessionStrategy = sessionStrategy;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userService.isUserUnique(registerRequest.getUsername(), registerRequest.getEmail())) {
            UserResponse savedUser = userService.registerUser(registerRequest);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody AuthDTO loginRequest, HttpServletRequest request,
                                       HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            sessionStrategy.onAuthentication(authentication, request, response);
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            contexts.saveContext(context, request, response);
            String username = authentication.getName();
            UserResponse user = userService.findByUsername(username).orElse(null);
            return ResponseEntity.ok().body(user);
        } catch (AuthenticationException e) {
            SecurityContextHolder.clearContext();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
        }
    }

    @GetMapping("/current/user")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            UserResponse user = userService.findByUsername(username).orElse(null);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}

