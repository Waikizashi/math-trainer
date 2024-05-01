package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.entity.PracticeCompletion;

import java.util.List;
import java.util.Optional;

public interface PracticeCompletionService {
    List<PracticeCompletion> findAllPracticeCompletions();
    Optional<PracticeCompletion> findPracticeCompletionById(Long id);
    PracticeCompletion savePracticeCompletion(PracticeCompletion practiceCompletion);
    PracticeCompletion updatePracticeCompletion(PracticeCompletion practiceCompletion);
    boolean deletePracticeCompletion(Long id);
}