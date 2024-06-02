package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.TheoryContentDTO;
import com.stuba.mathtrainerapi.entity.TheoryContent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring",uses = {GraphDataMapper.class})
public interface TheoryContentMapper {
    @Mapping(source = "theory.id", target = "theoryId")
    TheoryContentDTO toTheoryContentDTO(TheoryContent theoryContent);
    @Mapping(source = "theoryId", target = "theory.id")
    TheoryContent toTheoryContent(TheoryContentDTO theoryContentDTO);
}

