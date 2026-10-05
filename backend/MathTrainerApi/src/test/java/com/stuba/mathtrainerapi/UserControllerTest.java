package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.UserResponse;
import com.stuba.mathtrainerapi.api.dto.RegisterRequest;
import com.stuba.mathtrainerapi.api.dto.UserUpdateRequest;
import com.stuba.mathtrainerapi.api.service.UserService;
import com.stuba.mathtrainerapi.controller.UserController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsers() {
        List<UserResponse> users = Arrays.asList(new UserResponse(), new UserResponse());
        when(userService.findAllUsers()).thenReturn(users);

        ResponseEntity<List<UserResponse>> response = userController.getAllUsers();

        assertEquals(ResponseEntity.ok(users), response);
    }

    @Test
    void getUserById_Found() {
        UserResponse dto = new UserResponse();
        when(userService.findUserById(1L)).thenReturn(Optional.of(dto));

        ResponseEntity<UserResponse> response = userController.getUserById(1L);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void getUserById_NotFound() {
        when(userService.findUserById(1L)).thenReturn(Optional.empty());

        ResponseEntity<UserResponse> response = userController.getUserById(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void createUser() {
        UserResponse dto = new UserResponse();
        RegisterRequest request = new RegisterRequest();
        when(userService.isUserUnique(null, null)).thenReturn(true);
        when(userService.registerUser(request)).thenReturn(dto);

        ResponseEntity<UserResponse> response = userController.createUser(request);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(dto, response.getBody());
    }

    @Test
    void updateUser() {
        UserResponse dto = new UserResponse();
        UserUpdateRequest request = new UserUpdateRequest();
        when(userService.updateUser(1L, request)).thenReturn(dto);

        ResponseEntity<UserResponse> response = userController.updateUser(1L, request);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void deleteUser_Success() {
        when(userService.deleteUser(1L)).thenReturn(true);

        ResponseEntity<Void> response = userController.deleteUser(1L);

        assertEquals(ResponseEntity.noContent().build(), response);
    }

    @Test
    void deleteUser_NotFound() {
        when(userService.deleteUser(1L)).thenReturn(false);

        ResponseEntity<Void> response = userController.deleteUser(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }
}
