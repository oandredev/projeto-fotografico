package com.sp.senac.projeto_fotografico.dto;

public record LoginRequest(
        String email,
        String password,
        Boolean remember
) {}
