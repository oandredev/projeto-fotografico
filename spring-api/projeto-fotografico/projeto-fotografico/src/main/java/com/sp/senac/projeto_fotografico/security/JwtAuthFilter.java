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

/**
 * Equivalente ao getAuthentication() do jwt.js do Node.
 *
 * Lê o token do header (ou query param) cujo nome vem de FIELD_TOKEN,
 * verifica com a mesma chave e popula o SecurityContext —
 * o Spring Security bloqueia com 403 automaticamente rotas não autorizadas.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    /** Nome do header — equivalente a process.env.FIELD_TOKEN */
    @Value("${jwt.field-token}")
    private String tokenField;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        // 1. Tenta header primeiro, depois query param (igual ao Node)
        String token = request.getHeader(tokenField);
        if (token == null) {
            token = request.getParameter(tokenField);
        }

        // 2. Token presente → tenta verificar
        if (token != null) {
            try {
                Claims claims = jwtUtil.extractClaims(token);

                // Role em uppercase → "user" vira ROLE_USER
                String role = claims.getOrDefault("role", "user")
                        .toString().toUpperCase();

                var auth = new UsernamePasswordAuthenticationToken(
                        claims,   // principal = payload completo do JWT
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );

                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception ignored) {
                // Token inválido/expirado → limpa contexto
                // O SecurityConfig vai retornar 401 se a rota for protegida
                SecurityContextHolder.clearContext();
            }
        }

        chain.doFilter(request, response);
    }
}
