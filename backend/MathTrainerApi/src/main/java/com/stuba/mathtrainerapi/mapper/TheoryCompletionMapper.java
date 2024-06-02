package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.TheoryCompletionDTO;
import com.stuba.mathtrainerapi.entity.TheoryCompletion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TheoryCompletionMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "theory.id", target = "theoryId")
    @Mapping(source = "theory.title", target = "theoryTitle")
    TheoryCompletionDTO toDTO(TheoryCompletion theoryCompletion);

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "theoryId", target = "theory.id")
    TheoryCompletion toEntity(TheoryCompletionDTO dto);
}
