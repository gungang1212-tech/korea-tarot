package com.arcana.backend.dto.reading;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CreateReadingRequest {

    @NotBlank
    private String concern;

    @NotNull @Size(min = 3, max = 3)
    @Valid
    private List<CardInput> cards;
}
