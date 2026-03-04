# Guia de Configuração do Clerk (Autenticação)

Siga este passo a passo para obter as chaves necessárias para o seu projeto `prepareC`.

## 1. Criar Conta e Aplicação
1. Acesse **[dashboard.clerk.com](https://dashboard.clerk.com/sign-up)** e crie sua conta (ou faça login).
2. Clique em **"Create Application"** (ou "Add application").
3. Dê um nome para sua aplicação (ex: `PrepareC`).
4. Selecione as opções de login que deseja (ex: Email, Google).
5. Clique em **"Create Application"**.

## 2. Obter as Chaves de API
1. Após criar a aplicação, você será redirecionado para a página inicial do projeto.
2. No menu lateral esquerdo, procure por **"API Keys"** ou veja a seção **"Quick Start"**.
3. Você verá dois valores importantes:
   - **Publishable Key** (começa com `pk_test_...`)
   - **Secret Key** (começa com `sk_test_...`)

## 3. Configurar no Projeto
1. Copie o valor da **Publishable Key**.
2. Abra o arquivo `.env` no seu VS Code.
3. Cole o valor em `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
4. Copie o valor da **Secret Key**.
5. Cole o valor em `CLERK_SECRET_KEY`.

O arquivo `.env` deve ficar parecido com isto:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_seu_codigo_aqui...
CLERK_SECRET_KEY=sk_test_seu_segredo_aqui...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
# ... restante do arquivo
```

## 4. Finalizar
Após salvar o arquivo `.env`, o servidor deve recarregar automaticamente e o erro desaparecerá.
