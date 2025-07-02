package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.PracticeCompletionDTO;
import com.stuba.mathtrainerapi.api.dto.TheoryCompletionDTO;
import com.stuba.mathtrainerapi.api.dto.UserDTO;
import com.stuba.mathtrainerapi.api.service.PracticeCompletionService;
import com.stuba.mathtrainerapi.api.service.TheoryCompletionService;
import com.stuba.mathtrainerapi.api.service.UserService;
import com.stuba.mathtrainerapi.controller.UserProfileController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserProfileControllerTest {

    @Mock
    private TheoryCompletionService theoryCompletionService;

    @Mock
    private PracticeCompletionService practiceCompletionService;

    @Mock
    private UserService userService;

    @Mock
    private Principal principal;

    @InjectMocks
    private UserProfileController userProfileController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getTheoryCompletions() {
        Long userId = 1L;
        List<TheoryCompletionDTO> completions = Arrays.asList(new TheoryCompletionDTO(), new TheoryCompletionDTO());
        when(userService.findByUsername(anyString())).thenReturn(Optional.of(new UserDTO()));
        when(theoryCompletionService.findAllTheoryCompletionsByUser(userId)).thenReturn(completions);

        ResponseEntity<List<TheoryCompletionDTO>> response = userProfileController.getTheoryCompletions(principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(completions, response.getBody());
    }

    @Test
    void getPracticeCompletions() {
        Long userId = 1L;
        List<PracticeCompletionDTO> completions = Arrays.asList(new PracticeCompletionDTO(), new PracticeCompletionDTO());
        when(userService.findByUsername(anyString())).thenReturn(Optional.of(new UserDTO()));
        when(practiceCompletionService.findAllPracticeCompletionsByUser(userId)).thenReturn(completions);

        ResponseEntity<List<PracticeCompletionDTO>> response = userProfileController.getPracticeCompletions(principal);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(completions, response.getBody());
    }

    @Test
    void createTheoryCompletion_Conflict() {
        TheoryCompletionDTO dto = new TheoryCompletionDTO();
        dto.setUserId(2L);

        when(userService.findByUsername(anyString())).thenReturn(Optional.of(new UserDTO()));

        ResponseEntity<TheoryCompletionDTO> response = userProfileController.createTheoryCompletion(dto, principal);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void createTheoryCompletion_Success() {
        TheoryCompletionDTO dto = new TheoryCompletionDTO();
        dto.setUserId(1L);
        when(userService.findByUsername(anyString())).thenReturn(Optional.of(new UserDTO()));
        when(theoryCompletionService.saveTheoryCompletion(dto)).thenReturn(dto);

        ResponseEntity<TheoryCompletionDTO> response = userProfileController.createTheoryCompletion(dto, principal);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    @Test
    void createPracticeCompletion_Conflict() {
        PracticeCompletionDTO dto = new PracticeCompletionDTO();
        dto.setUserId(2L);

        when(userService.findByUsername(anyString())).thenReturn(Optional.of(new UserDTO()));

        ResponseEntity<PracticeCompletionDTO> response = userProfileController.createPracticeCompletion(dto, principal);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void createPracticeCompletion_Success() {
        PracticeCompletionDTO dto = new PracticeCompletionDTO();
        dto.setUserId(1L);
        when(userService.findByUsername(anyString())).thenReturn(Optional.of(new UserDTO()));
        when(practiceCompletionService.savePracticeCompletion(dto)).thenReturn(dto);

        ResponseEntity<PracticeCompletionDTO> response = userProfileController.createPracticeCompletion(dto, principal);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    private Long getUserIdFromPrincipal() {
        UserDetails userDetails = mock(UserDetails.class);
        Authentication authentication = mock(Authentication.class);
        when(principal.getName()).thenReturn("testuser");
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("testuser");
        when(userService.findByUsername("testuser")).thenReturn(Optional.of(new UserDTO()));
        return 1L;
    }
}
