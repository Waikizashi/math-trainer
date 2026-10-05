package com.stuba.mathtrainerapi.configuration;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.DispatcherType;
import org.springframework.http.HttpMethod;
import org.springframework.beans.factory.annotation.Value;
import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origins:}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/management/health").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/login", "/api/register").permitAll()
                        .requestMatchers("/api/users", "/api/users/**",
                                "/api/theory-completions", "/api/theory-completions/**",
                                "/api/practice-completions", "/api/practice-completions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/theories", "/api/theories/**",
                                "/api/practices", "/api/practices/**", "/api/current/user",
                                "/api/user-profile/theory-completions",
                                "/api/user-profile/practice-completions").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/user-profile/theory-completions",
                                "/api/user-profile/practice-completions").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/user-profile/theory-completions",
                                "/api/user-profile/practice-completions").authenticated()
                        .requestMatchers("/api/theories", "/api/theories/**",
                                "/api/practices", "/api/practices/**").hasRole("ADMIN")
                        // New routes require an explicit policy before they become reachable.
                        .anyRequest().denyAll()
                )
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) -> response.setStatus(401))
                        .accessDeniedHandler((request, response, exception) -> response.setStatus(403)))
                .formLogin(AbstractHttpConfigurer::disable) // Отключаем форму логина
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/api/logout", "POST"))
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.setContentType("application/json");
                            response.getWriter().write("{ \"status\": \"logged out\" }");
                        })
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(origin -> !origin.isEmpty())
                .forEach(configuration::addAllowedOrigin);
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
}

