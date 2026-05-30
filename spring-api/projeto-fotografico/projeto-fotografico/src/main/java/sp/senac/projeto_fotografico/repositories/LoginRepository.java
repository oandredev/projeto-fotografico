package sp.senac.projeto_fotografico.repositories;

import sp.senac.projeto_fotografico.models.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LoginRepository extends JpaRepository<Login, Integer> {
    Optional<Login> findByEmail(String email);

    @Query("SELECT l FROM Login l WHERE l.email = :email AND l.password = MD5(:password)")
    Optional<Login> login(@Param("email") String email, @Param("password") String password);

}
