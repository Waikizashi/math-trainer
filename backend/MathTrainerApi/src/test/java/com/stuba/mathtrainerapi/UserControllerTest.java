package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.UserDTO;
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
        List<UserDTO> users = Arrays.asList(new UserDTO(), new UserDTO());
        when(userService.findAllUsers()).thenReturn(users);

        ResponseEntity<List<UserDTO>> response = userController.getAllUsers();

        assertEquals(ResponseEntity.ok(users), response);
    }

    @Test
    void getUserById_Found() {
        UserDTO dto = new UserDTO();
        when(userService.findUserById(1L)).thenReturn(Optional.of(dto));

        ResponseEntity<UserDTO> response = userController.getUserById(1L);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void getUserById_NotFound() {
        when(userService.findUserById(1L)).thenReturn(Optional.empty());

        ResponseEntity<UserDTO> response = userController.getUserById(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void createUser() {
        UserDTO dto = new UserDTO();
        when(userService.saveUser(dto)).thenReturn(dto);

        ResponseEntity<UserDTO> response = userController.createUser(dto);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void updateUser() {
        UserDTO dto = new UserDTO();
        when(userService.updateUser(dto)).thenReturn(dto);

        ResponseEntity<UserDTO> response = userController.updateUser(1L, dto);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void deleteUser_Success() {
        when(userService.deleteUser(1L)).thenReturn(true);

        ResponseEntity<Void> response = userController.deleteUser(1L);

        assertEquals(ResponseEntity.ok().build(), response);
    }

    @Test
    void deleteUser_NotFound() {
        when(userService.deleteUser(1L)).thenReturn(false);

        ResponseEntity<Void> response = userController.deleteUser(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }
}
