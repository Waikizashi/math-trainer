package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.service.TheoryCompletionService;
import com.stuba.mathtrainerapi.entity.TheoryCompletion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theoryCompletions")
public class TheoryCompletionController {

    private final TheoryCompletionService theoryCompletionService;

    @Autowired
    public TheoryCompletionController(TheoryCompletionService theoryCompletionService) {
        this.theoryCompletionService = theoryCompletionService;
    }

    @GetMapping
    public List<TheoryCompletion> getAllTheoryCompletions() {
        return theoryCompletionService.findAllTheoryCompletions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TheoryCompletion> getTheoryCompletionById(@PathVariable Long id) {
        return theoryCompletionService.findTheoryCompletionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public TheoryCompletion createTheoryCompletion(@RequestBody TheoryCompletion theoryCompletion) {
        return theoryCompletionService.saveTheoryCompletion(theoryCompletion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TheoryCompletion> updateTheoryCompletion(@PathVariable Long id, @RequestBody TheoryCompletion theoryCompletion) {
        if (theoryCompletionService.findTheoryCompletionById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        theoryCompletion.setId(id);
        return ResponseEntity.ok(theoryCompletionService.updateTheoryCompletion(theoryCompletion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTheoryCompletion(@PathVariable Long id) {
        if (theoryCompletionService.findTheoryCompletionById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        theoryCompletionService.deleteTheoryCompletion(id);
        return ResponseEntity.ok().build();
    }
}