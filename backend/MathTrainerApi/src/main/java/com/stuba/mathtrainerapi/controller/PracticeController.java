package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.dto.PracticeDTO;
import com.stuba.mathtrainerapi.api.service.PracticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/practices")
public class PracticeController {

    private final PracticeService practiceService;

    @Autowired
    public PracticeController(PracticeService practiceService) {
        this.practiceService = practiceService;
    }

    @GetMapping
    public ResponseEntity<List<PracticeDTO>> getAllPractices() {
        List<PracticeDTO> practices = practiceService.findAllPractices();
        return new ResponseEntity<>(practices, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PracticeDTO> getPracticeById(@PathVariable Long id) {
        Optional<PracticeDTO> practiceDTO = practiceService.findPracticeById(id);
        return practiceDTO.map(practice -> new ResponseEntity<>(practice, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<PracticeDTO> createPractice(@RequestBody PracticeDTO practiceDTO) {
        try {
            PracticeDTO savedPractice = practiceService.savePractice(practiceDTO);
            return new ResponseEntity<>(savedPractice, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PracticeDTO> updatePractice(@PathVariable Long id, @RequestBody PracticeDTO practiceDTO) {
        if (!id.equals(practiceDTO.getId())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            PracticeDTO updatedPractice = practiceService.updatePractice(practiceDTO);
            return new ResponseEntity<>(updatedPractice, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePractice(@PathVariable Long id) {
        boolean deleted = practiceService.deletePractice(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
