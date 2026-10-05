package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.PracticeDTO;
import com.stuba.mathtrainerapi.entity.Practice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PracticeContentMapper.class})
public interface PracticeMapper {
    @Mapping(source = "practiceContents", target = "practiceContents")
    PracticeDTO toPracticeDTO(Practice practice);
    @Mapping(source = "practiceContents", target = "practiceContents")
    @Mapping(target = "completions", ignore = true)
    Practice toPractice(PracticeDTO practiceDTO);
}
