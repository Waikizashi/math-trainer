package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.PracticeDTO;
import com.stuba.mathtrainerapi.entity.Practice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PracticeContentMapper.class, PracticeCompletionMapper.class})
public interface PracticeMapper {
    @Mapping(source = "practiceContents", target = "practiceContents")
    @Mapping(source = "completions", target = "completions")
    PracticeDTO toPracticeDTO(Practice practice);
    @Mapping(source = "practiceContents", target = "practiceContents")
    @Mapping(source = "completions", target = "completions")
    Practice toPractice(PracticeDTO practiceDTO);
}
