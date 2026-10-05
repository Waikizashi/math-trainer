package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.TheoryDTO;
import com.stuba.mathtrainerapi.entity.Theory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {TheoryContentMapper.class})
public interface TheoryMapper {
    @Mapping(source = "theoryContents", target = "theoryContents")
    TheoryDTO toTheoryDTO(Theory theory);
    @Mapping(source = "theoryContents", target = "theoryContents")
    @Mapping(target = "completions", ignore = true)
    Theory toTheory(TheoryDTO theoryDTO);
}