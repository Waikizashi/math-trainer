package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.service.PracticeService;
import com.stuba.mathtrainerapi.entity.Practice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practices")
public class PracticeController {

    private final PracticeService practiceService;

    @Autowired
    public PracticeController(PracticeService practiceService) {
        this.practiceService = practiceService;
    }

    // Получение всех практик
    @GetMapping
    public List<Practice> getAllPractices() {
        return practiceService.findAllPractices();
    }

    // Получение практики по ID
    @GetMapping("/{id}")
    public ResponseEntity<Practice> getPracticeById(@PathVariable Long id) {
        return practiceService.findPracticeById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Создание новой практики
    @PostMapping
    public Practice createPractice(@RequestBody Practice practice) {
        return practiceService.savePractice(practice);
    }

    // Обновление существующей практики
    @PutMapping("/{id}")
    public ResponseEntity<Practice> updatePractice(@PathVariable Long id, @RequestBody Practice practice) {
        if (practiceService.findPracticeById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        practice.setId(id);
        return ResponseEntity.ok(practiceService.updatePractice(practice));
    }

    // Удаление практики
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePractice(@PathVariable Long id) {
        if (practiceService.findPracticeById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        practiceService.deletePractice(id);
        return ResponseEntity.ok().build();
    }
}