# API - Autenticação Administrativa

Este documento detalha os endpoints de autenticação e controle de credenciais voltados exclusivamente para a equipe de moderação e gerenciamento (ADM) da plataforma Tropa Livresca.

---

## Visão Geral

* Segurança de Acesso: O login administrativo opera de forma isolada do fluxo de clientes, utilizando a tabela e regras específicas mapeadas no `AuthModel.buscarPorUsername`.
* Troca Forçada de Senha: O sistema implementa uma regra de primeiro acesso que obriga o administrador a atualizar a senha padrão temporária antes de liberar as demais funcionalidades do painel.
* Prefixo dos Endpoints: Todas as rotas deste módulo respondem sob o caminho base `/api/v1/admin/auth`.

---

## Tabela de Endpoints

| Método | Endpoint | Protegido | Descrição |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/admin/auth/signin` | Não | Realiza a validação do usuário administrativo e inicia a sessão de gestão. |
| POST | `/api/v1/admin/auth/alterar-senha` | Não | Atualiza a credencial temporária obrigatória no primeiro acesso ao painel. |

---

## Contratos de Dados e Comportamento Técnico

### POST `/signin`
* Payload Esperado (JSON): `{ "username": "...", "password": "..." }`
* Resposta de Sucesso: Status `200 OK` retornando os dados do perfil administrativo e injetando as chaves de segurança nos cookies HttpOnly do navegador.
* Fluxo de Bloqueio: Caso a flag `forcar_troca_senha` esteja ativa no banco para este usuário, a API pode instruir o frontend a redirecionar o fluxo imediatamente para a tela de alteração cadastral.
* Regra de Exceção: Retorna status `400 Bad Request` ou `401 Unauthorized` em cenários de credenciais inválidas ou inexistentes na view `vw_auth_adm`.

### POST `/alterar-senha`
* Payload Esperado (JSON): `{ "userId": "...", "novaSenha": "..." }`
* Resposta de Sucesso: Status `200 OK` contendo a confirmação da modificação e desativando a flag de obrigatoriedade de troca:
  ```json
  {
    "message": "Senha atualizada com sucesso! Prossiga para o painel."
  }
  ```
* Regra de Exceção: Retorna status `400 Bad Request` se a nova senha não atender aos critérios mínimos de complexidade ou se o identificador do administrador for inválido.

---

## Observações Gerais

* Isolamento de Métodos: Os controladores deste fluxo interagem com os métodos específicos `buscarPorUsername` e `atualizarSenha` do `AuthModel`, garantindo que contas corporativas não interfiram nas tabelas de usuários comuns da aplicação.
* Consumo no Interceptador: Conforme parametrizado no utilitário global `apiFetch`, se uma requisição sob o escopo do painel administrativo receber status `401 Unauthorized`, o usuário será redirecionado para a rota `/auth/admin` e não para o login comum de clientes.
