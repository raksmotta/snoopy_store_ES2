-- Snoopy Store - DDL (MySQL)
-- Mapeamento JOINED com soft delete (deleted_at)

CREATE DATABASE IF NOT EXISTS snoopy_store;
USE snoopy_store;

CREATE TABLE IF NOT EXISTS produtos (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo       VARCHAR(31)    NOT NULL,
    nome       VARCHAR(255)   NOT NULL,
    preco      DECIMAL(10,2)  NOT NULL,
    estoque    INT            NOT NULL DEFAULT 0,
    deleted_at TIMESTAMP      NULL
);

CREATE TABLE IF NOT EXISTS produtos_eletronicos (
    id       BIGINT PRIMARY KEY,
    voltagem VARCHAR(50),
    FOREIGN KEY (id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS produtos_pereciveis (
    id             BIGINT PRIMARY KEY,
    data_validade  DATE,
    FOREIGN KEY (id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS pedidos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    data        DATE           NOT NULL,
    valor_total DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
    deleted_at  TIMESTAMP      NULL
);

CREATE TABLE IF NOT EXISTS itens (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT            NOT NULL,
    valor_item DECIMAL(10,2)  NOT NULL,
    pedido_id  BIGINT         NOT NULL,
    produto_id BIGINT         NOT NULL,
    deleted_at TIMESTAMP      NULL,
    FOREIGN KEY (pedido_id)  REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
