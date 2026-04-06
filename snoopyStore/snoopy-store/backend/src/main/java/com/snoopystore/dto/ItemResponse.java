package com.snoopystore.dto;

import java.math.BigDecimal;

public record ItemResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        Integer quantidade,
        BigDecimal valorItem
) {}
