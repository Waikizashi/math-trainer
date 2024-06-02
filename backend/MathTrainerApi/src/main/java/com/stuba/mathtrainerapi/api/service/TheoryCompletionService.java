package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.api.dto.TheoryCompletionDTO;
import com.stuba.mathtrainerapi.entity.TheoryCompletion;

import java.util.List;
import java.util.Optional;

public interface TheoryCompletionService {
    List<TheoryCompletionDTO> findAllTheoryCompletions();
    Optional<TheoryCompletionDTO> findTheoryCompletionById(Long id);
    TheoryCompletionDTO saveTheoryCompletion(TheoryCompletionDTO theoryCompletionDTO);
    TheoryCompletionDTO updateTheoryCompletion(TheoryCompletionDTO theoryCompletionDTO);
    boolean deleteTheoryCompletion(Long id);
    List<TheoryCompletionDTO> findAllTheoryCompletionsByUser(Long userId);
}