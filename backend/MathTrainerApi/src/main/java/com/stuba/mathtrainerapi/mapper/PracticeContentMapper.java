package com.stuba.mathtrainerapi.mapper;

import com.stuba.mathtrainerapi.api.dto.PracticeContentDTO;
import com.stuba.mathtrainerapi.api.dto.TheoryContentDTO;
import com.stuba.mathtrainerapi.entity.*;
import com.stuba.mathtrainerapi.enums.GraphProperty;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {PracticeMapper.class, PossibleVertexCountMapper.class, PossibleEdgeCountMapper.class, GraphPropertyMapper.class})
public interface PracticeContentMapper {

    @Mapping(source = "practice.id", target = "practiceId")
    @Mapping(source = "possibleVertices", target = "possibleVertices", qualifiedByName = "vertexToInteger")
    @Mapping(source = "possibleEdges", target = "possibleEdges", qualifiedByName = "edgeToInteger")
    @Mapping(source = "graphProperties", target = "graphProperties", qualifiedByName = "entityToEnum")
    PracticeContentDTO toPracticeContentDTO(PracticeContent practiceContent);

    @Mapping(source = "practiceId", target = "practice.id")
    @Mapping(source = "possibleVertices", target = "possibleVertices", qualifiedByName = "integerToVertex")
    @Mapping(source = "possibleEdges", target = "possibleEdges", qualifiedByName = "integerToEdge")
    @Mapping(source = "graphProperties", target = "graphProperties", qualifiedByName = "enumToEntity")
    PracticeContent toPracticeContent(PracticeContentDTO practiceContentDTO);

    @Named("vertexToInteger")
    static List<Integer> vertexToInteger(List<PossibleVertexCount> vertices) {
        return vertices.stream().map(PossibleVertexCount::getCount).collect(Collectors.toList());
    }

    @Named("integerToVertex")
    static List<PossibleVertexCount> integerToVertex(List<Integer> vertices) {
        return vertices.stream().map(v -> {
            PossibleVertexCount pv = new PossibleVertexCount();
            pv.setCount(v);
            return pv;
        }).collect(Collectors.toList());
    }

    @Named("edgeToInteger")
    static List<Integer> edgeToInteger(List<PossibleEdgeCount> edges) {
        return edges.stream().map(PossibleEdgeCount::getCount).collect(Collectors.toList());
    }

    @Named("integerToEdge")
    static List<PossibleEdgeCount> integerToEdge(List<Integer> edges) {
        return edges.stream().map(e -> {
            PossibleEdgeCount pe = new PossibleEdgeCount();
            pe.setCount(e);
            return pe;
        }).collect(Collectors.toList());
    }

    @Named("entityToEnum")
    static List<GraphProperty> entityToEnum(List<GraphPropertyEntity> entities) {
        return entities.stream().map(GraphPropertyEntity::getProperty).collect(Collectors.toList());
    }

    @Named("enumToEntity")
    static List<GraphPropertyEntity> enumToEntity(List<GraphProperty> enums) {
        return enums.stream().map(e -> {
            GraphPropertyEntity entity = new GraphPropertyEntity();
            entity.setProperty(e);
            return entity;
        }).collect(Collectors.toList());
    }
}

