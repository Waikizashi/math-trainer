package com.stuba.mathtrainerapi.entity;

import com.stuba.mathtrainerapi.enums.GraphProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "graph_properties")
@Data
public class GraphPropertyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GraphProperty property;

    @ManyToOne
    @JoinColumn(name = "practice_content_id")
    private PracticeContent practiceContent;
}

