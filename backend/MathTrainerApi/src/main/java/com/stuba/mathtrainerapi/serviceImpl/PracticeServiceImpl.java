package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.service.PracticeService;
import com.stuba.mathtrainerapi.entity.Practice;
import com.stuba.mathtrainerapi.repository.PracticeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PracticeServiceImpl implements PracticeService {

    private final PracticeRepository practiceRepository;

    @Autowired
    public PracticeServiceImpl(PracticeRepository practiceRepository) {
        this.practiceRepository = practiceRepository;
    }

    @Override
    public List<Practice> findAllPractices() {
        return practiceRepository.findAll();
    }

    @Override
    public Optional<Practice> findPracticeById(Long id) {
        return practiceRepository.findById(id);
    }

    @Override
    @Transactional
    public Practice savePractice(Practice practice) {
        return practiceRepository.save(practice);
    }

    @Override
    @Transactional
    public Practice updatePractice(Practice practice) {
        return practiceRepository.save(practice);
    }

    @Override
    @Transactional
    public boolean deletePractice(Long id) {
        if(practiceRepository.findById(id).isPresent()){
            practiceRepository.deleteById(id);
            if (practiceRepository.findById(id).isPresent()){
                return true;
            } else {
                throw new RuntimeException("Deleting error");
            }
        } else{
            return false;
        }
    }
}
