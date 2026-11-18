# Gatilhos do PocketBase

Os gatilhos PostgreSQL não são transferidos automaticamente para o PocketBase. Pontos executados por triggers podem ser implementados por hooks JavaScript ou pelas regras da aplicação.

## Hook disponível

O projeto possui atualmente o hook em `pocketbase/pb_hooks/main.pb.js`:

| Evento | Collection | Operação |
| --- | --- | --- |
| `onRecordAfterCreateSuccess` | `users` | Criar o perfil correspondente |

O hook cria `users_profile` com o mesmo ID da conta autenticada, copia telefone e e-mail e define os privilégios iniciais.

## Conversão dos gatilhos anteriores

### Criação de usuário

Equivalente a `on_auth_user_created`:

- Evento: usuário criado em `users`.
- Hook: `onRecordAfterCreateSuccess`.
- Resultado: criação de `users_profile`.

O hook atual está no projeto e cria o perfil após o cadastro.

### Sincronização de e-mail

Não existe atualmente um hook equivalente a `on_auth_user_email_sync`.

Para sincronizar o e-mail:

1. Atualize o campo `email` em `users_profile` no mesmo fluxo que altera o e-mail.
2. Ou implemente um hook de atualização da collection `users`.
3. Proteja o campo contra alterações não autorizadas.

### Endereço principal

A função `gerenciar_endereco_principal_automatico` não foi convertida automaticamente.

Antes de ativar essa regra no PocketBase, implemente um dos mecanismos abaixo:

```javascript
onRecordBeforeCreateRequest((e) => {
  // Validar ou ajustar o registro antes da criação.
  return e.next();
}, "enderecos");
```

```javascript
onRecordBeforeUpdateRequest((e) => {
  // Validar ou ajustar o registro antes da atualização.
  return e.next();
}, "enderecos");
```

## Regras de implementação

1. Mantenha um único responsável pela consistência dos endereços principais.
2. Evite atualizar registros recursivamente sem verificar o contexto do hook.
3. Use transações ou operações sequenciais controladas quando necessário.
4. Teste criação, alteração e exclusão de endereços.
5. Configure as API rules para impedir que o usuário altere registros de outra pessoa.

## Gatilhos não implementados

Os seguintes comportamentos precisam ser implementados ou confirmados no PocketBase:

- sincronização posterior de e-mail;
- controle automático do endereço principal;
- envio de notificações em alterações financeiras;
- execução de ações administrativas em revisões;
- validação de funções administrativas.
