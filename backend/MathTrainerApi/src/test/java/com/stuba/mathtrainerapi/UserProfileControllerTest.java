package com.stuba.mathtrainerapi;

import com.stuba.mathtrainerapi.api.dto.*;
import com.stuba.mathtrainerapi.api.service.*;
import com.stuba.mathtrainerapi.controller.UserProfileController;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserProfileControllerTest {
    @Test void deletedAccountCannotUseAStaleSession() {
        UserService users = mock(UserService.class);
        TheoryCompletionService theory = mock(TheoryCompletionService.class);
        PracticeCompletionService practice = mock(PracticeCompletionService.class);
        when(users.findByUsername("deleted")).thenReturn(Optional.empty());
        UserProfileController controller = new UserProfileController(theory, practice, users);
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> controller.getTheoryCompletions(() -> "deleted"));
        assertEquals(401, error.getStatusCode().value());
        verifyNoInteractions(theory, practice);
    }
}
