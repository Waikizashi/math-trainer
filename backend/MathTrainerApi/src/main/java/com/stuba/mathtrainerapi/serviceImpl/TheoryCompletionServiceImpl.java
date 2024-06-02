package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.dto.TheoryCompletionDTO;
import com.stuba.mathtrainerapi.api.service.TheoryCompletionService;
import com.stuba.mathtrainerapi.entity.TheoryCompletion;
import com.stuba.mathtrainerapi.mapper.TheoryCompletionMapper;
import com.stuba.mathtrainerapi.repository.TheoryCompletionRepository;
import com.stuba.mathtrainerapi.repository.TheoryRepository;
import com.stuba.mathtrainerapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TheoryCompletionServiceImpl implements TheoryCompletionService {

    private final TheoryCompletionRepository theoryCompletionRepository;
    private final UserRepository userRepository;
    private final TheoryRepository theoryRepository;
    private final TheoryCompletionMapper theoryCompletionMapper;

    @Autowired
    public TheoryCompletionServiceImpl(TheoryCompletionRepository theoryCompletionRepository,
                                       UserRepository userRepository,
                                       TheoryRepository theoryRepository,
                                       TheoryCompletionMapper theoryCompletionMapper) {
        this.theoryCompletionRepository = theoryCompletionRepository;
        this.userRepository = userRepository;
        this.theoryRepository = theoryRepository;
        this.theoryCompletionMapper = theoryCompletionMapper;
    }

    @Override
    public List<TheoryCompletionDTO> findAllTheoryCompletions() {
        List<TheoryCompletion> completions = theoryCompletionRepository.findAll();
        return completions.stream()
                .map(theoryCompletionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<TheoryCompletionDTO> findTheoryCompletionById(Long id) {
        Optional<TheoryCompletion> completion = theoryCompletionRepository.findById(id);
        return completion.map(theoryCompletionMapper::toDTO);
    }

    @Override
    @Transactional
    public TheoryCompletionDTO saveTheoryCompletion(TheoryCompletionDTO dto) {
        TheoryCompletion theoryCompletion = theoryCompletionMapper.toEntity(dto);
        theoryCompletion.setUser(userRepository.findById(dto.getUserId()).orElseThrow(() -> new UsernameNotFoundException("User not found")));
        theoryCompletion.setTheory(theoryRepository.findById(dto.getTheoryId()).orElseThrow(() -> new ResourceNotFoundException("Theory not found")));
        TheoryCompletion saved = theoryCompletionRepository.save(theoryCompletion);
        return theoryCompletionMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public TheoryCompletionDTO updateTheoryCompletion(TheoryCompletionDTO dto) {
        TheoryCompletion theoryCompletion = theoryCompletionMapper.toEntity(dto);
        theoryCompletion.setUser(userRepository.findById(dto.getUserId()).orElseThrow(() -> new UsernameNotFoundException("User not found")));
        theoryCompletion.setTheory(theoryRepository.findById(dto.getTheoryId()).orElseThrow(() -> new ResourceNotFoundException("Theory not found")));
        TheoryCompletion updated = theoryCompletionRepository.save(theoryCompletion);
        return theoryCompletionMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public boolean deleteTheoryCompletion(Long id) {
        if (theoryCompletionRepository.findById(id).isPresent()) {
            theoryCompletionRepository.deleteById(id);
            return !theoryCompletionRepository.findById(id).isPresent();
        } else {
            return false;
        }
    }

    @Override
    public List<TheoryCompletionDTO> findAllTheoryCompletionsByUser(Long userId) {
        List<TheoryCompletion> completions = theoryCompletionRepository.findAllByUserId(userId);
        return completions.stream()
                .map(theoryCompletionMapper::toDTO)
                .collect(Collectors.toList());
    }
}