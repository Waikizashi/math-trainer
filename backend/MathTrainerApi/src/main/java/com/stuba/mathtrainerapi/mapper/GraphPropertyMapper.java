package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.GraphPropertyDTO;
import com.stuba.mathtrainerapi.entity.GraphPropertyEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GraphPropertyMapper {
    GraphPropertyDTO toDTO(GraphPropertyEntity graphPropertyEntity);
    GraphPropertyEntity toEntity(GraphPropertyDTO graphPropertyDTO);
}

