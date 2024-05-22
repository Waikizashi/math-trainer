package com.stuba.mathtrainerapi.api.dto;

import com.stuba.mathtrainerapi.entity.PracticeCompletion;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class PracticeDTO {
    private Long id;
    private String title;
    private List<PracticeContentDTO> practiceContents = new ArrayList<>();
    private Set<PracticeCompletion> completions = new HashSet<>();
}
