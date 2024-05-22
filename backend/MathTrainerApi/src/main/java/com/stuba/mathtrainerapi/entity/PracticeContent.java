package com.stuba.mathtrainerapi.entity;

import com.stuba.mathtrainerapi.enums.GraphProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "practice_content")
@Data
public class PracticeContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String contentType;

    @Column
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String data;

    @Column(columnDefinition = "TEXT")
    private String mediaLink;

    @ManyToOne
    @JoinColumn(name = "practice_id")
    private Practice practice;

    @OneToMany(mappedBy = "practiceContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PossibleVertexCount> possibleVertices = new ArrayList<>();

    @OneToMany(mappedBy = "practiceContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PossibleEdgeCount> possibleEdges = new ArrayList<>();

    @OneToMany(mappedBy = "practiceContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GraphPropertyEntity> graphProperties = new ArrayList<>();
}

