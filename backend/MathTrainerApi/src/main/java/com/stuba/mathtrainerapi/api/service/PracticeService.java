package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.api.dto.PracticeDTO;
import com.stuba.mathtrainerapi.entity.Practice;

import java.util.List;
import java.util.Optional;

public interface PracticeService {
    List<PracticeDTO> findAllPractices();
    Optional<PracticeDTO> findPracticeById(Long id);
    PracticeDTO savePractice(PracticeDTO practiceDTO);
    PracticeDTO updatePractice(PracticeDTO practiceDTO);
    boolean deletePractice(Long id);
}
