# Documentação e Criação de Funções do Banco de Dados

```sql
-- ==============================================================================
-- DOCUMENTAÇÃO E CRIAÇÃO DE FUNÇÕES DO BANCO DE DADOS
-- PROJETO: TROPA LIVRESCA
-- BANCO DE DADOS: POSTGRESQL / SUPABASE
-- ==============================================================================

-- ==============================================================================
-- 1. auth.email
-- Retorna o e-mail associado ao contexto de autenticação.
-- Função nativa do ambiente de autenticação do Supabase.
-- ==============================================================================

-- A definição é gerenciada pelo Supabase.
-- Não recriar esta função manualmente.


-- ==============================================================================
-- 2. auth.jwt
-- Retorna as informações do JWT do contexto de autenticação.
-- ==============================================================================

-- A definição é gerenciada pelo Supabase.
-- Não recriar esta função manualmente.


-- ==============================================================================
-- 3. auth.role
-- Retorna o papel associado ao contexto de autenticação.
-- ==============================================================================

-- A definição é gerenciada pelo Supabase.
-- Não recriar esta função manualmente.


-- ==============================================================================
-- 4. auth.uid
-- Retorna o UUID do usuário autenticado.
-- ==============================================================================

-- A definição é gerenciada pelo Supabase.
-- Não recriar esta função manualmente.


-- ==============================================================================
-- 5. public.alterar_senha_adm
-- Atualiza a senha administrativa criptografada de um usuário e define
-- a flag de primeiro acesso como falsa.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.alterar_senha_adm(
    p_user_id uuid,
    p_nova_senha text
)
RETURNS TABLE (
    id uuid,
    primeiro_acesso boolean
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    UPDATE public.users_profile
    SET
        senha_adm = pgp_sym_encrypt(
            p_nova_senha,
            '225419eb-fd25-4430-8103-9591d2e4361d'
        ),
        primeiro_acesso = false
    WHERE users_profile.id = p_user_id
    RETURNING
        users_profile.id,
        users_profile.primeiro_acesso;
END;
$$;


-- ==============================================================================
-- 6. public.check_user_exists
-- Verifica se existe um usuário cadastrado em auth.users com o e-mail informado.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.check_user_exists(
    email_to_check text
)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM auth.users
        WHERE email = email_to_check
    );
END;
$$;


-- ==============================================================================
-- 7. public.gerenciar_endereco_principal_automatico
-- Gerencia o endereço principal durante inserções, atualizações e inativações.
-- Garante que outro endereço ativo seja promovido quando necessário.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.gerenciar_endereco_principal_automatico()
RETURNS trigger
LANGUAGE plpgsql
VOLATILE
SECURITY INVOKER
AS $$
BEGIN
    -- Evita recursão causada por outros gatilhos.
    IF pg_trigger_depth() > 1 THEN
        RETURN NEW;
    END IF;

    -- Inserção ou atualização de endereço ativo.
    IF (
        TG_OP = 'INSERT'
        AND NEW.ativo = true
    ) OR (
        TG_OP = 'UPDATE'
        AND NEW.ativo = true
    ) THEN

        -- Se o endereço foi marcado como principal,
        -- desmarca os demais endereços principais do usuário.
        IF NEW.principal = true THEN
            UPDATE public.enderecos
            SET principal = false
            WHERE fk_user_profile_id = NEW.fk_user_profile_id
              AND id <> NEW.id
              AND principal = true;

        -- Se for o primeiro endereço ativo, define-o como principal.
        ELSE
            IF NOT EXISTS (
                SELECT 1
                FROM public.enderecos
                WHERE fk_user_profile_id = NEW.fk_user_profile_id
                  AND ativo = true
                  AND id <> COALESCE(NEW.id, 0)
            ) THEN
                NEW.principal := true;
            END IF;
        END IF;
    END IF;

    -- Se o endereço principal for desmarcado ou inativado,
    -- promove outro endereço ativo.
    IF TG_OP = 'UPDATE' THEN
        IF (
            OLD.principal = true
            AND NEW.principal = false
        ) OR (
            OLD.ativo = true
            AND NEW.ativo = false
            AND OLD.principal = true
        ) THEN

            IF NEW.ativo = false THEN
                NEW.principal := false;
            END IF;

            UPDATE public.enderecos
            SET principal = true
            WHERE id = (
                SELECT id
                FROM public.enderecos
                WHERE fk_user_profile_id = NEW.fk_user_profile_id
                  AND ativo = true
                  AND id <> NEW.id
                ORDER BY id DESC
                LIMIT 1
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


-- ==============================================================================
-- 8. public.handle_new_user
-- Cria automaticamente o perfil público do usuário após o cadastro
-- na tabela auth.users.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users_profile (
        id,
        nome,
        telefone,
        imagem,
        descricao,
        redes_sociais
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'nome', 'Novo Usuário'),
        COALESCE(NEW.raw_user_meta_data ->> 'telefone', ''),
        '',
        '',
        '{}'::jsonb
    );

    RETURN NEW;
END;
$$;


-- ==============================================================================
-- 9. public.handle_user_email_sync
-- Sincroniza o e-mail da conta de autenticação com o perfil público.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_user_email_sync()
RETURNS trigger
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.users_profile
    SET email = NEW.email
    WHERE id = NEW.id;

    -- Insere ou atualiza o perfil se ele ainda não existir.
    IF NOT FOUND THEN
        INSERT INTO public.users_profile (id, email)
        VALUES (NEW.id, NEW.email)
        ON CONFLICT (id)
        DO UPDATE SET email = EXCLUDED.email;
    END IF;

    RETURN NEW;
END;
$$;


-- ==============================================================================
-- 10. public.relatorio_estatisticas_vendas
-- Retorna estatísticas de vendas em formato JSONB para um período informado.
--
-- ATENÇÃO:
-- A consulta abaixo é um modelo. Ajuste os nomes das tabelas e colunas
-- conforme o esquema real de pedidos e itens de pedidos.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.relatorio_estatisticas_vendas(
    p_inicio timestamp with time zone,
    p_fim timestamp with time zone
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
BEGIN
    IF NOT public.validar_periodo_relatorio(p_inicio, p_fim) THEN
        RAISE EXCEPTION 'Período do relatório inválido.';
    END IF;

    -- Substituir pela consulta real de pedidos e vendas.
    RETURN jsonb_build_object(
        'periodo_inicio', p_inicio,
        'periodo_fim', p_fim,
        'total_vendas', 0,
        'quantidade_vendas', 0,
        'mensagem', 'Substitua os valores de exemplo pela consulta real.'
    );
END;
$$;


-- ==============================================================================
-- 11. public.relatorio_top_autores
-- Retorna dados para classificação dos autores com melhor desempenho.
--
-- ATENÇÃO:
-- O retorno record exige que a estrutura seja declarada pelo chamador.
-- A consulta definitiva depende das tabelas de autores, livros e vendas.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.relatorio_top_autores(
    p_inicio timestamp with time zone,
    p_fim timestamp with time zone
)
RETURNS SETOF record
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
BEGIN
    IF NOT public.validar_periodo_relatorio(p_inicio, p_fim) THEN
        RAISE EXCEPTION 'Período do relatório inválido.';
    END IF;

    -- Implementar a consulta de classificação dos autores
    -- utilizando as tabelas reais de vendas e livros.
    RAISE EXCEPTION
        'Consulta de top autores pendente de mapeamento do esquema.';
END;
$$;


-- ==============================================================================
-- 12. public.relatorio_top_livros
-- Retorna dados para classificação dos livros com melhor desempenho.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.relatorio_top_livros(
    p_inicio timestamp with time zone,
    p_fim timestamp with time zone
)
RETURNS SETOF record
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
BEGIN
    IF NOT public.validar_periodo_relatorio(p_inicio, p_fim) THEN
        RAISE EXCEPTION 'Período do relatório inválido.';
    END IF;

    -- Implementar a consulta de classificação dos livros
    -- utilizando as tabelas reais de vendas e itens vendidos.
    RAISE EXCEPTION
        'Consulta de top livros pendente de mapeamento do esquema.';
END;
$$;


-- ==============================================================================
-- 13. public.relatorio_vendas_genero
-- Retorna dados agregados de vendas por gênero literário.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.relatorio_vendas_genero(
    p_inicio timestamp with time zone,
    p_fim timestamp with time zone
)
RETURNS SETOF record
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
BEGIN
    IF NOT public.validar_periodo_relatorio(p_inicio, p_fim) THEN
        RAISE EXCEPTION 'Período do relatório inválido.';
    END IF;

    -- Implementar a agregação de vendas por gênero literário
    -- utilizando os relacionamentos reais entre livros e vendas.
    RAISE EXCEPTION
        'Consulta de vendas por gênero pendente de mapeamento do esquema.';
END;
$$;


-- ==============================================================================
-- 14. public.validar_periodo_relatorio
-- Valida se as datas de início e fim de um relatório formam um período válido.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.validar_periodo_relatorio(
    p_inicio timestamp with time zone,
    p_fim timestamp with time zone
)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SECURITY INVOKER
AS $$
BEGIN
    RETURN
        p_inicio IS NOT NULL
        AND p_fim IS NOT NULL
        AND p_inicio <= p_fim;
END;
$$;


-- ==============================================================================
-- 15. public.verificar_senha_adm
-- Descriptografa a senha administrativa armazenada para um usuário
-- e compara o resultado com a senha informada.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.verificar_senha_adm(
    user_id uuid,
    senha_digitada text
)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
    senha_valida boolean;
BEGIN
    SELECT (
        pgp_sym_decrypt(
            senha_adm::bytea,
            '225419eb-fd25-4430-8103-9591d2e4361d'
        ) = senha_digitada
    )
    INTO senha_valida
    FROM public.users_profile
    WHERE id = user_id;

    RETURN COALESCE(senha_valida, false);
END;
$$;

-- ==============================================================================
-- FIM DA DOCUMENTAÇÃO E CRIAÇÃO DE FUNÇÕES
-- ==============================================================================
```

## Observações importantes

1. **Funções `auth`:** são gerenciadas pelo Supabase. Não devem ser recriadas manualmente com base apenas nos metadados.

2. **Relatórios:** as funções 10 a 13 ainda não contêm as consultas reais de vendas. As três funções de classificação lançam exceções deliberadamente, evitando retornar resultados fictícios como se fossem dados reais. A função de estatísticas retorna um objeto demonstrativo, não um relatório real.

3. **Tipos de retorno:** `RETURNS TABLE(...)` e `RETURNS SETOF record` não são equivalentes a `RETURNS record`. Se o objetivo for preservar exatamente as assinaturas originais, é necessário conferir as definições atuais no banco antes de executar o script.

4. **Criptografia administrativa:** a chave fixa apresentada no exemplo deve ser substituída por uma estratégia segura de gestão de segredos. Para autenticação de usuários, prefira os recursos próprios do Supabase Auth em vez de armazenar senhas reversivelmente criptografadas.

5. **Gatilhos:** a criação das funções não cria os gatilhos associados. Os comandos `CREATE TRIGGER` devem ser documentados separadamente, conforme as tabelas, os eventos e as condições efetivamente utilizados no projeto.
