package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.service.TheoryService;
import com.stuba.mathtrainerapi.entity.Theory;
import com.stuba.mathtrainerapi.repository.TheoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TheoryServiceImpl implements TheoryService {

    private final TheoryRepository theoryRepository;

    @Autowired
    public TheoryServiceImpl(TheoryRepository theoryRepository) {
        this.theoryRepository = theoryRepository;
    }

    @Override
    public List<Theory> findAllTheories() {
        return theoryRepository.findAll();
    }

    @Override
    public Optional<Theory> findTheoryById(Long id) {
        return theoryRepository.findById(id);
    }

    @Override
    @Transactional
    public Theory saveTheory(Theory theory) {
        if (theory.getId() != null) {
            throw new IllegalArgumentException("New Theory must not have an ID, it will be generated automatically.");
        }
        return theoryRepository.save(theory);
    }

    @Override
    @Transactional
    public Theory updateTheory(Theory theory) {
        if (theory.getId() == null) {
            throw new IllegalArgumentException("Cannot update a theory without an ID.");
        }
        return theoryRepository.save(theory);
    }

    @Override
    @Transactional
    public boolean deleteTheory(Long id) {
        if(theoryRepository.findById(id).isPresent()){
            theoryRepository.deleteById(id);
            if (theoryRepository.findById(id).isPresent()){
                return true;
            } else {
                throw new RuntimeException("Deleting error");
            }
        } else{
            return false;
        }
    }
}


