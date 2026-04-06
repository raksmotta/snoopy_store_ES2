package com.snoopystore.repository;

import com.snoopystore.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByDeletedAtIsNull();
    List<Produto> findByDeletedAtIsNullAndNomeContainingIgnoreCase(String nome);
    Optional<Produto> findByIdAndDeletedAtIsNull(Long id);
}
