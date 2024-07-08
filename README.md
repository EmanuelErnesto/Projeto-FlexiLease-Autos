<h1 align="center">Projeto FlexiLease Autos 🚗</h1>

Este projeto consiste em uma API desenvolvida para uma concessionária, permitindo a criação de usuários, carros e reservas de veículos.

## Pré-requisitos

Antes de começar, verifique se sua máquina possui os seguintes requisitos:

- **Node.js**: versão 20.15.0. Se você ainda não tem o Node.js instalado, siga o tutorial de instalação [aqui](https://www.alura.com.br/artigos/como-instalar-node-js-windows-linux-macos).

- **Docker**: necessário para executar o banco de dados localmente. Instruções de instalação estão disponíveis [aqui](https://docs.docker.com/get-docker/).

- **MongoDB Compass**: recomendado para visualização e gerenciamento de dados do MongoDB. Faça o download [aqui](https://www.mongodb.com/try/download/compass).

- **Git**: essencial para clonar o repositório. Baixe-o [aqui](https://www.git-scm.com/downloads).

## Instalação e Configuração

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/EmanuelErnesto/Projeto-FlexiLease-Autos.git
  

2. **Navegue Até a pasta do projeto**

  ```bash
  cd Projeto-FlexiLease-Autos

  ```

3. **Instale as dependências**

  ```bash

  npm install

  ```

4. **Configuração do ambiente**

- Crie um arquivo .env na raiz do projeto com as seguintes configurações:

  ```bash
  PORT=3000
  APP_SECRET=fddc79a12abb620684d8c675bc7301f0
  DATABASE=api

  ```

⚠️ Certifique-se que a porta `3000` esteja livre para o correto funcionamento do swagger.

<h1>🔧 Executando a API</h1>

**Para iniciar a API em modo de desenvolvimento, execute:**

```bash
npm run start:dev

```

<h1>🪢Testes</h1>

**Execute os seguintes comandos para rodar os testes:**


- Testes de ponta a ponta e2e:

```bash
npm run test:e2e
```

- Testes de mutação:

```bash
npm run test:mutation
```

- Verificar cobertura de testes.

```bash
npm run test:cov
```

<h1>Tecnologias utilizadas</h1>

- Node Js com typescript.
- Banco de dados com mongodb
- Documentação com swagger.
- Autenticação com JWT.
- Segurança das rotas com Joi.
- Testes e2e com vitest e de mutação com stryker.
