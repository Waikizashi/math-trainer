package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.service.TheoryService;
import com.stuba.mathtrainerapi.entity.Theory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/theories")
public class TheoryController {

    private final TheoryService theoryService;

    @Autowired
    public TheoryController(TheoryService theoryService) {
        this.theoryService = theoryService;
    }

    @GetMapping
    public List<Theory> getAllTheories() {
        return theoryService.findAllTheories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Theory> getTheoryById(@PathVariable Long id) {
        Optional<Theory> theory = theoryService.findTheoryById(id);
        return theory.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Theory createTheory(@RequestBody Theory theory) {
        return theoryService.saveTheory(theory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Theory> updateTheory(@PathVariable Long id, @RequestBody Theory theory) {
        if (theoryService.findTheoryById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        theory.setId(id);
        return ResponseEntity.ok(theoryService.updateTheory(theory));
    }

    // Удаление теории
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTheory(@PathVariable Long id) {
        if (theoryService.findTheoryById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        theoryService.deleteTheory(id);
        return ResponseEntity.ok().build();
    }
}