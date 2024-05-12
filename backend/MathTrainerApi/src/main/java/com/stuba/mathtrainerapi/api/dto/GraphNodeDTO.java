package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;

@Data
public class GraphNodeDTO {
    private Long id;
    private String nodeId;
    private String group;
    private Long graphDataId;
}
