package com.stuba.mathtrainerapi.api.dto;

import com.stuba.mathtrainerapi.enums.GraphProperty;
import lombok.Data;

@Data
public class GraphPropertyDTO {
    private Long id;
    private GraphProperty property;
}

