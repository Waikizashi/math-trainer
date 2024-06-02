package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.PracticeCompletionDTO;
import com.stuba.mathtrainerapi.entity.PracticeCompletion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PracticeCompletionMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "practice.id", target = "practiceId")
    @Mapping(source = "practice.title", target = "practiceTitle")
    PracticeCompletionDTO toDTO(PracticeCompletion practiceCompletion);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "practiceId", target = "practice.id")
    PracticeCompletion toEntity(PracticeCompletionDTO dto);
}
