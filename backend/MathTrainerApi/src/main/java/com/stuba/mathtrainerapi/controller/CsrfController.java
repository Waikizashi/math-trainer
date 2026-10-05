package com.stuba.mathtrainerapi.controller;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {
    public record TokenResponse(String headerName, String token) {}

    @GetMapping("/api/csrf")
    public ResponseEntity<TokenResponse> csrf(CsrfToken token) {
        // Resolves the deferred, BREACH-masked token. The underlying token remains in the HttpOnly session.
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                .body(new TokenResponse(token.getHeaderName(), token.getToken()));
    }
}
