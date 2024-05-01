package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.entity.TheoryCompletion;

import java.util.List;
import java.util.Optional;

public interface TheoryCompletionService {
    List<TheoryCompletion> findAllTheoryCompletions();
    Optional<TheoryCompletion> findTheoryCompletionById(Long id);
    TheoryCompletion saveTheoryCompletion(TheoryCompletion theoryCompletion);
    TheoryCompletion updateTheoryCompletion(TheoryCompletion theoryCompletion);
    boolean deleteTheoryCompletion(Long id);
}