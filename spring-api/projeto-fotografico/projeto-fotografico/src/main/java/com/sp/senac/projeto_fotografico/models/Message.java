package com.sp.senac.projeto_fotografico.models;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "subject", length = 150)
    private String subject;

    @Column(name = "body", nullable = false, length = 500)
    private String body;

    @Column(name = "isStarred", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isStarred;

    @Column(name = "isArchived", columnDefinition = "TINYINT(1) DEFAULT 0")
    private Boolean isArchived;

    @Column(name = "date", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime date;
}