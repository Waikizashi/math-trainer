package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.api.dto.PracticeCompletionDTO;

import java.util.List;
import java.util.Optional;

public interface PracticeCompletionService {
    List<PracticeCompletionDTO> findAllPracticeCompletions();
    Optional<PracticeCompletionDTO> findPracticeCompletionById(Long id);
    PracticeCompletionDTO savePracticeCompletion(PracticeCompletionDTO practiceCompletionDTO);
    PracticeCompletionDTO updatePracticeCompletion(PracticeCompletionDTO practiceCompletionDTO);
    boolean deletePracticeCompletion(Long id);
    List<PracticeCompletionDTO> findAllPracticeCompletionsByUser(Long userId);
}