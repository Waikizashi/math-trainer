package com.stuba.mathtrainerapi.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/** Profile edit cannot replace credentials, ownership or privileges. */
@Data
public class UserUpdateRequest {
    @NotBlank @Size(max = 50)
    private String username;
    @NotBlank @Email @Size(max = 100)
    private String email;
}
