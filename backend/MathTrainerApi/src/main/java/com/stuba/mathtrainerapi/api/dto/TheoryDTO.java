package com.stuba.mathtrainerapi.api.dto;
import lombok.Data;
import java.util.List;

@Data
public class TheoryDTO {
    private Long id;
    private String title;
    private List<TheoryContentDTO> content;
}

