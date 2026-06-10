package com.sp.senac.projeto_fotografico.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerStatsResponse {

    private long total;
    private long geral;
    private long favoritos;
    private long arquivados;

    private long day;
    private long week;
    private long month;
    private long year;
}