package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> findAllUsers();

    Optional<User> findUserById(Long id);

    User saveUser(User user);
    User updateUser(User user);

    boolean deleteUser(Long id);

    boolean isUserUnique(String username);
}