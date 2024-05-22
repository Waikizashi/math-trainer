package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.PossibleVertexCountDTO;
import com.stuba.mathtrainerapi.entity.PossibleVertexCount;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PossibleVertexCountMapper {
    PossibleVertexCountDTO toDTO(PossibleVertexCount possibleVertexCount);
    PossibleVertexCount toEntity(PossibleVertexCountDTO possibleVertexCountDTO);
}
