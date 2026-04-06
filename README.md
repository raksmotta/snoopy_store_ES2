# Snoopy Store

Este projeto é um MVP de e-commerce que demonstra a implementação de persistência de dados utilizando Spring Data JPA e Hibernate. O foco principal é a gestão de entidades e a automação do ciclo de vida do banco de dados MySQL.

**PUC Minas - Ciência da Computação - Engenharia de Software II**

**Alunos:**
- [Antônio Drumond Cota de Sousa](https://github.com/AntonioDrumond/)
- [Raquel de Parde Motta](https://github.com/raksmotta)

## 🛠️ Foco Técnico: Hibernate & Persistência

Este foi um projeto didático para aprender Hibernate/JPA, evidenciando sua competência em persistência de dados, mapeamento objeto-relacional (ORM) e integridade referencial.

A arquitetura de dados foi desenhada para explorar os recursos do Hibernate, garantindo que a lógica de negócio esteja fortemente vinculada à integridade do banco.

## 🚀 Funcionalidades do MVP

Polimorfismo de Produtos: Cadastro dinâmico de itens com campos específicos validados via Hibernate.

Fluxo de Pedidos: Sistema de busca e reserva de itens com atualização automática de inventário.

Auto-Schema Generation: Configuração para criação e atualização automática de tabelas via Hibernate ddl-auto.

Interface Reativa: Frontend em JS Puro que consome a API REST, refletindo em tempo real o estado do banco de dados.

## Pre-requisitos

- **JDK 21** (LTS)
- **Maven** 3.9+
- **MySQL** 8+

## 1. Configurar banco de dados

Crie o banco executando o script SQL no MySQL:

```sql
source backend/src/main/resources/schema.sql
```

Ou o Hibernate cria as tabelas automaticamente (`ddl-auto=update`).

### Credenciais padrao

Edite `backend/src/main/resources/application.properties` se necessario:

```
spring.datasource.url=jdbc:mysql://localhost:3306/snoopy_store
spring.datasource.username=root
spring.datasource.password=root
```

## 2. Executar

```bash
cd backend
mvn spring-boot:run
```

Acesse **http://localhost:8080** — frontend e API na mesma origem.

## 3. Testar

1. Abra **http://localhost:8080**
2. **Produtos** — cadastre produtos (basico, eletronico com voltagem, perecivel com data de validade)
3. **Pedidos** — crie um pedido buscando produtos e informando quantidades
4. Verifique o historico de pedidos e o estoque atualizado dos produtos

## Estrutura

```
snoopy-store
├── backend
│   ├── src
│   │   └── main
│   │       ├── java
│   │       │   └── com
│   │       │       └── snoopystore
│   │       │           ├── config
│   │       │           ├── controller
│   │       │           ├── dto
│   │       │           ├── exception
│   │       │           ├── model
│   │       │           ├── repository
│   │       │           ├── service
│   │       │           └── SnoopyStoreApplication.java
│   │       └── resources
│   │           ├── static
│   │           │   ├── js
│   │           │   │   ├── api.js
│   │           │   │   ├── pedidos.js
│   │           │   │   ├── produtos.js
│   │           │   │   ├── router.js
│   │           │   │   └── ui.js
│   │           │   ├── index.html
│   │           │   └── styles.css
│   │           ├── application.properties
│   │           └── schema.sql
│   └── pom.xml
├── LICENSE
└── README.md
```

## Stack

| Camada   | Tecnologia                            |
|----------|---------------------------------------|
| Backend  | Spring Boot 3.2, Java 21, Maven      |
| Frontend | HTML + CSS + JS puro (ES Modules)     |
| Banco    | MySQL 8+                              |
