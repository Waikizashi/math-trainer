package com.stuba.mathtrainerapi.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.ToString;
import java.nio.charset.StandardCharsets;

/** Public account creation accepts identity and credentials only. */
@Data
public class RegisterRequest {
    @NotBlank @Size(max = 50)
    private String username;
    @NotBlank @Email @Size(max = 100)
    private String email;
    @NotBlank @Size(min = 8, max = 72) @ToString.Exclude
    private String password;

    // BCrypt limits bytes, not characters; never silently truncate a password.
    @AssertTrue(message = "Password must be at most 72 UTF-8 bytes")
    public boolean isPasswordWithinByteLimit() {
        return password == null || password.getBytes(StandardCharsets.UTF_8).length <= 72;
    }
}
