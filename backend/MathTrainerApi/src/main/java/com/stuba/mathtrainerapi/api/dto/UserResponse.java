package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;

/** Safe output contract: credential fields must never be added here. */
@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
}
