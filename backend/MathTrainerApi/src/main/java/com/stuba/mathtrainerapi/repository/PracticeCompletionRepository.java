package com.stuba.mathtrainerapi.repository;

import com.stuba.mathtrainerapi.entity.PracticeCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PracticeCompletionRepository extends JpaRepository<PracticeCompletion, Long> {
}
