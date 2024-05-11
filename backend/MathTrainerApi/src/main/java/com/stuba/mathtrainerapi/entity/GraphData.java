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
    @ManyToOne
    @JoinColumn(name = "content_id")
    private Content content;
    @OneToMany(mappedBy = "graphData", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GraphNode> nodes;

    @OneToMany(mappedBy = "graphData", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GraphLink> links;
}

@Entity
@Table(name = "graph_nodes")
@Data
class GraphNode {
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

@Entity
@Table(name = "graph_links")
@Data
class GraphLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String target;

    @ManyToOne
    @JoinColumn(name = "graph_data_id")
    private GraphData graphData;
}
