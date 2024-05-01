package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.service.PracticeCompletionService;
import com.stuba.mathtrainerapi.entity.PracticeCompletion;
import com.stuba.mathtrainerapi.repository.PracticeCompletionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PracticeCompletionServiceImpl implements PracticeCompletionService {

    private final PracticeCompletionRepository practiceCompletionRepository;

    @Autowired
    public PracticeCompletionServiceImpl(PracticeCompletionRepository practiceCompletionRepository) {
        this.practiceCompletionRepository = practiceCompletionRepository;
    }

    @Override
    public List<PracticeCompletion> findAllPracticeCompletions() {
        return practiceCompletionRepository.findAll();
    }

    @Override
    public Optional<PracticeCompletion> findPracticeCompletionById(Long id) {
        return practiceCompletionRepository.findById(id);
    }

    @Override
    @Transactional
    public PracticeCompletion savePracticeCompletion(PracticeCompletion practiceCompletion) {
        return practiceCompletionRepository.save(practiceCompletion);
    }

    @Override
    @Transactional
    public PracticeCompletion updatePracticeCompletion(PracticeCompletion practiceCompletion) {
        return practiceCompletionRepository.save(practiceCompletion);
    }

    @Override
    @Transactional
    public boolean deletePracticeCompletion(Long id) {
        if(practiceCompletionRepository.findById(id).isPresent()){
            practiceCompletionRepository.deleteById(id);
            if (practiceCompletionRepository.findById(id).isPresent()){
                return true;
            } else {
                throw new RuntimeException("Deleting error");
            }
        } else{
            return false;
        }
    }
}