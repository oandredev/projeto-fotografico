# 📸 Projeto Web — Site Fotográfico - Larissa Calegaro

**Disciplina:** Desenvolvimento de Sistemas Web - Centro Universitário SENAC<br>
**Orientador:** Prof. Bruno

## 👥 Integrantes

- André Rodrigues
- André Coutinho
- Fernando Tavares

---

## 🧠 Visão Geral

Aplicação web completa para um site fotográfico da **Larissa Calegaro**, com separação entre frontend e backend.

---

## 🏗️ Estrutura do Projeto

```
/projeto-fotografico
 ├── /node-api   → Backend (Node.js + MySQL + Multer (Para imagens))
 └── /angular    → Frontend (Angular)
```

### 🔸 Backend (API - Node)

- Node.js
- MySQL
- Multer (Para armazenar imagens)
- CRUD de dados
- Regras de negócio

### 🔹 Frontend (Angular)

- Angular
- Interface do usuário
- Consumo da API

---

## ⚙️ Funcionalidades

- Cadastro de fotos
- Listagem de portfólio
- Visualização detalhada
- Upload de imagens

---

## ▶️ Como Executar

### 1. Clonar o repositório

```bash
git clone https://github.com/oandredev/projeto-fotografico
cd projeto-fotografico
```

---

### 2. Instalar dependências

#### Backend

```bash
cd node-api
npm install
```

#### Frontend

```bash
cd angular
npm install
```

---

### 3. Executar o projeto

#### 🔹 Backend

```bash
cd api
npm start
```

#### 🔹 Frontend

```bash
cd angular
npx ng serve --open
```

---

## 🧪 Acesso

- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend: [http://localhost:3000](http://localhost:3000)

**OBS:** As portas informadas e as variavéis de ambientes são as utilizadas como padrão, mas podem ser alteradas nos seguintes arquivos:

- Angular → `environment.ts`
- Node.js → `.env`

## LEMBRE-SE em um projeto real esses arquivos NÃO devem ser públicos por questões de segurança.

## ⚠️ Observações

- Certifique-se de que o serviço MySQL está rodando (Serviço MySQL80)
- Configure credenciais do banco corretamente no .env (Usuário, senha)
- Considere que no primeiro acesso, fotos e textos base não serão exibidos, pois dependem de informações do banco de dados, o qual deve ser inicializado previamente, assim como as inserções das informações devem ser feitas utilizando a área administrativa (Exceto o cadastro da conta na tabela de login, a qual deve ser realizada diretamente pelo MySQL)

---
