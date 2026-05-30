package sp.senac.projeto_fotografico.models;

import java.security.Timestamp;
import java.sql.Date;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "login")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Login {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email", nullable = false, length = 150)
    private String email;
    
    @Column(name = "password", length = 150)
    private String password;

}
