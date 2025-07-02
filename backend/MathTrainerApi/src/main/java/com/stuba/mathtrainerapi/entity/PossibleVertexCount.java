package com.stuba.mathtrainerapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "possible_vertex_counts")
@Data
public class PossibleVertexCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer count;

    @ManyToOne
    @JoinColumn(name = "practice_content_id")
    private PracticeContent practiceContent;
}
