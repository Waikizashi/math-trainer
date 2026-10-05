package com.stuba.mathtrainerapi.api.dto;

import lombok.Data;
import lombok.ToString;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class AuthDTO {
    @NotBlank @Size(max = 50)
    private String username;
    @NotBlank @Size(max = 72) @ToString.Exclude
    private String password;

}