package com.stuba.mathtrainerapi.api.dto;

import com.stuba.mathtrainerapi.enums.PracticeStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PracticeCompletionDTO {
    private Long id;
    private Long userId;
    private Long practiceId;
    private String practiceTitle;
    private PracticeStatus practiceStatus;
    private LocalDate completionDate;
}