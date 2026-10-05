package com.stuba.mathtrainerapi.api.service;

import com.stuba.mathtrainerapi.api.dto.RegisterRequest;
import com.stuba.mathtrainerapi.api.dto.UserResponse;
import com.stuba.mathtrainerapi.api.dto.UserUpdateRequest;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserResponse> findAllUsers();
    Optional<UserResponse> findUserById(Long id);
    Optional<UserResponse> findByUsername(String username);
    Optional<UserResponse> findByEmail(String email);
    UserResponse registerUser(RegisterRequest request);
    UserResponse updateUser(Long id, UserUpdateRequest request);
    boolean deleteUser(Long id);
    boolean isUserUnique(String username, String email);
}
