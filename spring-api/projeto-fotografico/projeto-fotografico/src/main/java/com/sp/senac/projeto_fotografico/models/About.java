package com.sp.senac.projeto_fotografico.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "about")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class About {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "presentationText", nullable = false, columnDefinition = "TEXT")
    private String presentationText;

    @Column(name = "imageUrl", length = 500)
    private String imageUrl;

    // Gerenciado pelo banco via ON UPDATE CURRENT_TIMESTAMP — JPA não toca nessa coluna
    @Column(name = "lastUpdate", insertable = false, updatable = false)
    private LocalDateTime lastUpdate;
}
