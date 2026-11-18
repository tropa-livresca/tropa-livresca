# Hooks e regras do banco

No PocketBase, funções SQL e RPC do PostgreSQL são substituídas por hooks JavaScript, API rules e operações executadas pela aplicação.

## Hook de criação de perfil

O hook `pocketbase/pb_hooks/main.pb.js` é associado à collection `users` e executado após a criação de um usuário.

```javascript
onRecordAfterCreateSuccess((e) => {
  const usuario = e.record;
  const perfil = new Record($app.findCollectionByNameOrId("users_profile"));

  perfil.set("id", usuario.id);
  perfil.set("auth_user", usuario.id);
  perfil.set("telefone", usuario.getString("telefone"));
  perfil.set("email", usuario.getString("email"));
  perfil.set("is_admin", false);
  perfil.set("is_master", false);
  perfil.set("primeiro_acesso", false);

  $app.save(perfil);
  return e.next();
}, "users");
```

## Comportamento

Quando um usuário autenticado é criado:

1. O PocketBase cria o registro em `users`.
2. O hook cria o perfil em `users_profile`.
3. `auth_user` recebe o ID do usuário.
4. Telefone e e-mail são copiados.
5. Os privilégios iniciais são definidos como falsos.

## Mapeamento das funções Supabase

| Função anterior | Equivalente PocketBase |
| --- | --- |
| `handle_new_user` | Hook `onRecordAfterCreateSuccess` |
| `handle_user_email_sync` | Atualização do perfil pelo fluxo da aplicação ou novo hook |
| `alterar_senha_adm` | Senha da collection ou regra de aplicação |
| `check_user_exists` | API REST de autenticação ou consulta de collection |
| `gerenciar_endereco_principal_automatico` | Hook de endereço ou validação no backend/frontend |

As funções anteriores não são executadas automaticamente após a migração do schema.

## Regras de API

As operações de banco devem ser protegidas pelas regras das collections:

- `listRule`: quem pode listar registros.
- `viewRule`: quem pode visualizar um registro.
- `createRule`: quem pode criar registros.
- `updateRule`: quem pode alterar registros.
- `deleteRule`: quem pode excluir registros.

Regras vazias podem permitir acesso público. As collections não devem ser expostas com regras abertas sem análise de segurança.

## Endereços principais

PocketBase não recria automaticamente o trigger PostgreSQL de endereço principal. Essa regra deve ser implementada por:

- um hook `onRecordBeforeCreateSuccess`/`onRecordBeforeUpdateSuccess`;
- uma rotina no backend Express; ou
- validação central antes da escrita no frontend.

## Boas práticas

- Valide dados no hook e no formulário.
- Não confie em campos de privilégio enviados pelo cliente.
- Consulte `@request.auth.id` nas regras.
- Evite registrar informações sensíveis em logs.
- Teste cada operação com usuário comum e administrador.
