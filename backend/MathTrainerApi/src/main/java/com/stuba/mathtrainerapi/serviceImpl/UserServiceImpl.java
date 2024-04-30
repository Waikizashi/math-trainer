package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.service.UserService;
import com.stuba.mathtrainerapi.entity.User;
import com.stuba.mathtrainerapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    @Transactional
    public User saveUser(User user) {
        if(this.isUserUnique(user.getUsername())){
        return userRepository.save(user);
        } else{
            throw new RuntimeException("User with this USERNAME already exist");
        }
    }
    @Override
    @Transactional
    public User updateUser(User user) {
        if(userRepository.findById(user.getId()).isPresent()){
            userRepository.deleteById(user.getId());
            return userRepository.save(user);
        } else {
            throw new RuntimeException("Updating error");
        }
    }

    @Override
    @Transactional
    public boolean deleteUser(Long id) {
        if(userRepository.findById(id).isPresent()){
            userRepository.deleteById(id);
            if (userRepository.findById(id).isPresent()){
                return true;
            } else {
                throw new RuntimeException("Deleting error");
            }
        } else{
            return false;
        }
    }

    @Override
    public boolean isUserUnique(String username) {
        return userRepository.findByUsername(username).isEmpty();
    }
}