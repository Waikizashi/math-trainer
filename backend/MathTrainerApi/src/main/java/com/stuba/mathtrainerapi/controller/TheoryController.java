package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.dto.TheoryDTO;
import com.stuba.mathtrainerapi.api.service.TheoryService;
import com.stuba.mathtrainerapi.mapper.TheoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/theories")
public class TheoryController {

    private final TheoryService theoryService;
    private final TheoryMapper theoryMapper;

    @Autowired
    public TheoryController(TheoryService theoryService, TheoryMapper theoryMapper) {
        this.theoryMapper = theoryMapper;
        this.theoryService = theoryService;
    }

    @GetMapping
    public List<TheoryDTO> getAllTheories() {
        return theoryService.findAllTheories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TheoryDTO> getTheoryById(@PathVariable Long id) {
        return theoryService.findTheoryById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TheoryDTO> createTheory(@RequestBody TheoryDTO theoryDTO) {
        TheoryDTO createdTheory = theoryService.saveTheory(theoryDTO);
        return ResponseEntity.ok(createdTheory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TheoryDTO> updateTheory(@PathVariable Long id, @RequestBody TheoryDTO theoryDTO) {
        if (theoryService.findTheoryById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        theoryDTO.setId(id);
        TheoryDTO updatedTheory = theoryService.updateTheory(theoryDTO);
        return ResponseEntity.ok(updatedTheory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTheory(@PathVariable Long id) {
        if (!theoryService.deleteTheory(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
