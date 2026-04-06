package com.snoopystore.service;

import com.snoopystore.dto.ProdutoRequest;
import com.snoopystore.dto.ProdutoResponse;
import com.snoopystore.model.Produto;
import com.snoopystore.model.ProdutoEletronico;
import com.snoopystore.model.ProdutoPerecivel;
import com.snoopystore.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ProdutoService {

    private final ProdutoRepository repo;

    public ProdutoService(ProdutoRepository repo) {
        this.repo = repo;
    }

    public List<ProdutoResponse> listar(String q) {
        List<Produto> produtos = (q != null && !q.isBlank())
                ? repo.findByDeletedAtIsNullAndNomeContainingIgnoreCase(q)
                : repo.findByDeletedAtIsNull();
        return produtos.stream().map(this::toResponse).toList();
    }

    public ProdutoResponse buscarPorId(Long id) {
        return toResponse(findAtivo(id));
    }

    public ProdutoResponse criar(ProdutoRequest dto) {
        validarTipo(dto);
        Produto produto = buildFromRequest(dto);
        return toResponse(repo.save(produto));
    }

    public ProdutoResponse atualizar(Long id, ProdutoRequest dto) {
        Produto produto = findAtivo(id);
        produto.setNome(dto.nome());
        produto.setPreco(dto.preco());
        produto.setEstoque(dto.estoque());
        if (produto instanceof ProdutoEletronico pe) {
            pe.setVoltagem(dto.voltagem());
        }
        if (produto instanceof ProdutoPerecivel pp) {
            validarDataValidade(dto.dataValidade());
            pp.setDataValidade(dto.dataValidade());
        }
        return toResponse(repo.save(produto));
    }

    public void excluir(Long id) {
        Produto produto = findAtivo(id);
        produto.setDeletedAt(LocalDateTime.now());
        repo.save(produto);
    }

    public Produto findAtivo(Long id) {
        return repo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));
    }

    private Produto buildFromRequest(ProdutoRequest dto) {
        String tipo = dto.tipo() != null ? dto.tipo() : "BASICO";
        Produto produto;
        switch (tipo) {
            case "ELETRONICO" -> {
                ProdutoEletronico pe = new ProdutoEletronico();
                pe.setVoltagem(dto.voltagem());
                produto = pe;
            }
            case "PERECIVEL" -> {
                ProdutoPerecivel pp = new ProdutoPerecivel();
                validarDataValidade(dto.dataValidade());
                pp.setDataValidade(dto.dataValidade());
                produto = pp;
            }
            default -> produto = new Produto();
        }
        produto.setNome(dto.nome());
        produto.setPreco(dto.preco());
        produto.setEstoque(dto.estoque());
        return produto;
    }

    private void validarTipo(ProdutoRequest dto) {
        String tipo = dto.tipo() != null ? dto.tipo() : "BASICO";
        if (!tipo.equals("BASICO") && !tipo.equals("ELETRONICO") && !tipo.equals("PERECIVEL")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Tipo inválido. Use: BASICO, ELETRONICO ou PERECIVEL.");
        }
    }

    private void validarDataValidade(LocalDate dataValidade) {
        if (dataValidade != null && !dataValidade.isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Data de validade deve ser futura.");
        }
    }

    public ProdutoResponse toResponse(Produto p) {
        String tipo = "BASICO";
        String voltagem = null;
        LocalDate dataValidade = null;
        if (p instanceof ProdutoEletronico pe) {
            tipo = "ELETRONICO";
            voltagem = pe.getVoltagem();
        } else if (p instanceof ProdutoPerecivel pp) {
            tipo = "PERECIVEL";
            dataValidade = pp.getDataValidade();
        }
        return new ProdutoResponse(p.getId(), tipo, p.getNome(), p.getPreco(), p.getEstoque(), voltagem, dataValidade);
    }
}
