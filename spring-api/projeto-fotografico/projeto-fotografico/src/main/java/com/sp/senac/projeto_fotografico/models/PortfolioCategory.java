package com.sp.senac.projeto_fotografico.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @JsonProperty("order_index")
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    private Integer views = 0;

    @JsonProperty("last_update")
    @Column(
            name = "last_update",
            insertable = false,
            updatable = false
    )
    private LocalDateTime lastUpdate;
}