package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.TheoryCompletionDTO;
import com.stuba.mathtrainerapi.api.service.TheoryCompletionService;
import com.stuba.mathtrainerapi.controller.TheoryCompletionController;
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

class TheoryCompletionControllerTest {

    @Mock
    private TheoryCompletionService theoryCompletionService;

    @InjectMocks
    private TheoryCompletionController theoryCompletionController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllTheoryCompletions() {
        List<TheoryCompletionDTO> completions = Arrays.asList(new TheoryCompletionDTO(), new TheoryCompletionDTO());
        when(theoryCompletionService.findAllTheoryCompletions()).thenReturn(completions);

        List<TheoryCompletionDTO> response = theoryCompletionController.getAllTheoryCompletions();

        assertEquals(2, response.size());
        assertEquals(completions, response);
    }

    @Test
    void getTheoryCompletionById_Found() {
        TheoryCompletionDTO dto = new TheoryCompletionDTO();
        when(theoryCompletionService.findTheoryCompletionById(1L)).thenReturn(Optional.of(dto));

        ResponseEntity<TheoryCompletionDTO> response = theoryCompletionController.getTheoryCompletionById(1L);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void getTheoryCompletionById_NotFound() {
        when(theoryCompletionService.findTheoryCompletionById(1L)).thenReturn(Optional.empty());

        ResponseEntity<TheoryCompletionDTO> response = theoryCompletionController.getTheoryCompletionById(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void createTheoryCompletion() {
        TheoryCompletionDTO dto = new TheoryCompletionDTO();
        when(theoryCompletionService.saveTheoryCompletion(dto)).thenReturn(dto);

        TheoryCompletionDTO response = theoryCompletionController.createTheoryCompletion(dto);

        assertEquals(dto, response);
    }

    @Test
    void updateTheoryCompletion_Success() {
        TheoryCompletionDTO dto = new TheoryCompletionDTO();
        dto.setId(1L);
        when(theoryCompletionService.findTheoryCompletionById(1L)).thenReturn(Optional.of(dto));
        when(theoryCompletionService.updateTheoryCompletion(dto)).thenReturn(dto);

        ResponseEntity<TheoryCompletionDTO> response = theoryCompletionController.updateTheoryCompletion(1L, dto);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void updateTheoryCompletion_NotFound() {
        TheoryCompletionDTO dto = new TheoryCompletionDTO();
        when(theoryCompletionService.findTheoryCompletionById(1L)).thenReturn(Optional.empty());

        ResponseEntity<TheoryCompletionDTO> response = theoryCompletionController.updateTheoryCompletion(1L, dto);

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void deleteTheoryCompletion_Success() {
        when(theoryCompletionService.findTheoryCompletionById(1L)).thenReturn(Optional.of(new TheoryCompletionDTO()));

        ResponseEntity<?> response = theoryCompletionController.deleteTheoryCompletion(1L);

        assertEquals(ResponseEntity.ok().build(), response);
        verify(theoryCompletionService, times(1)).deleteTheoryCompletion(1L);
    }

    @Test
    void deleteTheoryCompletion_NotFound() {
        when(theoryCompletionService.findTheoryCompletionById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = theoryCompletionController.deleteTheoryCompletion(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }
}
