package com.stuba.mathtrainerapi.serviceImpl;

import com.stuba.mathtrainerapi.api.dto.UserDTO;
import com.stuba.mathtrainerapi.api.service.UserService;
import com.stuba.mathtrainerapi.entity.User;
import com.stuba.mathtrainerapi.mapper.UserMapper;
import com.stuba.mathtrainerapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<UserDTO> findUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toUserDTO);
    }

    @Override
    public Optional<UserDTO> findByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toUserDTO);
    }

    @Override
    public Optional<UserDTO> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toUserDTO);
    }

    @Override
    @Transactional
    public UserDTO saveUser(UserDTO userDTO) {
        if (userDTO.getId() != null) {
            throw new IllegalArgumentException("New User must not have an ID, it will be generated automatically.");
        }
        User user = userMapper.toUser(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.toUserDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDTO updateUser(UserDTO userDTO) {
        if (userDTO.getId() == null) {
            throw new IllegalArgumentException("Cannot update a user without an ID.");
        }

        User existingUser = userRepository.findById(userDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userDTO.getId() + " not found"));

        User updatedUser = userMapper.toUser(userDTO);
        updatedUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        return userMapper.toUserDTO(userRepository.save(updatedUser));
    }

    @Override
    @Transactional
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return !userRepository.existsById(id);
        } else {
            return false;
        }
    }

    @Override
    public boolean isUserUnique(String username) {
        return true;
    }
}