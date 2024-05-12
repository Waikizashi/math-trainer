package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.GraphLinkDTO;
import com.stuba.mathtrainerapi.entity.GraphLink;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface GraphLinkMapper {

    GraphLinkDTO toGraphLinkDTO(GraphLink graphLink);
    @Mapping(target = "graphData.id", source = "graphDataId")
    GraphLink toGraphLink(GraphLinkDTO graphLinkDTO);
}

