package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.AuthDTO;
import com.stuba.mathtrainerapi.api.dto.UserDTO;
import com.stuba.mathtrainerapi.api.service.UserService;
import com.stuba.mathtrainerapi.controller.AuthController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void registerUser_UniqueUser_Success() {
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("testuser");
        userDTO.setEmail("test@example.com");

        when(userService.isUserUnique("testuser", "test@example.com")).thenReturn(true);
        when(userService.saveUser(any(UserDTO.class))).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = authController.registerUser(userDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(userDTO, response.getBody());
    }

    @Test
    void registerUser_DuplicateUser_Conflict() {
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername("testuser");
        userDTO.setEmail("test@example.com");

        when(userService.isUserUnique("testuser", "test@example.com")).thenReturn(false);

        ResponseEntity<UserDTO> response = authController.registerUser(userDTO);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void loginUser_Success() {
        AuthDTO authDTO = new AuthDTO();
        authDTO.setUsername("testuser");
        authDTO.setPassword("password");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        when(request.getSession(true)).thenReturn(session);
        when(userService.findByUsername("testuser")).thenReturn(Optional.of(new UserDTO()));

        SecurityContext securityContext = mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);

        ResponseEntity<?> response = authController.loginUser(authDTO, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void loginUser_Failure() {
        AuthDTO authDTO = new AuthDTO();
        authDTO.setUsername("testuser");
        authDTO.setPassword("password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(RuntimeException.class);

        ResponseEntity<?> response = authController.loginUser(authDTO, request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Login failed", response.getBody());
    }

    @Test
    void logout_Success() {
        when(request.getSession(false)).thenReturn(session);

        ResponseEntity<?> response = authController.logout(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Logged out successfully", response.getBody());
        verify(session, times(1)).invalidate();
        verify(SecurityContextHolder.getContext(), times(1)).setAuthentication(null);
    }

    @Test
    void logout_NoSession() {
        when(request.getSession(false)).thenReturn(null);

        ResponseEntity<?> response = authController.logout(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("No session found", response.getBody());
    }
}
