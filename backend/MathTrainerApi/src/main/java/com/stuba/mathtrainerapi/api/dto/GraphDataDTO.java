package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class GraphDataDTO {
    private Long id;
    private String title;
    private List<GraphNodeDTO> nodes;
    private List<GraphLinkDTO> links;
    private Long theoryContentId;
}
