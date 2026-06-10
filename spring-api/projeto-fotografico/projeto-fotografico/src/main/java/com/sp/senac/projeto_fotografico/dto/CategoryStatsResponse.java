package com.sp.senac.projeto_fotografico.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryStatsResponse {
    @JsonProperty("category_id")
    private Integer categoryId;
    private Integer photos;
    private Integer views;
}