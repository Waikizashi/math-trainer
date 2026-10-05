package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.*;
import com.stuba.mathtrainerapi.api.service.*;
import com.stuba.mathtrainerapi.configuration.SecurityConfig;
import com.stuba.mathtrainerapi.controller.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** HTTP tests exercise the actual filter chain and JSON contracts, without a database. */
@WebMvcTest(controllers = {AuthController.class, UserController.class, UserProfileController.class,
        TheoryController.class, PracticeController.class, TheoryCompletionController.class, PracticeCompletionController.class})
@Import(SecurityConfig.class)
class AuthControllerTest {
    @Autowired MockMvc mvc;
    @MockBean UserService users;
    @MockBean TheoryService theories;
    @MockBean PracticeService practices;
    @MockBean TheoryCompletionService theoryProgress;
    @MockBean PracticeCompletionService practiceProgress;
    @MockBean AuthenticationManager authenticationManager;

    private UserResponse alice;
    @BeforeEach void setUp() {
        alice = new UserResponse();
        alice.setId(1L); alice.setUsername("alice"); alice.setEmail("alice@example.com"); alice.setRole("USER");
        when(users.findByUsername("alice")).thenReturn(Optional.of(alice));
    }

    @Test void publicRegisterAcceptsOnlyIdentityAndCredentials() throws Exception {
        when(users.isUserUnique("alice", "alice@example.com")).thenReturn(true);
        when(users.registerUser(any())).thenReturn(alice);
        mvc.perform(post("/api/register").contentType("application/json").content("""
            {"username":"alice","email":"alice@example.com","password":"valid-password",
             "role":"ADMIN","id":777,"saves":"untrusted"}
            """))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.role").value("USER"))
            .andExpect(jsonPath("$.id").value(1)).andExpect(jsonPath("$.password").doesNotExist());
        ArgumentCaptor<RegisterRequest> request = ArgumentCaptor.forClass(RegisterRequest.class);
        verify(users).registerUser(request.capture());
        assertEquals("valid-password", request.getValue().getPassword());
        assertFalse(request.getValue().toString().contains("valid-password"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"short", "", "яяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяяя"})
    void invalidPasswordsAreRejectedWithoutEchoingCredentials(String password) throws Exception {
        mvc.perform(post("/api/register").contentType("application/json")
                .content("{\"username\":\"alice\",\"email\":\"alice@example.com\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("invalid_request"));
        verify(users, never()).registerUser(any());
    }

    @Test void missingIdentityIsRejected() throws Exception {
        mvc.perform(post("/api/register").contentType("application/json").content("{}"))
                .andExpect(status().isBadRequest());
        verify(users, never()).registerUser(any());
    }

    @Test void duplicateRegisterIsConflict() throws Exception {
        mvc.perform(post("/api/register").contentType("application/json").content("""
                {"username":"alice","email":"alice@example.com","password":"valid-password"}
                """)) .andExpect(status().isConflict());
        verify(users, never()).registerUser(any());
    }

    @Test void loginAndCurrentUserNeverExposeCredentials() throws Exception {
        when(authenticationManager.authenticate(any())).thenReturn(
                new UsernamePasswordAuthenticationToken("alice", null, List.of()));
        mvc.perform(post("/api/login").contentType("application/json")
                .content("{\"username\":\"alice\",\"password\":\"valid-password\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.username").value("alice"))
                .andExpect(jsonPath("$.password").doesNotExist());
        mvc.perform(get("/api/current/user").with(user("alice")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test void badCredentialsReturnUnauthorized() throws Exception {
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("bad credentials"));
        mvc.perform(post("/api/login").contentType("application/json")
                .content("{\"username\":\"alice\",\"password\":\"invalid-password\"}"))
                .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @CsvSource({"GET,/api/users", "GET,/api/users/2", "POST,/api/users", "PUT,/api/users/2", "DELETE,/api/users/2",
            "POST,/api/theories", "PUT,/api/theories/2", "DELETE,/api/theories/2",
            "POST,/api/practices", "PUT,/api/practices/2", "DELETE,/api/practices/2",
            "GET,/api/theory-completions", "GET,/api/theory-completions/9", "POST,/api/theory-completions",
            "PUT,/api/theory-completions/9", "DELETE,/api/theory-completions/9",
            "GET,/api/practice-completions", "GET,/api/practice-completions/9", "POST,/api/practice-completions",
            "PUT,/api/practice-completions/9", "DELETE,/api/practice-completions/9"})
    void userCannotReachAdministrativeResources(String method, String path) throws Exception {
        mvc.perform(request(method, path).with(user("alice"))) .andExpect(status().isForbidden());
        verifyNoInteractions(theories, practices, theoryProgress, practiceProgress);
        verify(users, never()).findAllUsers();
        verify(users, never()).updateUser(anyLong(), any());
    }

    @ParameterizedTest
    @ValueSource(strings = {"/api/users", "/api/current/user", "/api/theories", "/api/user-profile/theory-completions"})
    void guestCannotReadPrivateApi(String path) throws Exception {
        mvc.perform(get(path)).andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @ValueSource(strings = {"/users", "/users/1", "/theories", "/profile", "/api/unknown", "/api/user-profile/saves"})
    void unmappedOrFormerRepositoryEndpointsAreDeniedEvenToAdmin(String path) throws Exception {
        mvc.perform(get(path).with(user("admin").roles("ADMIN"))).andExpect(status().isForbidden());
    }

    @Test void adminCanReadAccountsAndEditPathSelectedIdentity() throws Exception {
        when(users.findAllUsers()).thenReturn(List.of(alice));
        when(users.updateUser(eq(1L), any())).thenReturn(alice);
        mvc.perform(get("/api/users").with(user("admin").roles("ADMIN")))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].password").doesNotExist());
        mvc.perform(put("/api/users/1").with(user("admin").roles("ADMIN")).contentType("application/json").content("""
                {"username":"alice","email":"alice@example.com","id":2,"role":"ADMIN","password":"stolen"}
                """)) .andExpect(status().isOk());
        verify(users).updateUser(eq(1L), any(UserUpdateRequest.class));
        verify(users, never()).updateUser(eq(2L), any());
    }

    @Test void userCanReadLessonsAndAdminCanCreateContent() throws Exception {
        when(theories.findAllTheories()).thenReturn(List.of());
        when(practices.findAllPractices()).thenReturn(List.of());
        when(theories.saveTheory(any())).thenReturn(new TheoryDTO());
        when(practices.savePractice(any())).thenReturn(new PracticeDTO());
        mvc.perform(get("/api/theories").with(user("alice"))).andExpect(status().isOk());
        mvc.perform(get("/api/practices").with(user("alice"))).andExpect(status().isOk());
        mvc.perform(post("/api/theories").with(user("admin").roles("ADMIN"))
                .contentType("application/json").content("{\"title\":\"Test\"}")) .andExpect(status().isOk());
        mvc.perform(post("/api/practices").with(user("admin").roles("ADMIN"))
                .contentType("application/json").content("{\"title\":\"Test\"}")) .andExpect(status().isCreated());
    }

    @Test void theoryProgressUsesSessionIdentityAndIgnoresForeignRecordId() throws Exception {
        when(theoryProgress.updateTheoryCompletion(any())).thenAnswer(i -> i.getArgument(0));
        mvc.perform(put("/api/user-profile/theory-completions").with(user("alice"))
                .contentType("application/json").content("""
                {"userId":2,"id":999,"theoryId":3,"theoryStatus":"COMPLETED","completionDate":"1900-01-01"}
                """)) .andExpect(status().isOk()).andExpect(jsonPath("$.userId").value(1));
        ArgumentCaptor<TheoryCompletionDTO> dto = ArgumentCaptor.forClass(TheoryCompletionDTO.class);
        verify(theoryProgress).updateTheoryCompletion(dto.capture());
        assertNull(dto.getValue().getId());
        assertEquals(java.time.LocalDate.now(), dto.getValue().getCompletionDate());
    }

    @Test void practiceProgressUsesSessionIdentityAndIgnoresForeignRecordId() throws Exception {
        when(practiceProgress.savePracticeCompletion(any())).thenAnswer(i -> i.getArgument(0));
        mvc.perform(post("/api/user-profile/practice-completions").with(user("alice"))
                .contentType("application/json").content("""
                {"userId":2,"id":999,"practiceId":3,"practiceStatus":"IN_PROGRESS"}
                """)) .andExpect(status().isCreated()).andExpect(jsonPath("$.userId").value(1));
        ArgumentCaptor<PracticeCompletionDTO> dto = ArgumentCaptor.forClass(PracticeCompletionDTO.class);
        verify(practiceProgress).savePracticeCompletion(dto.capture());
        assertNull(dto.getValue().getId());
    }

    @Test void ownProgressReadIsScopedToSessionUser() throws Exception {
        when(theoryProgress.findAllTheoryCompletionsByUser(1L)).thenReturn(List.of());
        when(practiceProgress.findAllPracticeCompletionsByUser(1L)).thenReturn(List.of());
        mvc.perform(get("/api/user-profile/theory-completions").with(user("alice"))) .andExpect(status().isOk());
        mvc.perform(get("/api/user-profile/practice-completions").with(user("alice"))) .andExpect(status().isOk());
        verify(theoryProgress).findAllTheoryCompletionsByUser(1L);
        verify(practiceProgress).findAllPracticeCompletionsByUser(1L);
    }

    @Test void missingProgressTargetIsBadRequest() throws Exception {
        mvc.perform(put("/api/user-profile/practice-completions").with(user("alice"))
                .contentType("application/json").content("{\"practiceStatus\":\"COMPLETED\"}"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(practiceProgress);
    }

    @Test void postLogoutInvalidatesSession() throws Exception {
        MockHttpSession session = new MockHttpSession();
        mvc.perform(post("/api/logout").session(session).with(user("alice"))) .andExpect(status().isOk());
        assertTrue(session.isInvalid());
        mvc.perform(get("/api/logout").with(user("alice"))).andExpect(status().isForbidden());
    }

    private MockHttpServletRequestBuilder request(String method, String path) {
        return org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request(
                org.springframework.http.HttpMethod.valueOf(method), path);
    }
}
