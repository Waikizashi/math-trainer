package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.TheoryDTO;
import com.stuba.mathtrainerapi.api.service.TheoryService;
import com.stuba.mathtrainerapi.controller.TheoryController;
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

class TheoryControllerTest {

    @Mock
    private TheoryService theoryService;

    @InjectMocks
    private TheoryController theoryController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllTheories() {
        List<TheoryDTO> theories = Arrays.asList(new TheoryDTO(), new TheoryDTO());
        when(theoryService.findAllTheories()).thenReturn(theories);

        List<TheoryDTO> response = theoryController.getAllTheories();

        assertEquals(2, response.size());
        assertEquals(theories, response);
    }

    @Test
    void getTheoryById_Found() {
        TheoryDTO dto = new TheoryDTO();
        when(theoryService.findTheoryById(1L)).thenReturn(Optional.of(dto));

        ResponseEntity<TheoryDTO> response = theoryController.getTheoryById(1L);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void getTheoryById_NotFound() {
        when(theoryService.findTheoryById(1L)).thenReturn(Optional.empty());

        ResponseEntity<TheoryDTO> response = theoryController.getTheoryById(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void createTheory() {
        TheoryDTO dto = new TheoryDTO();
        when(theoryService.saveTheory(dto)).thenReturn(dto);

        ResponseEntity<TheoryDTO> response = theoryController.createTheory(dto);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void updateTheory_Success() {
        TheoryDTO dto = new TheoryDTO();
        dto.setId(1L);
        when(theoryService.findTheoryById(1L)).thenReturn(Optional.of(dto));
        when(theoryService.updateTheory(dto)).thenReturn(dto);

        ResponseEntity<TheoryDTO> response = theoryController.updateTheory(1L, dto);

        assertEquals(ResponseEntity.ok(dto), response);
    }

    @Test
    void updateTheory_NotFound() {
        TheoryDTO dto = new TheoryDTO();
        when(theoryService.findTheoryById(1L)).thenReturn(Optional.empty());

        ResponseEntity<TheoryDTO> response = theoryController.updateTheory(1L, dto);

        assertEquals(ResponseEntity.notFound().build(), response);
    }

    @Test
    void deleteTheory_Success() {
        when(theoryService.deleteTheory(1L)).thenReturn(true);

        ResponseEntity<?> response = theoryController.deleteTheory(1L);

        assertEquals(ResponseEntity.ok().build(), response);
        verify(theoryService, times(1)).deleteTheory(1L);
    }

    @Test
    void deleteTheory_NotFound() {
        when(theoryService.deleteTheory(1L)).thenReturn(false);

        ResponseEntity<?> response = theoryController.deleteTheory(1L);

        assertEquals(ResponseEntity.notFound().build(), response);
    }
}
