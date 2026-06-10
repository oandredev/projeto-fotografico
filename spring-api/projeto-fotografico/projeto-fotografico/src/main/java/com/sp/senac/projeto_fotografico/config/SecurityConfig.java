package com.sp.senac.projeto_fotografico.config;

import com.sp.senac.projeto_fotografico.security.JwtAuthFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Value("${upload.root:../uploads}")
    private String uploadRoot;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) ->
                                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token ausente ou inválido"))
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/login", "/signup").permitAll()
                        .requestMatchers(HttpMethod.POST, "/message").permitAll() // ✅ ADICIONADO
                        .requestMatchers("/uploads/**").permitAll()
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path absPath = Paths.get(uploadRoot).toAbsolutePath().normalize();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absPath + "/");
    }
}
