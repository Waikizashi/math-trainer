package com.stuba.mathtrainerapi.entity;

import com.stuba.mathtrainerapi.enums.PracticeStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "practice_completions")
@Data
public class PracticeCompletion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "practice_id")
    private Practice practice;
    private String practiceTitle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PracticeStatus practiceStatus;
    private LocalDate completionDate;
}