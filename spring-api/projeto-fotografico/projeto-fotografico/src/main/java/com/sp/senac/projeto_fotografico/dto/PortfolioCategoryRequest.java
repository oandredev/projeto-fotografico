package com.sp.senac.projeto_fotografico.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioCategoryRequest {

    private String name;

    @JsonProperty("order_index")
    private Integer orderIndex;
}