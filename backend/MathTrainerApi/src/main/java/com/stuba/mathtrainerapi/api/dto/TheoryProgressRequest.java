package com.stuba.mathtrainerapi.api.dto;

import com.stuba.mathtrainerapi.enums.TheoryStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TheoryProgressRequest {
    @NotNull @Positive
    private Long theoryId;
    @NotNull
    private TheoryStatus theoryStatus;
}
