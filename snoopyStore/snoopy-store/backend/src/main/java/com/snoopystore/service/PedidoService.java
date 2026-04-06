package com.snoopystore.service;

import com.snoopystore.dto.*;
import com.snoopystore.model.Item;
import com.snoopystore.model.Pedido;
import com.snoopystore.model.Produto;
import com.snoopystore.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PedidoService {

    private final PedidoRepository pedidoRepo;
    private final ProdutoService produtoService;

    public PedidoService(PedidoRepository pedidoRepo, ProdutoService produtoService) {
        this.pedidoRepo = pedidoRepo;
        this.produtoService = produtoService;
    }

    public List<PedidoResponse> listar() {
        return pedidoRepo.findByDeletedAtIsNull().stream()
                .map(this::toResponse)
                .toList();
    }

    public PedidoResponse buscarPorId(Long id) {
        return toResponse(findAtivo(id));
    }

    public PedidoResponse criar(PedidoRequest dto) {
        Pedido pedido = new Pedido();
        pedido.setData(LocalDate.now());

        BigDecimal total = BigDecimal.ZERO;

        for (ItemRequest itemReq : dto.itens()) {
            Produto produto = produtoService.findAtivo(itemReq.produtoId());

            if (produto.getEstoque() < itemReq.quantidade()) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                        "Estoque insuficiente para '" + produto.getNome()
                                + "'. Disponível: " + produto.getEstoque()
                                + ", solicitado: " + itemReq.quantidade() + ".");
            }

            Item item = new Item();
            item.setQuantidade(itemReq.quantidade());
            item.setValorItem(produto.getPreco());
            item.setProduto(produto);
            item.setPedido(pedido);
            pedido.getItens().add(item);

            produto.setEstoque(produto.getEstoque() - itemReq.quantidade());
            total = total.add(produto.getPreco().multiply(BigDecimal.valueOf(itemReq.quantidade())));
        }

        pedido.setValorTotal(total);
        pedido = pedidoRepo.save(pedido);
        return toResponse(pedido);
    }

    public void excluir(Long id) {
        Pedido pedido = findAtivo(id);
        pedido.setDeletedAt(LocalDateTime.now());
        pedidoRepo.save(pedido);
    }

    private Pedido findAtivo(Long id) {
        return pedidoRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado."));
    }

    private PedidoResponse toResponse(Pedido p) {
        List<ItemResponse> itensResp = p.getItens().stream()
                .map(i -> new ItemResponse(
                        i.getId(),
                        i.getProduto().getId(),
                        i.getProduto().getNome(),
                        i.getQuantidade(),
                        i.getValorItem()
                ))
                .toList();
        return new PedidoResponse(p.getId(), p.getData(), p.getValorTotal(), itensResp);
    }
}
