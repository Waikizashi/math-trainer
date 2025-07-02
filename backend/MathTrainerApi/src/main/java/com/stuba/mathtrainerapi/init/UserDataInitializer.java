package com.stuba.mathtrainerapi.init;

import com.stuba.mathtrainerapi.entity.User;
import com.stuba.mathtrainerapi.enums.Role;
import com.stuba.mathtrainerapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

//@Component
public class UserDataInitializer implements CommandLineRunner {

    //@Autowired
    private UserRepository userRepository;

    //@Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create and save all users
        //  userRepository.saveAll(createUsers());
    }

    private List<User> createUsers() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("123123123"));
        admin.setEmail("admin@ad.com");
        admin.setRole(Role.ADMIN);

        User user1 = new User();
        user1.setUsername("user1");
        user1.setPassword(passwordEncoder.encode("123456789"));
        user1.setEmail("user@user.com");
        user1.setRole(Role.USER);

        return Arrays.asList(admin, user1);
    }
}
