package com.stuba.mathtrainerapi.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "possible_edge_counts")
@Data
public class PossibleEdgeCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer count;

    @ManyToOne
    @JoinColumn(name = "practice_content_id")
    private PracticeContent practiceContent;
}
