package com.sp.senac.projeto_fotografico.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${upload.root:../uploads}")
    private String uploadRoot;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Paths.get(uploadRoot).toAbsolutePath().normalize().toUri().toString();

        if (!location.endsWith("/")) location += "/";  // ← garante sempre

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(location);
    }
}