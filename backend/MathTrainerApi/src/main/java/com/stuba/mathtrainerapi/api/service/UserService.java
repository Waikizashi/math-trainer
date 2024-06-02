package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.api.dto.UserDTO;
import com.stuba.mathtrainerapi.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<UserDTO> findAllUsers();
    Optional<UserDTO> findUserById(Long id);
    Optional<UserDTO> findByUsername(String username);
    Optional<UserDTO> findByEmail(String email);
    UserDTO saveUser(UserDTO userDTO);
    UserDTO updateUser(UserDTO userDTO);
    boolean deleteUser(Long id);

    boolean isUserUnique(String username, String email);
}