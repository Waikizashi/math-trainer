package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.TheoryCompletionDTO;
import com.stuba.mathtrainerapi.entity.TheoryCompletion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TheoryCompletionMapper {
    TheoryCompletionDTO toDTO(TheoryCompletion theoryCompletion);
    TheoryCompletion toEntity(TheoryCompletionDTO theoryCompletionDTO);
}
