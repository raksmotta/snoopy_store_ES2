package com.snoopystore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemRequest(
        @NotNull(message = "Produto é obrigatório.") Long produtoId,
        @NotNull(message = "Quantidade é obrigatória.") @Min(value = 1, message = "Quantidade deve ser >= 1.") Integer quantidade
) {}
