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
        dto.setUserId(getUserIdFromPrincipal(principal));
        TheoryCompletionDTO created = theoryCompletionService.saveTheoryCompletion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/practice-completions")
    public ResponseEntity<PracticeCompletionDTO> createPracticeCompletion(@RequestBody PracticeCompletionDTO dto, Principal principal) {
        dto.setUserId(getUserIdFromPrincipal(principal));
        PracticeCompletionDTO created = practiceCompletionService.savePracticeCompletion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    private Long getUserIdFromPrincipal(Principal principal) {
        UserDetails userDetails = (UserDetails) ((Authentication) principal).getPrincipal();
        UserDTO user = userService.findByUsername(userDetails.getUsername()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getId();
    }
}
