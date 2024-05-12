package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.GraphNodeDTO;

import com.stuba.mathtrainerapi.entity.GraphNode;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface GraphNodeMapper {

    GraphNodeDTO toGraphNodeDTO(GraphNode graphNode);
    @Mapping(target = "graphData.id", source = "graphDataId")
    GraphNode toGraphNode(GraphNodeDTO graphNodeDTO);
}

