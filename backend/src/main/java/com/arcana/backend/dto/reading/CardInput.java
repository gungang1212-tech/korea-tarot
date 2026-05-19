package com.arcana.backend.dto.reading;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CardInput {

    @NotNull
    private Integer cardId;

    @NotNull
    private Integer position;

    @NotNull
    @JsonProperty("is_reversed")
    private Boolean reversed;
}
