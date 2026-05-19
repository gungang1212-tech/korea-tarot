package com.arcana.backend.dto.reading;

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
    private Boolean reversed;
}
