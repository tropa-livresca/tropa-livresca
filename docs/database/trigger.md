# Documentação dos Gatilhos (Triggers) — Supabase/PostgreSQL

Este documento descreve os gatilhos (_triggers_) utilizados na plataforma Tropa Livresca, responsáveis por executar automaticamente funções do banco de dados em resposta a operações realizadas nas tabelas.

Os gatilhos estão distribuídos nos esquemas `auth` e `public` e utilizam funções escritas em PL/pgSQL para realizar operações relacionadas ao cadastro de usuários, à sincronização de e-mails e ao gerenciamento de endereços principais.

---

## Instruções para Execução e Implantação

Para recriar os gatilhos em outro ambiente do Supabase, observe as seguintes diretrizes:

1. **Criação prévia das funções:** as funções acionadas pelos gatilhos devem existir antes da execução dos comandos `CREATE TRIGGER`.
2. **Esquema de origem:** cada gatilho deve ser criado no mesmo esquema e na tabela indicados na definição original.
3. **Momento de execução:** `BEFORE` indica que a função é executada antes da operação; `AFTER` indica que é executada depois da operação.
4. **Orientação por linha:** `FOR EACH ROW` determina que o gatilho seja executado individualmente para cada registro afetado.
5. **Eventos:** os eventos documentados são `INSERT`, responsáveis por disparar os gatilhos durante a inserção de registros.
6. **Permissões:** a criação de gatilhos no esquema `auth` pode exigir privilégios administrativos apropriados no Supabase.

---

# Estrutura dos Gatilhos

## 1. `on_auth_user_created`

**Tabela:** `auth.users`

**Função executada:** `public.handle_new_user()`

**Finalidade:** executar a função de criação do perfil público quando um novo usuário é inserido na tabela de autenticação do Supabase.

| Propriedade     | Definição                |
| --------------- | ------------------------ |
| Esquema         | `auth`                   |
| Tabela          | `users`                  |
| Nome do gatilho | `on_auth_user_created`   |
| Função acionada | `public.handle_new_user` |
| Momento         | `AFTER`                  |
| Evento          | `INSERT`                 |
| Orientação      | `ROW`                    |

### Método de criação

```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

### Funcionamento

Após a inserção de um usuário em `auth.users`, o gatilho executa `public.handle_new_user()`. Conforme a implementação documentada, essa função insere um perfil correspondente em `public.users_profile`, utilizando o UUID do usuário e os dados disponíveis nos metadados do cadastro.

---

## 2. `on_auth_user_email_sync`

**Tabela:** `auth.users`

**Função executada:** `public.handle_user_email_sync()`

**Finalidade:** executar a função responsável por sincronizar o e-mail da conta de autenticação com o perfil público.

| Propriedade     | Definição                       |
| --------------- | ------------------------------- |
| Esquema         | `auth`                          |
| Tabela          | `users`                         |
| Nome do gatilho | `on_auth_user_email_sync`       |
| Função acionada | `public.handle_user_email_sync` |
| Momento         | `AFTER`                         |
| Evento          | `INSERT`                        |
| Orientação      | `ROW`                           |

### Método de criação

```sql
CREATE TRIGGER on_auth_user_email_sync
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_email_sync();
```

### Funcionamento

Após a inserção de um usuário em `auth.users`, o gatilho executa `public.handle_user_email_sync()`, que sincroniza o e-mail com `public.users_profile`.

A implementação apresentada da função também contempla a inserção ou atualização do perfil caso ele ainda não exista.

**Observação importante:** a definição fornecida indica o evento `INSERT`, e não `UPDATE`. Portanto, esse gatilho, isoladamente, não sincroniza alterações posteriores de e-mail. Para isso, seria necessário um gatilho separado para `AFTER UPDATE OF email`, caso esse comportamento seja desejado.

Além disso, como `on_auth_user_created` também insere um perfil, a execução dos dois gatilhos durante o mesmo cadastro exige atenção: a função de sincronização deve ser compatível com a existência prévia do perfil e com as restrições de unicidade da tabela.

---

## 3. `trigger_endereco_principal_automatico`

**Tabela:** `public.enderecos`

**Função executada:** `public.gerenciar_endereco_principal_automatico()`

**Finalidade:** executar a função de gerenciamento do endereço principal antes da inserção de cada endereço.

| Propriedade     | Definição                                        |
| --------------- | ------------------------------------------------ |
| Esquema         | `public`                                         |
| Tabela          | `enderecos`                                      |
| Nome do gatilho | `trigger_endereco_principal_automatico`          |
| Função acionada | `public.gerenciar_endereco_principal_automatico` |
| Momento         | `BEFORE`                                         |
| Evento          | `INSERT`                                         |
| Orientação      | `ROW`                                            |

### Método de criação

```sql
CREATE TRIGGER trigger_endereco_principal_automatico
BEFORE INSERT ON public.enderecos
FOR EACH ROW
EXECUTE FUNCTION public.gerenciar_endereco_principal_automatico();
```

### Funcionamento

Antes de cada inserção em `public.enderecos`, o gatilho executa a função `public.gerenciar_endereco_principal_automatico()`.

A função pode ajustar o campo `principal` do registro que está sendo inserido, conforme as regras de negócio implementadas.

**Observação importante:** a função apresentada anteriormente também contém lógica para operações `UPDATE`. Entretanto, o gatilho documentado está associado somente ao evento `INSERT`. Para que a lógica de atualização seja executada automaticamente, será necessário confirmar a existência de outro gatilho `BEFORE UPDATE` ou ajustar a definição, conforme o comportamento desejado.

---

# Relacionamento entre Gatilhos e Funções

| Gatilho                                 | Tabela             | Evento          | Função executada                                   |
| --------------------------------------- | ------------------ | --------------- | -------------------------------------------------- |
| `on_auth_user_created`                  | `auth.users`       | `AFTER INSERT`  | `public.handle_new_user()`                         |
| `on_auth_user_email_sync`               | `auth.users`       | `AFTER INSERT`  | `public.handle_user_email_sync()`                  |
| `trigger_endereco_principal_automatico` | `public.enderecos` | `BEFORE INSERT` | `public.gerenciar_endereco_principal_automatico()` |

---

# Verificação dos Gatilhos Existentes

A consulta abaixo permite verificar os gatilhos registrados no banco de dados e conferir suas tabelas, seus eventos e suas funções associadas.

```sql
SELECT
    event_object_schema AS table_schema,
    event_object_table AS table_name,
    trigger_name,
    action_timing,
    event_manipulation AS event,
    action_orientation AS orientation,
    action_statement AS function_triggered
FROM information_schema.triggers
WHERE
    (event_object_schema = 'auth'
        AND event_object_table = 'users')
    OR
    (event_object_schema = 'public'
        AND event_object_table = 'enderecos')
ORDER BY
    event_object_schema,
    event_object_table,
    trigger_name,
    event_manipulation;
```

## Observações finais

- Os comandos de criação acima reproduzem os nomes e os eventos informados na listagem recebida.
- Antes de executar os comandos em um ambiente existente, verifique se os gatilhos já foram criados, pois a criação de um gatilho com nome duplicado na mesma tabela provocará erro.
- A criação dos gatilhos não cria automaticamente as funções associadas.
- Os gatilhos de `auth.users` devem ser mantidos em conformidade com a configuração do Supabase Auth.
- As definições documentadas não alteram automaticamente o banco de dados real.
