package com.sp.senac.projeto_fotografico.services;

import com.sp.senac.projeto_fotografico.models.Login;
import com.sp.senac.projeto_fotografico.repositories.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class LoginService {

    @Autowired
    private LoginRepository repository;

    public Integer criarConta(String email, String password) {
        if (repository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado por outro usuário.");
        }

        Login login = new Login();
        login.setEmail(email);
        login.setPassword(md5(password));   // salva o hash, igual ao INSERT MD5(?) do Node

        return repository.save(login).getId();
    }


    public Login login(String email, String password) {
        // Busca por email + hash — equivalente ao WHERE email=? AND password=MD5(?)
        return repository.findByEmailAndPassword(email, md5(password))
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas."));
    }

    // MD5
    private String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder(32);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 não disponível na JVM", e);
        }
    }
}
