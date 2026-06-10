package com.sp.senac.projeto_fotografico.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioResponse {
    private Integer id;

    @JsonProperty("category_id")
    private Integer categoryId;

    @JsonProperty("category_name")
    private String categoryName;

    @JsonProperty("order_index")
    private Integer orderIndex;

    @JsonProperty("image_urls")
    private List<String> imageUrls;

    @JsonProperty("last_update")
    private LocalDateTime lastUpdate;
}