package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.TheoryContentDTO;
import com.stuba.mathtrainerapi.entity.TheoryContent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring",uses = {GraphDataMapper.class})
public interface TheoryContentMapper {
    TheoryContentDTO toTheoryContentDTO(TheoryContent theoryContent);
    @Mapping(target = "theory.id", source = "theoryId")
    TheoryContent toTheoryContent(TheoryContentDTO theoryContentDTO);
}

