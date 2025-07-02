package com.stuba.mathtrainerapi.repository;

import com.stuba.mathtrainerapi.entity.PracticeCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PracticeCompletionRepository extends JpaRepository<PracticeCompletion, Long> {
    List<PracticeCompletion> findAllByUserId(Long userId);
    Optional<PracticeCompletion> findByUserIdAndPracticeId(Long userId, Long practiceId);
}

