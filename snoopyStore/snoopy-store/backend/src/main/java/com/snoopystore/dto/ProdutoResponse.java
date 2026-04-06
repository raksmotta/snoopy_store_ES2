package com.snoopystore.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProdutoResponse(
        Long id,
        String tipo,
        String nome,
        BigDecimal preco,
        Integer estoque,
        String voltagem,
        LocalDate dataValidade
) {}
