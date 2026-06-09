package com.sp.senac.projeto_fotografico.repositories;

import com.sp.senac.projeto_fotografico.models.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LoginRepository extends JpaRepository<Login, Integer> {

    Optional<Login> findByEmail(String email);

    Optional<Login> findByEmailAndPassword(String email, String password);
}
