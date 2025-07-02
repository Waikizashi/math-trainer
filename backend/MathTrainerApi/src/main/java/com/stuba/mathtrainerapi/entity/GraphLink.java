package com.stuba.mathtrainerapi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "graph_links")
@Data
public class GraphLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String linkId;
    private String weight;
    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String target;

    @ManyToOne
    @JoinColumn(name = "graph_data_id")
    private GraphData graphData;
}
