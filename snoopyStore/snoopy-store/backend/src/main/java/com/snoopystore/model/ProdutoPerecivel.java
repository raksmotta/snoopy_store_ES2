package com.snoopystore.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "produtos_pereciveis")
@DiscriminatorValue("PERECIVEL")
@Getter @Setter @NoArgsConstructor
public class ProdutoPerecivel extends Produto {

    @Column(name = "data_validade")
    private LocalDate dataValidade;
}
