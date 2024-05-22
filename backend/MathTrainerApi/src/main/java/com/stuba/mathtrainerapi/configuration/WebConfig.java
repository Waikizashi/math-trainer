package com.stuba.mathtrainerapi.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Разрешаем CORS-запросы для всех путей и методов из указанного домена
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000") // Указывайте конкретный URL фронтенда
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}