package com.sp.senac.projeto_fotografico.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "customer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "cpf", nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "birthDate", nullable = false)
    private LocalDate birthDate;

    @Column(name = "isStarred", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isStarred;

    @Column(name = "isArchived", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isArchived;

    @CreationTimestamp
    @Column(name = "register", updatable = false)
    private LocalDateTime register;
}