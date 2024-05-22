package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.dto.PracticeDTO;
import com.stuba.mathtrainerapi.api.service.PracticeService;
import com.stuba.mathtrainerapi.entity.*;
import com.stuba.mathtrainerapi.mapper.PracticeMapper;
import com.stuba.mathtrainerapi.repository.PracticeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PracticeServiceImpl implements PracticeService {

    private final PracticeRepository practiceRepository;
    private final PracticeMapper practiceMapper;

    @Autowired
    public PracticeServiceImpl(PracticeRepository practiceRepository, PracticeMapper practiceMapper) {
        this.practiceRepository = practiceRepository;
        this.practiceMapper = practiceMapper;
    }

    @Override
    public List<PracticeDTO> findAllPractices() {
        return practiceRepository.findAll().stream()
                .map(practiceMapper::toPracticeDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PracticeDTO> findPracticeById(Long id) {
        return practiceRepository.findById(id)
                .map(practiceMapper::toPracticeDTO);
    }

    @Override
    @Transactional
    public PracticeDTO savePractice(PracticeDTO practiceDTO) {
        if (practiceDTO.getId() != null) {
            throw new IllegalArgumentException("New Practice must not have an ID, it will be generated automatically.");
        }
        Practice practice = practiceMapper.toPractice(practiceDTO);
        for (PracticeContent practiceContent : practice.getPracticeContents()) {
            practiceContent.setPractice(practice);
            for (PossibleVertexCount vertexCount : practiceContent.getPossibleVertices()) {
                vertexCount.setPracticeContent(practiceContent);
            }
            for (PossibleEdgeCount edgeCount : practiceContent.getPossibleEdges()) {
                edgeCount.setPracticeContent(practiceContent);
            }
            for (GraphPropertyEntity graphProperty : practiceContent.getGraphProperties()) {
                graphProperty.setPracticeContent(practiceContent);
            }
        }
        return practiceMapper.toPracticeDTO(practiceRepository.save(practice));
    }

    @Override
    @Transactional
    public PracticeDTO updatePractice(PracticeDTO practiceDTO) {
        if (practiceDTO.getId() == null) {
            throw new IllegalArgumentException("Cannot update a practice without an ID.");
        }

        Practice existingPractice = practiceRepository.findById(practiceDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Practice with ID " + practiceDTO.getId() + " not found"));

        Practice updatedPractice = practiceMapper.toPractice(practiceDTO);

        for (PracticeContent practiceContent : updatedPractice.getPracticeContents()) {
            practiceContent.setPractice(updatedPractice);
            for (PossibleVertexCount vertexCount : practiceContent.getPossibleVertices()) {
                vertexCount.setPracticeContent(practiceContent);
            }
            for (PossibleEdgeCount edgeCount : practiceContent.getPossibleEdges()) {
                edgeCount.setPracticeContent(practiceContent);
            }
            for (GraphPropertyEntity graphProperty : practiceContent.getGraphProperties()) {
                graphProperty.setPracticeContent(practiceContent);
            }
        }

        return practiceMapper.toPracticeDTO(practiceRepository.save(updatedPractice));
    }

    @Override
    @Transactional
    public boolean deletePractice(Long id) {
        if (practiceRepository.existsById(id)) {
            practiceRepository.deleteById(id);
            return !practiceRepository.existsById(id);
        } else {
            return false;
        }
    }
}
