package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.entity.Theory;

import java.util.List;
import java.util.Optional;

public interface TheoryService {
    List<Theory> findAllTheories();
    Optional<Theory> findTheoryById(Long id);
    Theory updateTheory(Theory theory);
    boolean deleteTheory(Long id);

    Theory saveTheory(Theory theory);
}