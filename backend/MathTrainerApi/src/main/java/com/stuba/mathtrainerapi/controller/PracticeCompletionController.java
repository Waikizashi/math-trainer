package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.dto.PracticeCompletionDTO;
import com.stuba.mathtrainerapi.api.service.PracticeCompletionService;
import com.stuba.mathtrainerapi.entity.PracticeCompletion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practiceCompletions")
public class PracticeCompletionController {

    private final PracticeCompletionService practiceCompletionService;

    @Autowired
    public PracticeCompletionController(PracticeCompletionService practiceCompletionService) {
        this.practiceCompletionService = practiceCompletionService;
    }

    @GetMapping
    public List<PracticeCompletionDTO> getAllPracticeCompletions() {
        return practiceCompletionService.findAllPracticeCompletions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PracticeCompletionDTO> getPracticeCompletionById(@PathVariable Long id) {
        return practiceCompletionService.findPracticeCompletionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public PracticeCompletionDTO createPracticeCompletion(@RequestBody PracticeCompletionDTO practiceCompletion) {
        return practiceCompletionService.savePracticeCompletion(practiceCompletion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PracticeCompletionDTO> updatePracticeCompletion(@PathVariable Long id, @RequestBody PracticeCompletionDTO practiceCompletion) {
        if (practiceCompletionService.findPracticeCompletionById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        practiceCompletion.setId(id);
        return ResponseEntity.ok(practiceCompletionService.updatePracticeCompletion(practiceCompletion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePracticeCompletion(@PathVariable Long id) {
        if (practiceCompletionService.findPracticeCompletionById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        practiceCompletionService.deletePracticeCompletion(id);
        return ResponseEntity.ok().build();
    }
}