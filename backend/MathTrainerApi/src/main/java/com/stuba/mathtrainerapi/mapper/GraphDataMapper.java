package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.GraphDataDTO;
import com.stuba.mathtrainerapi.entity.GraphData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {GraphNodeMapper.class, GraphLinkMapper.class})
public interface GraphDataMapper {
    GraphDataDTO toGraphDataDTO(GraphData graphData);
    @Mapping(target = "theoryContent.id", source = "theoryContentId")
    GraphData toGraphData(GraphDataDTO graphDataDTO);
}

