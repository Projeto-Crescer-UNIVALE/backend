## Descriçã0

Backend - Projeto Crescer

Este é o backend do sistema de gerenciamento institucional, desenvolvido com [NestJS](https://nestjs.com/) e Prisma, que inclui módulos como Funcionário, Perfil, Diário, Oficinas e outros.

## Passos para rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Projeto-Crescer-UNIVALE/backend.git
cd backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo .env

Crie um arquivo `.env` na raiz com base no arquivo `.env.example`. Preencha com suas configurações do banco de dados e email.

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
JWT_SECRET="sua_chave_secreta"
EMAIL_HOST="smtp.exemplo.com"
EMAIL_PASS="sua_senha"
EMAIL_USER="seu_email"
EMAIL_PORT="465"
FRONT_URL="http://localhost:3000"
```

### 4. Gere os arquivos do Prisma

```bash
npx prisma generate
```

### 5. Gere os arquivos iniciais (seed)

Execute o comando abaixo para popular o banco de dados com os dados iniciais:

- Perfis: **Administrador** e **Professor**  
- Programas Sociais padrão  
- Usuário administrador padrão para login

**Credenciais padrão:**

- **Usuário:** `admin`  
- **Senha:** `admin`

```bash
npx prisma db seed
```

### 6. Execute as migrações do banco de dados

```bash
npx prisma db push
```

## Rodando o projeto

### Em modo desenvolvimento 

```bash
npm run start:dev
```

### modo normal

```bash
npm run start
```

## Acesse a API

Após iniciar o servidor, acesse a documentação da API (caso habilitada) ou verifique se o backend está online:

[http://localhost:3000/api](http://localhost:3000/api)


## Desenvolvido por

Equipe do Projeto Crescer - 2025 - Projeto Integrador
