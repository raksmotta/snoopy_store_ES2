# Snoopy Store

MVP de loja virtual com gestao de produtos (basico, eletronico, perecivel) e pedidos.
Frontend estatico (HTML + CSS + JS puro) servido pelo proprio Spring Boot.

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

Swagger: **http://localhost:8080/swagger-ui.html**

## 3. Testar

1. Abra **http://localhost:8080**
2. **Produtos** — cadastre produtos (basico, eletronico com voltagem, perecivel com data de validade)
3. **Pedidos** — crie um pedido buscando produtos e informando quantidades
4. Verifique o historico de pedidos e o estoque atualizado dos produtos

## Estrutura

```
snoopy-store/
  backend/
    pom.xml
    src/main/java/com/snoopystore/   (API Spring Boot)
    src/main/resources/
      application.properties
      schema.sql
      static/                        (frontend estatico)
        index.html
        styles.css
        js/
          router.js
          api.js
          ui.js
          produtos.js
          pedidos.js
  LICENSE
  README.md
```

## Stack

| Camada   | Tecnologia                            |
|----------|---------------------------------------|
| Backend  | Spring Boot 3.2, Java 21, Maven      |
| Frontend | HTML + CSS + JS puro (ES Modules)     |
| Banco    | MySQL 8+                              |

## Licenca

MIT — veja [LICENSE](LICENSE).
