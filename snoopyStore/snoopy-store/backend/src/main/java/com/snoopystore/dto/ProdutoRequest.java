package com.snoopystore.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProdutoRequest(
        String tipo,
        @NotBlank(message = "Nome é obrigatório.") String nome,
        @NotNull(message = "Preço é obrigatório.") @DecimalMin(value = "0.0", message = "Preço deve ser >= 0.") BigDecimal preco,
        @NotNull(message = "Estoque é obrigatório.") @Min(value = 0, message = "Estoque deve ser >= 0.") Integer estoque,
        String voltagem,
        LocalDate dataValidade
) {}
