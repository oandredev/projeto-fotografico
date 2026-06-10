package com.sp.senac.projeto_fotografico.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioStatsResponse {
    private long categoriasAtivas;
    private long fotosArmazenadas;
    private long visualizacoes;
    private List<CategoryStatsResponse> categorias;
}