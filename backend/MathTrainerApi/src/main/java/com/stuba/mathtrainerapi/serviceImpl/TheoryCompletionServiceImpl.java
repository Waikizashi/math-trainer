package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.service.TheoryCompletionService;
import com.stuba.mathtrainerapi.entity.TheoryCompletion;
import com.stuba.mathtrainerapi.repository.TheoryCompletionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TheoryCompletionServiceImpl implements TheoryCompletionService {

    private final TheoryCompletionRepository theoryCompletionRepository;

    @Autowired
    public TheoryCompletionServiceImpl(TheoryCompletionRepository theoryCompletionRepository) {
        this.theoryCompletionRepository = theoryCompletionRepository;
    }

    @Override
    public List<TheoryCompletion> findAllTheoryCompletions() {
        return theoryCompletionRepository.findAll();
    }

    @Override
    public Optional<TheoryCompletion> findTheoryCompletionById(Long id) {
        return theoryCompletionRepository.findById(id);
    }

    @Override
    @Transactional
    public TheoryCompletion saveTheoryCompletion(TheoryCompletion theoryCompletion) {
        return theoryCompletionRepository.save(theoryCompletion);
    }

    @Override
    @Transactional
    public TheoryCompletion updateTheoryCompletion(TheoryCompletion theoryCompletion) {
        return theoryCompletionRepository.save(theoryCompletion);
    }

    @Override
    @Transactional
    public boolean deleteTheoryCompletion(Long id) {
        if(theoryCompletionRepository.findById(id).isPresent()){
            theoryCompletionRepository.deleteById(id);
            if (theoryCompletionRepository.findById(id).isPresent()){
                return true;
            } else {
                throw new RuntimeException("Deleting error");
            }
        } else{
            return false;
        }
    }
}