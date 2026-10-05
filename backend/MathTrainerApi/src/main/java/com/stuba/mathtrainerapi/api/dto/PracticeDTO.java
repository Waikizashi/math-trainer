package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PracticeDTO {
    private Long id;
    private String title;
    private List<PracticeContentDTO> practiceContents = new ArrayList<>();
}
