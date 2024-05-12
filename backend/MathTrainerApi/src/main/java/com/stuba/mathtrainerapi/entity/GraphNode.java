package com.stuba.mathtrainerapi.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "graph_nodes")
@Data
public class GraphNode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nodeId;

    @Column(name = "node_group", nullable = true)
    private String group;

    @ManyToOne
    @JoinColumn(name = "graph_data_id")
    private GraphData graphData;
}
