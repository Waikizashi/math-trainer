package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.TheoryDTO;
import com.stuba.mathtrainerapi.entity.Theory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {TheoryContentMapper.class})
public interface TheoryMapper {

    TheoryDTO toTheoryDTO(Theory theory);
    Theory toTheory(TheoryDTO theoryDTO);
}