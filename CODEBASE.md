# PrepareC - Documentação Técnica (Tier 1)

## 🏗️ Arquitetura
A aplicação segue o padrão **Next.js App Router** com uma arquitetura modular focada em escalabilidade e separação de preocupações.

### Camadas
- **UI Components**: Localizados em `components/`. Divididos em `ui` (base), `shared` (reutilizáveis) e pastas específicas por funcionalidade.
- **Server Actions**: Localizadas em pastas `actions.ts` dentro das rotas do `app/`.
- **Business Logic**: Centralizada em `lib/` (serviços de auth, db, ai).
- **Data Layer**: Prisma ORM com PostgreSQL.

## 🔒 Segurança
- **Autenticação**: Gerida pelo Clerk.
- **Autorização**: Papéis de usuário (ADMIN, USER) definidos no Prisma e verificados no `auth-service.ts`.
- **Validação**: Todas as entradas de API/Action são validadas com **Zod**.

## 🚀 Performance
- **React Compiler**: Habilitado no `next.config.ts`.
- **Edge Runtime**: Planejado para rotas de IA críticas.
- **Streaming**: Implementação pendente no chat para melhor UX.

## 🧪 Qualidade (QA)
- **Unit Tests**: Vitest + React Testing Library.
- **E2E Tests**: Playwright (Configuração pendente).
- **Linting**: ESLint configurado para Next.js 15.

## 🛠️ DevOps
- **Local Dev**: `npm run dev` (Porta 3002).
- **Build**: `npm run build`.
- **Database**: `npx prisma migrate dev`.

---
*Gerado automaticamente pelo Agente Orquestrador Antigravity.*
