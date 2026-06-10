package com.sp.senac.projeto_fotografico.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sp.senac.projeto_fotografico.util.StringListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "portfolio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonProperty("category_id")
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "category_id",
            nullable = false,
            unique = true
    )
    private PortfolioCategory category;

    @JsonProperty("image_urls")
    @Convert(converter = StringListConverter.class)
    @Column(name = "image_urls", columnDefinition = "json")
    private List<String> imageUrls;

    @JsonProperty("last_update")
    @Column(
            name = "last_update",
            insertable = false,
            updatable = false
    )
    private LocalDateTime lastUpdate;
}