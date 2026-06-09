package com.sp.senac.projeto_fotografico.controllers;

import com.sp.senac.projeto_fotografico.dto.LoginRequest;
import com.sp.senac.projeto_fotografico.models.Login;
import com.sp.senac.projeto_fotografico.security.JwtUtil;
import com.sp.senac.projeto_fotografico.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @Autowired
    private LoginService service;

    @Autowired
    private JwtUtil jwtUtil;

    // POST /signup → 204  |  400 { erro }
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody LoginRequest request) {
        try {
            service.criarConta(request.email(), request.password());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // POST /login → 200 { token }  |  401 { erro }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Teste");

        try {
            Login user = service.login(request.email(), request.password());

            Map<String, Object> claims = new HashMap<>();
            claims.put("id",    user.getId());
            claims.put("email", user.getEmail());
            claims.put("role",  "user");

            boolean remember = Boolean.TRUE.equals(request.remember());

            String token = jwtUtil.generateToken(claims, remember);

            return ResponseEntity.ok(Map.of("token", token));

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    Map.of("erro", e.getMessage())
            );
        }
    }
}
