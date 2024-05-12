package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;

@Data
public class GraphLinkDTO {
    private Long id;
    private String source;
    private String target;
    private Long graphDataId;
}

