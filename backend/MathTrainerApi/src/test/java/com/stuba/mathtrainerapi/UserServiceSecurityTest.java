package com.stuba.mathtrainerapi;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stuba.mathtrainerapi.api.dto.*;
import com.stuba.mathtrainerapi.entity.User;
import com.stuba.mathtrainerapi.enums.Role;
import com.stuba.mathtrainerapi.mapper.UserMapper;
import com.stuba.mathtrainerapi.repository.UserRepository;
import com.stuba.mathtrainerapi.serviceImpl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceSecurityTest {
    private final UserRepository repository = mock(UserRepository.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(4);
    private final UserServiceImpl service = new UserServiceImpl(repository,
            Mappers.getMapper(UserMapper.class), encoder);
    private final ObjectMapper json = new ObjectMapper()
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

    @Test void maliciousRegistrationPersistsOnlyANewOrdinaryUser() throws Exception {
        RegisterRequest request = json.readValue("""
                {"username":"alice","email":"alice@example.com","password":"valid-password",
                 "id":123,"role":"ADMIN","saves":"foreign"}
                """, RegisterRequest.class);
        when(repository.save(any())).thenAnswer(invocation -> {
            User stored = invocation.getArgument(0);
            assertNull(stored.getId());
            assertNull(stored.getSaves());
            assertEquals(Role.USER, stored.getRole());
            assertTrue(encoder.matches("valid-password", stored.getPassword()));
            stored.setId(1L);
            return stored;
        });
        UserResponse response = service.registerUser(request);
        assertEquals("USER", response.getRole());
        assertFalse(json.writeValueAsString(response).contains("password"));
    }

    @Test void editPreservesStoredPrivilegesAndCredentialsAndUsesPathId() throws Exception {
        User existing = new User();
        existing.setId(1L); existing.setRole(Role.USER); existing.setPassword("original-hash");
        existing.setSaves("original-saves");
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));
        UserUpdateRequest request = json.readValue("""
                {"id":2,"username":"alice-new","email":"new@example.com","password":"injected","role":"ADMIN"}
                """, UserUpdateRequest.class);
        service.updateUser(1L, request);
        assertEquals(1L, existing.getId());
        assertEquals(Role.USER, existing.getRole());
        assertEquals("original-hash", existing.getPassword());
        assertEquals("original-saves", existing.getSaves());
        assertEquals("alice-new", existing.getUsername());
        verify(repository, never()).findById(2L);
    }

    @Test void missingAccountReturnsNotFound() {
        when(repository.findById(9L)).thenReturn(Optional.empty());
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.updateUser(9L, new UserUpdateRequest()));
        assertEquals(404, error.getStatusCode().value());
        verify(repository, never()).save(any());
    }

    @Test void entitySerializationAndLoggingDoNotIncludePasswordHash() throws Exception {
        User user = new User(); user.setPassword("secret-hash");
        assertFalse(json.writeValueAsString(user).contains("secret-hash"));
        assertFalse(user.toString().contains("secret-hash"));
        assertFalse(json.writeValueAsString(new TheoryDTO()).contains("completions"));
        assertFalse(json.writeValueAsString(new PracticeDTO()).contains("completions"));
    }

    @Test void repositoriesHaveNoDataRestRuntime() {
        assertThrows(ClassNotFoundException.class,
                () -> Class.forName("org.springframework.data.rest.webmvc.RepositoryRestController"));
    }
}
