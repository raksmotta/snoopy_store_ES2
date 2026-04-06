package com.snoopystore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record PedidoRequest(
        @NotEmpty(message = "O pedido deve conter ao menos um item.") List<@Valid ItemRequest> itens
) {}
