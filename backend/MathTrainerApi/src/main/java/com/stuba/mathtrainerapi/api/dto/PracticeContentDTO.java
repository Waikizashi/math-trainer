package com.stuba.mathtrainerapi.api.dto;

import com.stuba.mathtrainerapi.enums.GraphProperty;
import lombok.Data;

import java.util.List;

@Data
public class PracticeContentDTO {
    private Long id;
    private String contentType;
    private String title;
    private String data;
    private String mediaLink;
    private Long practiceId;
    private List<Integer> possibleVertices;
    private List<Integer> possibleEdges;
    private List<GraphProperty> graphProperties;
}

