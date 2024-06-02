package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.dto.PracticeCompletionDTO;
import com.stuba.mathtrainerapi.api.service.PracticeCompletionService;
import com.stuba.mathtrainerapi.entity.PracticeCompletion;
import com.stuba.mathtrainerapi.mapper.PracticeCompletionMapper;
import com.stuba.mathtrainerapi.repository.PracticeCompletionRepository;
import com.stuba.mathtrainerapi.repository.PracticeRepository;
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
public class PracticeCompletionServiceImpl implements PracticeCompletionService {

    private final PracticeCompletionRepository practiceCompletionRepository;
    private final UserRepository userRepository;
    private final PracticeRepository practiceRepository;
    private final PracticeCompletionMapper practiceCompletionMapper;

    @Autowired
    public PracticeCompletionServiceImpl(PracticeCompletionRepository practiceCompletionRepository,
                                         UserRepository userRepository,
                                         PracticeRepository practiceRepository,
                                         PracticeCompletionMapper practiceCompletionMapper) {
        this.practiceCompletionRepository = practiceCompletionRepository;
        this.userRepository = userRepository;
        this.practiceRepository = practiceRepository;
        this.practiceCompletionMapper = practiceCompletionMapper;
    }

    @Override
    public List<PracticeCompletionDTO> findAllPracticeCompletions() {
        List<PracticeCompletion> completions = practiceCompletionRepository.findAll();
        return completions.stream()
                .map(practiceCompletionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PracticeCompletionDTO> findPracticeCompletionById(Long id) {
        Optional<PracticeCompletion> completion = practiceCompletionRepository.findById(id);
        return completion.map(practiceCompletionMapper::toDTO);
    }

    @Override
    @Transactional
    public PracticeCompletionDTO savePracticeCompletion(PracticeCompletionDTO dto) {
        PracticeCompletion practiceCompletion = practiceCompletionMapper.toEntity(dto);
        practiceCompletion.setUser(userRepository.findById(dto.getUserId()).orElseThrow(() -> new UsernameNotFoundException("User not found")));
        practiceCompletion.setPractice(practiceRepository.findById(dto.getPracticeId()).orElseThrow(() -> new ResourceNotFoundException("Practice not found")));
        PracticeCompletion saved = practiceCompletionRepository.save(practiceCompletion);
        return practiceCompletionMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public PracticeCompletionDTO updatePracticeCompletion(PracticeCompletionDTO dto) {
        PracticeCompletion practiceCompletion = practiceCompletionMapper.toEntity(dto);
        practiceCompletion.setUser(userRepository.findById(dto.getUserId()).orElseThrow(() -> new UsernameNotFoundException("User not found")));
        practiceCompletion.setPractice(practiceRepository.findById(dto.getPracticeId()).orElseThrow(() -> new ResourceNotFoundException("Practice not found")));
        PracticeCompletion updated = practiceCompletionRepository.save(practiceCompletion);
        return practiceCompletionMapper.toDTO(updated);
    }

    @Override
    @Transactional
    public boolean deletePracticeCompletion(Long id) {
        if (practiceCompletionRepository.findById(id).isPresent()) {
            practiceCompletionRepository.deleteById(id);
            return practiceCompletionRepository.findById(id).isEmpty();
        } else {
            return false;
        }
    }

    @Override
    public List<PracticeCompletionDTO> findAllPracticeCompletionsByUser(Long userId) {
        List<PracticeCompletion> completions = practiceCompletionRepository.findAllByUserId(userId);
        return completions.stream()
                .map(practiceCompletionMapper::toDTO)
                .collect(Collectors.toList());
    }
}