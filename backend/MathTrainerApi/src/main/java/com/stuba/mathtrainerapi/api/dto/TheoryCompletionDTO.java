package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TheoryCompletionDTO {
    private Long id;
    private Long userId;
    private Long theoryId;
    private boolean completed;
    private LocalDate completionDate;
}