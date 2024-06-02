package com.stuba.mathtrainerapi.api.dto;

import com.stuba.mathtrainerapi.enums.TheoryStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TheoryCompletionDTO {
    private Long id;
    private Long userId;
    private Long theoryId;

    private String theoryTitle;
    private TheoryStatus theoryStatus;
    private LocalDate completionDate;
}