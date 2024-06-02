package com.stuba.mathtrainerapi.api.dto;
import com.stuba.mathtrainerapi.entity.TheoryCompletion;
import lombok.Data;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class TheoryDTO {
    private Long id;
    private String title;
    private List<TheoryContentDTO> theoryContents;
    private Set<TheoryCompletion> completions = new HashSet<>();
}

