package com.stuba.mathtrainerapi.api.dto;

import com.stuba.mathtrainerapi.enums.PracticeStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PracticeProgressRequest {
    @NotNull @Positive
    private Long practiceId;
    @NotNull
    private PracticeStatus practiceStatus;
}
