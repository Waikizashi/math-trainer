package com.stuba.mathtrainerapi.repository;

import com.stuba.mathtrainerapi.entity.Practice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PracticeRepository extends JpaRepository<Practice, Long> {
}