package com.stuba.mathtrainerapi.controller;

import com.stuba.mathtrainerapi.api.dto.UserDTO;
import com.stuba.mathtrainerapi.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody UserDTO userDTO) {
        System.out.println(userDTO);
        if (userService.isUserUnique(userDTO.getUsername(), userDTO.getEmail())) {
            UserDTO savedUser = userService.saveUser(userDTO);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> loginUser(@RequestBody UserDTO userDTO) {

        Optional<UserDTO> userByUserName = userService.findByUsername(userDTO.getUsername());
        if (userByUserName.isPresent() && passwordEncoder.matches(userDTO.getPassword(), userByUserName.get().getPassword())) {
            return new ResponseEntity<>(userByUserName.get(), HttpStatus.OK);
        }
        Optional<UserDTO> userByUserEmail = userService.findByEmail(userDTO.getEmail());
        if (userByUserEmail.isPresent() && passwordEncoder.matches(userDTO.getPassword(), userByUserEmail.get().getPassword())) {
            return new ResponseEntity<>(userByUserEmail.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}