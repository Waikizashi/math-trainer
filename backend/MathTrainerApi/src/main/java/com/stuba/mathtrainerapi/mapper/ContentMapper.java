package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.ContentDTO;
import com.stuba.mathtrainerapi.entity.Content;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring",uses = {GraphDataMapper.class})
public interface ContentMapper {
    ContentDTO toContentDTO(Content content);
    @Mapping(target = "theory.id", source = "theoryId")
    Content toContent(ContentDTO contentDTO);
}

