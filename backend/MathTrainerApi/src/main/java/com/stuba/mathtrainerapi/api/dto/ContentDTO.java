package com.stuba.mathtrainerapi.api.dto;
import lombok.Data;
import java.util.List;

@Data
public class ContentDTO {
    private Long id;
    private String contentType;
    private String title;
    private String data;
    private List<GraphDataDTO> graphData;
    private Long theoryId;
}
