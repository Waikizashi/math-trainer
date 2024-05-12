package com.stuba.mathtrainerapi.mapper;
import com.stuba.mathtrainerapi.api.dto.TheoryDTO;
import com.stuba.mathtrainerapi.entity.Theory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {ContentMapper.class})
public interface TheoryMapper {

    TheoryDTO toTheoryDTO(Theory theory);
    Theory toTheory(TheoryDTO theoryDTO);
}