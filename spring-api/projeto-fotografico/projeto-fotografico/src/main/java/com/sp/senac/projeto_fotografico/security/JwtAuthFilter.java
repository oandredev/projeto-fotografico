package com.sp.senac.projeto_fotografico.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${jwt.field-token}")
    private String tokenField;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String token = request.getHeader(tokenField);
        if (token == null) {
            token = request.getParameter(tokenField);
        }

        if (token != null) {
            try {
                Claims claims = jwtUtil.extractClaims(token);

                String role = claims.getOrDefault("role", "user")
                        .toString().toUpperCase();

                var auth = new UsernamePasswordAuthenticationToken(
                        claims,   // principal = payload completo do JWT
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );

                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {
                System.out.println("JWT ERRO: " + e.getMessage());
                SecurityContextHolder.clearContext();
            }

        }

        chain.doFilter(request, response);
    }
}
