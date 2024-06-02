package com.stuba.mathtrainerapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "graph_data")
@Data
public class GraphData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private Boolean oriented;
    @ManyToOne
    @JoinColumn(name = "theoryContent_id")
    private TheoryContent theoryContent;
    @OneToMany(mappedBy = "graphData", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GraphNode> nodes;

    @OneToMany(mappedBy = "graphData", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GraphLink> links;
}

