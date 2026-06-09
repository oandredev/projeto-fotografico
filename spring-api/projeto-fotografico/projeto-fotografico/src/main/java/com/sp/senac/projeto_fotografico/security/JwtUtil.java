package com.sp.senac.projeto_fotografico.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.Map;

/**
 * Equivalente ao jwt.js do Node:
 *
 *   generateToken(userInfo, remember)  →  generateToken(claims, remember)
 *   getTokenInfo(req)                  →  extractClaims(token)
 */
@Component
public class JwtUtil {

    @Value("${jwt.key}")
    private String rawKey;

    // ─── Geração ────────────────────────────────────────────────────────────

    /**
     * Gera o token JWT.
     *
     * @param claims  mapa com as informações do usuário (id, email, role…)
     * @param remember true  → expira em 7 dias  (equivalente a "7d")
     *                 false → expira em 4 horas (equivalente a "4h")
     */
    public String generateToken(Map<String, Object> claims, boolean remember) {
        long expiryMs = remember
                ? 7L * 24 * 60 * 60 * 1_000   // 7d
                : 4L      * 60 * 60 * 1_000;   // 4h

        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiryMs))
                .signWith(signingKey())
                .compact();
    }

    // ─── Verificação ─────────────────────────────────────────────────────────

    /**
     * Verifica e retorna os claims do token.
     * Lança exceção se o token for inválido ou expirado —
     * o chamador decide se retorna null ou 401 (igual ao try/catch do Node).
     */
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ─── Chave de assinatura ─────────────────────────────────────────────────

    /**
     * HMAC-SHA256 requer no mínimo 32 bytes.
     * Faz padding automaticamente para não estourar se a JWT_KEY for curta.
     */
    private SecretKey signingKey() {
        byte[] src   = rawKey.getBytes(StandardCharsets.UTF_8);
        byte[] bytes = src.length >= 32 ? src : Arrays.copyOf(src, 32);
        return Keys.hmacShaKeyFor(bytes);
    }
}
