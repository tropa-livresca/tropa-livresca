# Autenticação

O PocketBase fornece uma collection `users` de autenticação nativa com registro, login, renovação de sessão e OAuth2.

## Fluxo principal

1. A pessoa cria uma conta ou entra pela tela de autenticação.
2. O PocketBase valida as credenciais e gera o token de sessão.
3. O cliente envia o token nas requisições protegidas.
4. As regras das collections verificam identidade e permissões.
5. O cliente pode renovar ou encerrar a sessão pelo SDK ou pela API REST.

## Perfil e privilégios

Quando um usuário é criado, o hook `main.pb.js` cria automaticamente o registro correspondente em `users_profile`.

Os campos usados para autorização são:

- `is_admin`: concede acesso ao painel administrativo
- `is_master`: concede privilégios adicionais
- `primeiro_acesso`: indica que o usuário ainda precisa concluir o primeiro acesso
- `funcao`: classificação funcional opcional
- `auth_user`: relação com a collection nativa `users`

O frontend não deve considerar um valor enviado pelo usuário como prova de privilégio. Sempre valide `is_admin` e `is_master` pelas regras do PocketBase ou no backend intermediário.

## Regras das collections

As regras `listRule`, `viewRule`, `createRule`, `updateRule` e `deleteRule` devem ser definidas no painel administrativo para cada collection.

Exemplos de conceitos:

- Dados públicos: permitir leitura somente das fields necessárias.
- Perfil próprio: `@request.auth.id != "" && auth_user = @request.auth.id`.
- Administração: `@request.auth.id != "" && auth_user.is_admin = true`.

As expressões devem ser testadas contra cada operação antes da publicação.

## OAuth2

OAuth2 pode ser configurado no painel PocketBase em **Settings > Auth providers**. Configure também as URLs autorizadas e os callbacks no provedor externo.

Os campos adicionais do usuário `nome`, `sobrenome` e `telefone` são adicionados pela migração da collection autenticada.

## Segurança

- Use HTTPS em produção.
- Restrinja a conta de superusuário.
- Não exponha o token de superusuário no frontend.
- Não desative as regras das collections em produção.
- Configure CORS e origens permitidas no servidor.
- Faça backup do diretório `pb_data` antes de atualizar o PocketBase.
