package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.dto.*;
import com.stuba.mathtrainerapi.api.service.PracticeCompletionService;
import com.stuba.mathtrainerapi.api.service.TheoryCompletionService;
import com.stuba.mathtrainerapi.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {
    private final TheoryCompletionService theoryCompletionService;
    private final PracticeCompletionService practiceCompletionService;
    private final UserService userService;

    public UserProfileController(TheoryCompletionService theoryCompletionService,
                                 PracticeCompletionService practiceCompletionService, UserService userService) {
        this.theoryCompletionService = theoryCompletionService;
        this.practiceCompletionService = practiceCompletionService;
        this.userService = userService;
    }

    @GetMapping("/theory-completions")
    public ResponseEntity<List<TheoryCompletionDTO>> getTheoryCompletions(Principal principal) {
        return ResponseEntity.ok(theoryCompletionService.findAllTheoryCompletionsByUser(currentUserId(principal)));
    }

    @GetMapping("/practice-completions")
    public ResponseEntity<List<PracticeCompletionDTO>> getPracticeCompletions(Principal principal) {
        return ResponseEntity.ok(practiceCompletionService.findAllPracticeCompletionsByUser(currentUserId(principal)));
    }

    @PostMapping("/theory-completions")
    public ResponseEntity<TheoryCompletionDTO> createTheoryCompletion(@Valid @RequestBody TheoryProgressRequest request, Principal principal) {
        TheoryCompletionDTO dto = theoryProgress(request, principal);
        return theoryCompletionService.findTheoryCompletionByUserAndTheory(dto.getUserId(), dto.getTheoryId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CREATED).body(theoryCompletionService.saveTheoryCompletion(dto)));
    }

    @PostMapping("/practice-completions")
    public ResponseEntity<PracticeCompletionDTO> createPracticeCompletion(@Valid @RequestBody PracticeProgressRequest request, Principal principal) {
        PracticeCompletionDTO dto = practiceProgress(request, principal);
        return practiceCompletionService.findPracticeCompletionByUserAndPractice(dto.getUserId(), dto.getPracticeId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CREATED).body(practiceCompletionService.savePracticeCompletion(dto)));
    }

    @PutMapping("/theory-completions")
    public ResponseEntity<TheoryCompletionDTO> updateTheoryCompletion(@Valid @RequestBody TheoryProgressRequest request, Principal principal) {
        return ResponseEntity.ok(theoryCompletionService.updateTheoryCompletion(theoryProgress(request, principal)));
    }

    @PutMapping("/practice-completions")
    public ResponseEntity<PracticeCompletionDTO> updatePracticeCompletion(@Valid @RequestBody PracticeProgressRequest request, Principal principal) {
        return ResponseEntity.ok(practiceCompletionService.updatePracticeCompletion(practiceProgress(request, principal)));
    }

    private TheoryCompletionDTO theoryProgress(TheoryProgressRequest request, Principal principal) {
        TheoryCompletionDTO dto = new TheoryCompletionDTO();
        dto.setUserId(currentUserId(principal));
        dto.setTheoryId(request.getTheoryId());
        dto.setTheoryStatus(request.getTheoryStatus());
        dto.setCompletionDate(LocalDate.now());
        return dto;
    }

    private PracticeCompletionDTO practiceProgress(PracticeProgressRequest request, Principal principal) {
        PracticeCompletionDTO dto = new PracticeCompletionDTO();
        dto.setUserId(currentUserId(principal));
        dto.setPracticeId(request.getPracticeId());
        dto.setPracticeStatus(request.getPracticeStatus());
        dto.setCompletionDate(LocalDate.now());
        return dto;
    }

    private Long currentUserId(Principal principal) {
        if (principal == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return userService.findByUsername(principal.getName()).map(UserResponse::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}
