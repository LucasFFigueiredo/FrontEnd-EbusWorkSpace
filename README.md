# 🏢 E-bus WorkSpace — Frontend

> Plataforma de agendamento de salas de reunião e mesas de trabalho com validação por QR Code.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Testes](#-testes)
- [Linting e Formatação](#-linting-e-formatação)
- [Docker](#-docker)
- [Contribuição](#-contribuição)

---

## 📖 Sobre o Projeto

O **E-bus WorkSpace** é o frontend de uma aplicação web voltada para o gerenciamento e reserva de espaços de trabalho — como **salas de reunião** e **mesas de trabalho** — dentro de uma empresa. A aplicação permite que colaboradores realizem agendamentos, façam check-in via **QR Code**, visualizem métricas de uso e gerenciem seus perfis.

O sistema utiliza autenticação via **Google OAuth** e conta com um middleware de proteção de rotas baseado em **JWT**, garantindo que apenas usuários autenticados e com setor definido possam acessar os recursos.

---

## ✨ Funcionalidades

| Funcionalidade                | Descrição                                                       |
| ----------------------------- | --------------------------------------------------------------- |
| 🔐 **Autenticação Google**    | Login via Google OAuth com gerenciamento de sessão por cookies   |
| 📅 **Reserva de Espaços**     | Agendamento de salas de reunião e mesas de trabalho              |
| 📋 **Minhas Reservas**        | Visualização e gerenciamento das reservas do usuário             |
| 📱 **QR Code Check-in**       | Validação de presença por leitura de QR Code                    |
| 📊 **Métricas**               | Dashboard com métricas de utilização dos espaços                 |
| 🏗️ **Gestão de Espaços**     | Cadastro e administração dos espaços disponíveis (admin)        |
| 👤 **Perfil do Usuário**      | Edição de dados pessoais e preferências                         |
| 🏢 **Seleção de Departamento**| Seleção obrigatória de setor ao primeiro acesso                 |
| 🛡️ **Painel Administrativo** | Área restrita para administradores                              |

---

## 🛠 Tecnologias Utilizadas

### Core

| Tecnologia          | Versão     | Descrição                                                |
| ------------------- | ---------- | -------------------------------------------------------- |
| **Next.js**         | `^15.4.4`  | Framework React com SSR, rotas de API e App Router       |
| **React**           | `^19.2.0`  | Biblioteca para construção de interfaces de usuário      |
| **TypeScript**      | `^5.8.3`   | Superset de JavaScript com tipagem estática              |

### Estilização

| Tecnologia            | Versão     | Descrição                                           |
| --------------------- | ---------- | --------------------------------------------------- |
| **Tailwind CSS**      | `^4.2.1`   | Framework CSS utility-first (v4 via PostCSS)        |
| **shadcn/ui**         | —          | Coleção de componentes acessíveis baseados em Radix |
| **Radix UI**          | Vários     | Primitivos de UI acessíveis e sem estilização       |
| **tw-animate-css**    | `^1.3.4`   | Animações CSS para Tailwind                         |

### Gerenciamento de Estado e Dados

| Tecnologia              | Versão     | Descrição                                        |
| ----------------------- | ---------- | ------------------------------------------------ |
| **TanStack React Query**| `^5.83.0`  | Cache e sincronização de dados assíncronos       |
| **React Hook Form**     | `^7.54.2`  | Gerenciamento de formulários performático         |
| **Zod**                 | `^3.24.2`  | Validação de schemas e dados TypeScript-first     |

### Funcionalidades Específicas

| Tecnologia            | Versão     | Descrição                                          |
| --------------------- | ---------- | -------------------------------------------------- |
| **html5-qrcode**      | `^2.3.8`   | Leitura de QR Codes via câmera do dispositivo      |
| **Recharts**          | `^2.15.4`  | Gráficos e visualizações de dados                  |
| **date-fns**          | `^4.1.0`   | Manipulação e formatação de datas                  |
| **Sonner**            | `^2.0.7`   | Notificações toast elegantes                       |
| **Lucide React**      | `^0.575.0` | Biblioteca de ícones                               |
| **cmdk**              | `^1.1.1`   | Componente de Command Palette                      |

### Qualidade de Código

| Tecnologia              | Versão     | Descrição                                        |
| ----------------------- | ---------- | ------------------------------------------------ |
| **ESLint**              | `^9.32.0`  | Linter para identificar e corrigir problemas     |
| **Prettier**            | `^3.7.3`   | Formatador de código automático                  |
| **Vitest**              | `^4.1.10`  | Framework de testes rápido e moderno             |
| **Testing Library**     | Vários     | Utilitários para testes centrados no usuário      |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** — versão `24.x` ou superior (recomendado: LTS)
- **npm** — gerenciador de pacotes (vem com o Node.js)
- **Git** — para clonar o repositório
- **Docker** _(opcional)_ — para rodar via container

> 💡 **Dica:** Verifique suas versões com:
> ```bash
> node -v
> npm -v
> git --version
> ```

---

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd FrontEnd-EbusWorkSpace
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Preencha as variáveis conforme a seção abaixo.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

---

## 🔑 Variáveis de Ambiente

| Variável                       | Descrição                                      | Exemplo                        |
| ------------------------------ | ---------------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL`     | URL base da API backend                        | `http://localhost:5281`        |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID do Google OAuth para autenticação    | `824677...googleusercontent.com` |

> ⚠️ **Importante:** Variáveis com prefixo `NEXT_PUBLIC_` são expostas no navegador. Nunca coloque secrets ou tokens nelas.

---

## 📜 Scripts Disponíveis

| Comando              | Descrição                                                 |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | Inicia o servidor de desenvolvimento (hot reload)         |
| `npm run build`      | Gera o build de produção otimizado                        |
| `npm run start`      | Inicia o servidor de produção (requer build prévio)       |
| `npm run lint`       | Executa o ESLint para verificar problemas no código       |
| `npm run format`     | Formata todo o código com Prettier                        |
| `npm run test`       | Executa os testes unitários com Vitest (modo watch)       |
| `npm run test:coverage` | Executa os testes e gera relatório de cobertura        |

---

## 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura modular baseada em **features**, separando responsabilidades de forma clara:

```
src/
├── app/                        #    App Router (Next.js 15)
│   ├── layout.tsx              #    Layout raiz da aplicação
│   ├── page.tsx                #    Página inicial (Home)
│   ├── providers.tsx           #    Providers globais (React Query, Toaster)
│   ├── error.tsx               #    Página de erro global
│   ├── loading.tsx             #    Loading state global
│   ├── api/                    #    Route Handlers (API interna)
│   │   └── auth/               #    Rotas de autenticação (login/logout)
│   ├── admin/                  #    Painel administrativo
│   ├── book/                   #    Página de nova reserva
│   ├── bookings/               #    Página "Minhas Reservas"
│   ├── checkin/                #    Página de check-in
│   ├── login/                  #    Página de login
│   ├── metrics/                #    Dashboard de métricas
│   ├── profile/                #    Página de perfil
│   ├── scan/                   #    Scanner de QR Code
│   ├── select-department/      #    Seleção de departamento
│   └── spaces/                 #    Gestão de espaços
│
├── core/                       #    Lógica central e infraestrutura
│   ├── actions/                #    Server Actions (booking, space, user)
│   ├── models/                 #    Tipos e interfaces do domínio
│   ├── paths/                  #    Definição centralizada de rotas
│   ├── services/               #    Serviços de comunicação com a API
│   └── utils/                  #    Funções utilitárias (ex: cn)
│
├── features/                   #    Módulos de funcionalidade
│   ├── auth/                   #    Autenticação (components, hooks, pages)
│   ├── booking/                #    Reservas (components, hooks, pages)
│   ├── metrics/                #    Métricas (hooks, pages)
│   └── spaces/                 #    Espaços (hooks, pages)
│
├── shared/                     #    Recursos reutilizáveis
│   ├── components/             #    Componentes compartilhados
│   │   ├── Header.tsx          #    Header global da aplicação
│   │   └── ui/                 #    Componentes UI (shadcn/ui)
│   └── hooks/                  #    Hooks compartilhados (ex: use-mobile)
│
├── types/                      #    Tipos globais e declarações
│   └── global.d.ts             #    Declarações TypeScript globais
│
├── middleware.ts               #    Middleware de autenticação e rotas
├── styles.css                  #    Estilos globais (Tailwind + variáveis)
└── setupTests.ts               #    Configuração de testes
```

### Princípios da Arquitetura

| Conceito                   | Descrição                                                                 |
| -------------------------- | ------------------------------------------------------------------------- |
| **Feature-based**          | Cada funcionalidade possui seus próprios componentes, hooks e páginas     |
| **Separação de concerns**  | Core (infra), Features (negócio), Shared (reuso)                         |
| **Colocation**             | Arquivos relacionados ficam juntos dentro de cada feature                 |
| **Path aliases**           | Importações limpas via `@/` mapeado para `./src/`                        |

---

## 🗺 Rotas da Aplicação

| Rota                   | Acesso        | Descrição                                  |
| ---------------------- | ------------- | -----------------------------------------  |
| `/`                    | 🔒 Autenticado | Página inicial com reservas               |
| `/login`               | 🌐 Público     | Tela de login com Google OAuth            |
| `/book`                | 🔒 Autenticado | Criação de nova reserva                   |
| `/bookings`            | 🔒 Autenticado | Lista de reservas do usuário              |
| `/checkin`             | 🔒 Autenticado | Check-in via QR Code                      |
| `/scan`                | 🔒 Autenticado | Scanner de QR Code                        |
| `/spaces`              | 🔒 Autenticado | Visualização/gestão de espaços            |
| `/profile`             | 🔒 Autenticado | Perfil do usuário                         |
| `/metrics`             | 🔒 Autenticado | Dashboard de métricas                     |
| `/admin`               | 🔒 Admin       | Painel administrativo                     |
| `/select-department`   | 🔒 Autenticado | Seleção obrigatória de setor              |

> 🛡️ O middleware intercepta todas as requisições e redireciona para `/login` caso o usuário não esteja autenticado, e para `/select-department` caso não tenha um setor definido.

---

## 🧪 Testes

O projeto utiliza **Vitest** como framework de testes com **Testing Library** para testes focados na experiência do usuário.

### Executar testes

```bash
# Modo watch (re-executa ao salvar)
npm run test

# Com relatório de cobertura
npm run test:coverage
```

### Configuração dos testes

- **Ambiente:** `jsdom` (simula o DOM do navegador)
- **Globals:** Habilitado (não precisa importar `describe`, `it`, `expect`)
- **Setup:** `src/setupTests.ts` (configura matchers do Testing Library)
- **Cobertura:** Provider `v8` com relatórios em `text` e `html`

---

## ✏️ Linting e Formatação

### ESLint

Configurado com:
- `@eslint/js` — regras recomendadas de JavaScript
- `typescript-eslint` — regras para TypeScript
- `eslint-plugin-react-hooks` — regras de React Hooks
- `eslint-plugin-prettier` — integração com Prettier

```bash
npm run lint
```

### Prettier

Configuração (`.prettierrc`):

```json
{
  "printWidth": 100,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all"
}
```

```bash
npm run format
```

---

## 🐳 Docker

O projeto inclui um **Dockerfile** multi-stage para builds otimizados:

### Build e execução

```bash
# Build da imagem
docker build -t ebus-workspace-frontend .

# Executar o container
docker run -p 3000:3000 ebus-workspace-frontend
```

### Detalhes do Dockerfile

| Estágio       | Base              | Descrição                                         |
| ------------- | ----------------- | ------------------------------------------------- |
| **build**     | `node:24-alpine`  | Instala dependências e gera o build de produção   |
| **production**| `node:24-alpine`  | Imagem final leve, apenas com artefatos de build  |

A aplicação é exposta na porta **3000**.
---

## 📄 Licença

Este projeto é de uso interno da **Ebus**.

---

<p align="center">
  Desenvolvido por <strong>Desenvolvido por Lucas Figueiredo - Pedro Viveiros - Thiffany Silva</strong>
</p>
