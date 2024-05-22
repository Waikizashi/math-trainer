package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.PossibleEdgeCountDTO;
import com.stuba.mathtrainerapi.entity.PossibleEdgeCount;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PossibleEdgeCountMapper {
    PossibleEdgeCountDTO toDTO(PossibleEdgeCount possibleEdgeCount);
    PossibleEdgeCount toEntity(PossibleEdgeCountDTO possibleEdgeCountDTO);
}
