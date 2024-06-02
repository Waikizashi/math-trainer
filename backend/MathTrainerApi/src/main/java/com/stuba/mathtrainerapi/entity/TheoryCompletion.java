package com.stuba.mathtrainerapi.entity;

import com.stuba.mathtrainerapi.enums.TheoryStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "theory_completions")
@Data
public class TheoryCompletion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "theory_id")
    private Theory theory;
    private String theoryTitle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TheoryStatus theoryStatus;
    private LocalDate completionDate;
}