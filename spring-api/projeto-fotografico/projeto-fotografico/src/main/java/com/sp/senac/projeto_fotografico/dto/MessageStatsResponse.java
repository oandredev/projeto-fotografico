package com.sp.senac.projeto_fotografico.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageStatsResponse {

    private long total;
    private long favoritas;
    private long arquivadas;
    private long ativas;

    private long day;
    private long week;
    private long month;
    private long year;
}