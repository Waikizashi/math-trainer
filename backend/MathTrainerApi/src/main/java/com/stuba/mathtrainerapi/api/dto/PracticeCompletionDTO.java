package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PracticeCompletionDTO {
    private Long id;
    private Long userId;
    private Long practiceId;
    private boolean completed;
    private LocalDate completionDate;
}