package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.entity.Practice;

import java.util.List;
import java.util.Optional;

public interface PracticeService {
    List<Practice> findAllPractices();
    Optional<Practice> findPracticeById(Long id);
    Practice savePractice(Practice practice);
    Practice updatePractice(Practice practice);
    boolean deletePractice(Long id);
}
