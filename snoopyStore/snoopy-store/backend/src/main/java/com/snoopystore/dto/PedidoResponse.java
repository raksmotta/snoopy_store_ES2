package com.snoopystore.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PedidoResponse(
        Long id,
        LocalDate data,
        BigDecimal valorTotal,
        List<ItemResponse> itens
) {}
