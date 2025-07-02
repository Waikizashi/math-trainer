package com.stuba.mathtrainerapi.api.dto;
import lombok.Data;
import java.util.List;

@Data
public class TheoryContentDTO {
    private Long id;
    private String contentType;
    private String title;
    private String data;
    private String mediaLink;
    private List<GraphDataDTO> graphData;
    private Long theoryId;
}
