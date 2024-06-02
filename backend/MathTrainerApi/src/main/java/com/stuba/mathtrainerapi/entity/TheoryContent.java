package com.stuba.mathtrainerapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "content")
@Data
public class TheoryContent {
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

    @OneToMany(mappedBy = "theoryContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GraphData> graphData;
    @ManyToOne
    @JoinColumn(name = "theory_id")
    private Theory theory;
}
