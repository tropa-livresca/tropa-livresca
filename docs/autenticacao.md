# Autenticação e autorização

A autenticação da aplicação é realizada por sessão e cookies, com validação em rotas protegidas.

## Fluxo principal

1. O usuário realiza cadastro.
2. O sistema pode validar e-mail e telefone.
3. O usuário faz login.
4. A sessão é criada e validada pelo backend.
5. Rotas sensíveis exigem autenticação via middleware.

## Recursos contemplados

- Cadastro e login
- Recuperação de senha
- Perfil do usuário
- Logout
- Acesso restrito para gerenciamento de livros e perfil

## Pontos técnicos

- O backend utiliza middleware de autenticação para proteger endpoints.
- A aplicação se integra ao Supabase para autenticação e persistência.
- O frontend consome a API autenticada no fluxo privado.
