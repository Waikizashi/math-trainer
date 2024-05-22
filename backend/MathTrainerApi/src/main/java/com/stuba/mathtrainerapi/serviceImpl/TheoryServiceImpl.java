package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.dto.TheoryDTO;
import com.stuba.mathtrainerapi.api.service.TheoryService;
import com.stuba.mathtrainerapi.entity.*;
import com.stuba.mathtrainerapi.mapper.TheoryMapper;
import com.stuba.mathtrainerapi.repository.TheoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TheoryServiceImpl implements TheoryService {

    private final TheoryRepository theoryRepository;
    private final TheoryMapper theoryMapper;

    @Autowired
    public TheoryServiceImpl(TheoryRepository theoryRepository, TheoryMapper theoryMapper) {
        this.theoryRepository = theoryRepository;
        this.theoryMapper = theoryMapper;
    }

    @Override
    public List<TheoryDTO> findAllTheories() {
        return theoryRepository.findAll().stream()
                .map(theoryMapper::toTheoryDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TheoryDTO> findTheoryById(Long id) {
        return theoryRepository.findById(id)
                .map(theoryMapper::toTheoryDTO);
    }

    @Override
    @Transactional
    public TheoryDTO saveTheory(TheoryDTO theoryDTO) {
        if (theoryDTO.getId() != null) {
            throw new IllegalArgumentException("New Theory must not have an ID, it will be generated automatically.");
        }
        Theory theory = theoryMapper.toTheory(theoryDTO);
        for (TheoryContent theoryContent : theory.getTheoryContent()) {
            theoryContent.setTheory(theory);
            for (GraphData graphData : theoryContent.getGraphData()) {
                graphData.setTheoryContent(theoryContent);
                for (GraphLink graphLink : graphData.getLinks()) {
                    graphLink.setGraphData(graphData);
                }
                for (GraphNode graphNode : graphData.getNodes()) {
                    graphNode.setGraphData(graphData);
                }
            }
        }
        return theoryMapper.toTheoryDTO(theoryRepository.save(theory));
    }

    @Override
    @Transactional
    public TheoryDTO updateTheory(TheoryDTO theoryDTO) {
        if (theoryDTO.getId() == null) {
            throw new IllegalArgumentException("Cannot update a theory without an ID.");
        }

        Theory existingTheory = theoryRepository.findById(theoryDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Theory with ID " + theoryDTO.getId() + " not found"));

        Theory updatedTheory =  theoryMapper.toTheory(theoryDTO);

        for (TheoryContent theoryContent : updatedTheory.getTheoryContent()) {
            theoryContent.setTheory(updatedTheory);
            for (GraphData graphData : theoryContent.getGraphData()) {
                graphData.setTheoryContent(theoryContent);
                for (GraphLink graphLink : graphData.getLinks()) {
                    graphLink.setGraphData(graphData);
                }
                for (GraphNode graphNode : graphData.getNodes()) {
                    graphNode.setGraphData(graphData);
                }
            }
        }

        return theoryMapper.toTheoryDTO(theoryRepository.save(updatedTheory));
    }


    @Override
    @Transactional
    public boolean deleteTheory(Long id) {
        if(theoryRepository.existsById(id)){
            theoryRepository.deleteById(id);
            return !theoryRepository.existsById(id);
        } else {
            return false;
        }
    }
}



