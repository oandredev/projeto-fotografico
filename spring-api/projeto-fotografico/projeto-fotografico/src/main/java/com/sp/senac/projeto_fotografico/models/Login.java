package com.sp.senac.projeto_fotografico.models;

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
    private String email;

    // Armazenado como hash MD5 no banco (32 chars hex)
    private String password;
}
