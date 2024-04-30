package com.stuba.mathtrainerapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "theories")
@Data
public class Theory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @OneToMany(mappedBy = "theory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Content> contents;

    @OneToMany(mappedBy = "theory", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TheoryCompletion> completions = new HashSet<>();
}