package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.dto.PracticeCompletionDTO;
import com.stuba.mathtrainerapi.api.dto.TheoryCompletionDTO;
import com.stuba.mathtrainerapi.api.dto.UserDTO;
import com.stuba.mathtrainerapi.api.service.PracticeCompletionService;
import com.stuba.mathtrainerapi.api.service.TheoryCompletionService;
import com.stuba.mathtrainerapi.api.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {

    private final TheoryCompletionService theoryCompletionService;

    private final PracticeCompletionService practiceCompletionService;

    private final UserService userService;

    public UserProfileController(TheoryCompletionService theoryCompletionService, PracticeCompletionService practiceCompletionService, UserService userService) {
        this.theoryCompletionService = theoryCompletionService;
        this.practiceCompletionService = practiceCompletionService;
        this.userService = userService;
    }

    @GetMapping("/theory-completions")
    public ResponseEntity<List<TheoryCompletionDTO>> getTheoryCompletions(Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        List<TheoryCompletionDTO> completions = theoryCompletionService.findAllTheoryCompletionsByUser(userId);
        return ResponseEntity.ok(completions);
    }

    @GetMapping("/practice-completions")
    public ResponseEntity<List<PracticeCompletionDTO>> getPracticeCompletions(Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        List<PracticeCompletionDTO> completions = practiceCompletionService.findAllPracticeCompletionsByUser(userId);
        return ResponseEntity.ok(completions);
    }

    @PostMapping("/theory-completions")
    public ResponseEntity<TheoryCompletionDTO> createTheoryCompletion(@RequestBody TheoryCompletionDTO dto, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        if (!dto.getUserId().equals(userId)){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        Optional<TheoryCompletionDTO> existingCompletion = theoryCompletionService.findTheoryCompletionByUserAndTheory(userId, dto.getTheoryId());
        if (existingCompletion.isPresent()) {
            return ResponseEntity.ok(existingCompletion.get());
        }
        TheoryCompletionDTO created = theoryCompletionService.saveTheoryCompletion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/practice-completions")
    public ResponseEntity<PracticeCompletionDTO> createPracticeCompletion(@RequestBody PracticeCompletionDTO dto, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        if (!dto.getUserId().equals(userId)){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        Optional<PracticeCompletionDTO> existingCompletion = practiceCompletionService.findPracticeCompletionByUserAndPractice(userId, dto.getPracticeId());
        if (existingCompletion.isPresent()) {
            return ResponseEntity.ok(existingCompletion.get());
        }
        PracticeCompletionDTO created = practiceCompletionService.savePracticeCompletion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    @PutMapping("/theory-completions")
    public ResponseEntity<TheoryCompletionDTO> updateTheoryCompletion(@RequestBody TheoryCompletionDTO dto, Principal principal) {
        if (!dto.getUserId().equals(getUserIdFromPrincipal(principal))){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        TheoryCompletionDTO updated = theoryCompletionService.updateTheoryCompletion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
    }

    @PutMapping("/practice-completions")
    public ResponseEntity<PracticeCompletionDTO> updatePracticeCompletion(@RequestBody PracticeCompletionDTO dto, Principal principal) {
        if (!dto.getUserId().equals(getUserIdFromPrincipal(principal))){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
        PracticeCompletionDTO updated = practiceCompletionService.updatePracticeCompletion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
    }
    @PutMapping("/saves")
    public ResponseEntity<UserDTO> updateSaves(@RequestBody UserDTO dto, Principal principal) {
//        if (!dto.getId().equals(getUserIdFromPrincipal(principal))){
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
//        }
//        UserDTO updated = userService.updateSaves(dto);
//        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
        return null;
    }

    private Long getUserIdFromPrincipal(Principal principal) {
        UserDetails userDetails = (UserDetails) ((Authentication) principal).getPrincipal();
        UserDTO user = userService.findByUsername(userDetails.getUsername()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getId();
    }
}
