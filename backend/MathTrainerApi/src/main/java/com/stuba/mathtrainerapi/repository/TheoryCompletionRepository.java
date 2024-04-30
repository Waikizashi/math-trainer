package com.stuba.mathtrainerapi.repository;

import com.stuba.mathtrainerapi.entity.TheoryCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TheoryCompletionRepository extends JpaRepository<TheoryCompletion, Long> {
}