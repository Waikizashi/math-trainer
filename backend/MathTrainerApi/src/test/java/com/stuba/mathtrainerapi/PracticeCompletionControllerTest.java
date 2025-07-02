package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.PracticeCompletionDTO;
import com.stuba.mathtrainerapi.api.service.PracticeCompletionService;
import com.stuba.mathtrainerapi.controller.PracticeCompletionController;
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

class PracticeCompletionControllerTest {

    @Mock
    private PracticeCompletionService practiceCompletionService;

    @InjectMocks
    private PracticeCompletionController practiceCompletionController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllPracticeCompletions() {
        List<PracticeCompletionDTO> completions = Arrays.asList(new PracticeCompletionDTO(), new PracticeCompletionDTO());
        when(practiceCompletionService.findAllPracticeCompletions()).thenReturn(completions);

        List<PracticeCompletionDTO> response = practiceCompletionController.getAllPracticeCompletions();

        assertEquals(2, response.size());
        assertEquals(completions, response);
    }

    @Test
    void getPracticeCompletionById_Found() {
        PracticeCompletionDTO dto = new PracticeCompletionDTO();
        when(practiceCompletionService.findPracticeCompletionById(1L)).thenReturn(Optional.of(dto));

        ResponseEntity<PracticeCompletionDTO> response = practiceCompletionController.getPracticeCompletionById(1L);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void getPracticeCompletionById_NotFound() {
        when(practiceCompletionService.findPracticeCompletionById(1L)).thenReturn(Optional.empty());

        ResponseEntity<PracticeCompletionDTO> response = practiceCompletionController.getPracticeCompletionById(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void createPracticeCompletion() {
        PracticeCompletionDTO dto = new PracticeCompletionDTO();
        when(practiceCompletionService.savePracticeCompletion(dto)).thenReturn(dto);

        PracticeCompletionDTO response = practiceCompletionController.createPracticeCompletion(dto);

        assertEquals(dto, response);
    }

    @Test
    void updatePracticeCompletion_Success() {
        PracticeCompletionDTO dto = new PracticeCompletionDTO();
        dto.setId(1L);
        when(practiceCompletionService.findPracticeCompletionById(1L)).thenReturn(Optional.of(dto));
        when(practiceCompletionService.updatePracticeCompletion(dto)).thenReturn(dto);

        ResponseEntity<PracticeCompletionDTO> response = practiceCompletionController.updatePracticeCompletion(1L, dto);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void updatePracticeCompletion_NotFound() {
        PracticeCompletionDTO dto = new PracticeCompletionDTO();
        when(practiceCompletionService.findPracticeCompletionById(1L)).thenReturn(Optional.empty());

        ResponseEntity<PracticeCompletionDTO> response = practiceCompletionController.updatePracticeCompletion(1L, dto);

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void deletePracticeCompletion_Success() {
        when(practiceCompletionService.findPracticeCompletionById(1L)).thenReturn(Optional.of(new PracticeCompletionDTO()));

        ResponseEntity<?> response = practiceCompletionController.deletePracticeCompletion(1L);

        assertEquals(ResponseEntity.ok().build(), response);
        verify(practiceCompletionService, times(1)).deletePracticeCompletion(1L);
    }

    @Test
    void deletePracticeCompletion_NotFound() {
        when(practiceCompletionService.findPracticeCompletionById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = practiceCompletionController.deletePracticeCompletion(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }
}
