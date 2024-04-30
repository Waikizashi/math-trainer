package com.stuba.mathtrainerapi.repository;

import com.stuba.mathtrainerapi.entity.Theory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TheoryRepository extends JpaRepository<Theory, Long> {
    // Дополнительные методы запросов, например, поиск по теме
}