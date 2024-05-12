package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.api.dto.TheoryDTO;
import com.stuba.mathtrainerapi.entity.Theory;

import java.util.List;
import java.util.Optional;

public interface TheoryService {
    List<TheoryDTO> findAllTheories();
    Optional<TheoryDTO> findTheoryById(Long id);
    TheoryDTO saveTheory(TheoryDTO theoryDTO);
    TheoryDTO updateTheory(TheoryDTO theoryDTO);
    boolean deleteTheory(Long id);
}
