package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;

@Data
public class PracticeCompletionDTO {
    private Long id;
    private Long practiceId;
    private Long userId;
    private boolean completed;
}