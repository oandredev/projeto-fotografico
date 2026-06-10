package com.sp.senac.projeto_fotografico.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryStatsResponse {
    private Integer categoryId;
    private Integer photos;
    private Integer views;
}