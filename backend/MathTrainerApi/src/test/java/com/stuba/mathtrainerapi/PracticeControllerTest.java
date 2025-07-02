package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.PracticeDTO;
import com.stuba.mathtrainerapi.api.service.PracticeService;
import com.stuba.mathtrainerapi.controller.PracticeController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PracticeControllerTest {

    @Mock
    private PracticeService practiceService;

    @InjectMocks
    private PracticeController practiceController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllPractices() {
        List<PracticeDTO> practices = Arrays.asList(new PracticeDTO(), new PracticeDTO());
        when(practiceService.findAllPractices()).thenReturn(practices);

        ResponseEntity<List<PracticeDTO>> response = practiceController.getAllPractices();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(practices, response.getBody());
    }

    @Test
    void getPracticeById_Found() {
        PracticeDTO dto = new PracticeDTO();
        when(practiceService.findPracticeById(1L)).thenReturn(Optional.of(dto));

        ResponseEntity<PracticeDTO> response = practiceController.getPracticeById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    @Test
    void getPracticeById_NotFound() {
        when(practiceService.findPracticeById(1L)).thenReturn(Optional.empty());

        ResponseEntity<PracticeDTO> response = practiceController.getPracticeById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void createPractice_Success() {
        PracticeDTO dto = new PracticeDTO();
        when(practiceService.savePractice(dto)).thenReturn(dto);

        ResponseEntity<PracticeDTO> response = practiceController.createPractice(dto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    @Test
    void createPractice_BadRequest() {
        PracticeDTO dto = new PracticeDTO();
        when(practiceService.savePractice(any(PracticeDTO.class))).thenThrow(IllegalArgumentException.class);

        ResponseEntity<PracticeDTO> response = practiceController.createPractice(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void updatePractice_Success() {
        PracticeDTO dto = new PracticeDTO();
        dto.setId(1L);
        when(practiceService.updatePractice(dto)).thenReturn(dto);

        ResponseEntity<PracticeDTO> response = practiceController.updatePractice(1L, dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    @Test
    void updatePractice_BadRequest() {
        PracticeDTO dto = new PracticeDTO();
        when(practiceService.updatePractice(any(PracticeDTO.class))).thenThrow(IllegalArgumentException.class);

        ResponseEntity<PracticeDTO> response = practiceController.updatePractice(1L, dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void deletePractice_Success() {
        when(practiceService.deletePractice(1L)).thenReturn(true);

        ResponseEntity<Void> response = practiceController.deletePractice(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(practiceService, times(1)).deletePractice(1L);
    }

    @Test
    void deletePractice_NotFound() {
        when(practiceService.deletePractice(1L)).thenReturn(false);

        ResponseEntity<Void> response = practiceController.deletePractice(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
