package com.stuba.mathtrainerapi.entity;

import com.stuba.mathtrainerapi.enums.PracticeStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(
        name = "practice_completions",
        uniqueConstraints = @UniqueConstraint(name = "uq_user_practice", columnNames = {"user_id", "practice_id"})
)
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