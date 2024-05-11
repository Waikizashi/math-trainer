package com.stuba.mathtrainerapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "contents")
@Data
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = true)
    private String title;

    @Column(nullable = false)
    private String data;

    @ManyToOne
    @JoinColumn(name = "theory_id")
    private Theory theory;

    @ManyToOne
    @JoinColumn(name = "practice_id")
    private Practice practice;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GraphData> graphDataList;
}
