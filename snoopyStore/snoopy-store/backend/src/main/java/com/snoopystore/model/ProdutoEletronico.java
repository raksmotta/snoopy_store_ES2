package com.snoopystore.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "produtos_eletronicos")
@DiscriminatorValue("ELETRONICO")
@Getter @Setter @NoArgsConstructor
public class ProdutoEletronico extends Produto {

    @Column(length = 50)
    private String voltagem;
}
