package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.PracticeCompletionDTO;
import com.stuba.mathtrainerapi.entity.PracticeCompletion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PracticeCompletionMapper {
    PracticeCompletionDTO toDTO(PracticeCompletion practiceCompletion);
    PracticeCompletion toEntity(PracticeCompletionDTO practiceCompletionDTO);
}
