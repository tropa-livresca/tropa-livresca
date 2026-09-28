-- ==============================================================================
-- DOCUMENTAÇÃO E CRIAÇÃO DE FUNÇÕES DO BANCO DE DADOS
-- ==============================================================================

---

-- 1. alterar_senha_adm
-- Atualiza a senha administrativa criptografada de um usuário e define
-- a flag de primeiro acesso como falsa.

---

CREATE OR REPLACE FUNCTION public.alterar_senha_adm(
p_user_id uuid,
p_nova_senha text
)
RETURNS TABLE(id uuid, primeiro_acesso boolean)
LANGUAGE plpgsql
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
RETURNING users_profile.id, users_profile.primeiro_acesso;
END;

$$
;


-- ------------------------------------------------------------------------------
-- 2. check_user_exists
-- Verifica se existe pelo menos um usuário cadastrado no sistema (auth.users)
-- com o e-mail informado.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_user_exists(
  email_to_check text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$

BEGIN
RETURN EXISTS (
SELECT 1
FROM auth.users
WHERE email = email_to_check
);
END;

$$
;


-- ------------------------------------------------------------------------------
-- 3. gerenciar_endereco_principal_automatico
-- Trigger function para garantir a consistência do endereço principal
-- de um usuário em operações de inserção, atualização ou inativação.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.gerenciar_endereco_principal_automatico()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS
$$

BEGIN
-- Evita loops recursivos
IF pg_trigger_depth() > 1 THEN
RETURN NEW;
END IF;

-- REGRA 1 & 2: Tratamento para INSERÇÃO ou ATUALIZAÇÃO de um endereço como principal
IF (TG_OP = 'INSERT' AND NEW.ativo = true) OR (TG_OP = 'UPDATE' AND NEW.ativo = true) THEN

    -- Se o usuário explicitamente marcou este como principal, desmarca o outro antigo
    IF NEW.principal = true THEN
      UPDATE public.enderecos
      SET principal = false
      WHERE fk_user_profile_id = NEW.fk_user_profile_id
        AND id <> NEW.id
        AND principal = true;

    -- Se não veio marcado como principal, verifica se é o primeiro endereço ATIVO do usuário
    ELSE
      IF NOT EXISTS (
        SELECT 1 FROM public.enderecos
        WHERE fk_user_profile_id = NEW.fk_user_profile_id
          AND ativo = true
          AND id <> COALESCE(NEW.id, 0)
      ) THEN
        NEW.principal := true;
      END IF;
    END IF;

END IF;

-- REGRA 3: Tratamento para quando um endereço deixa de ser principal ou é INATIVADO
IF (TG_OP = 'UPDATE') THEN
IF (OLD.principal = true AND NEW.principal = false) OR (OLD.ativo = true AND NEW.ativo = false AND OLD.principal = true) THEN

      -- Força o registro atual a não ser principal caso tenha sido inativado
      IF NEW.ativo = false THEN
        NEW.principal := false;
      END IF;

      -- Promove o endereço ativo mais recente a principal
      UPDATE public.enderecos
      SET principal = true
      WHERE id = (
        SELECT id FROM public.enderecos
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

$$
;


-- ------------------------------------------------------------------------------
-- 4. handle_new_user
-- Trigger function que cria automaticamente o perfil público do usuário
-- na tabela public.users_profile após cadastro em auth.users.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$

BEGIN
INSERT INTO public.users_profile (id, nome, telefone, imagem, descricao, redes_sociais)
VALUES (
NEW.id,
COALESCE(NEW.raw_user_meta_data->>'nome', 'Novo Usuário'),
COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
'',
'',
'{}'::jsonb
);
RETURN NEW;
END;

$$
;


-- ------------------------------------------------------------------------------
-- 5. handle_user_email_sync
-- Trigger function para sincronizar alterações de e-mail da conta de autenticação
-- com o perfil público em public.users_profile.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_user_email_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$

BEGIN
-- Atualiza o e-mail se o perfil já existir
UPDATE public.users_profile
SET email = NEW.email
WHERE id = NEW.id;

-- Se o perfil ainda não existir, realiza a inserção
IF NOT FOUND THEN
INSERT INTO public.users_profile (id, email)
VALUES (NEW.id, NEW.email)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email;
END IF;

RETURN NEW;
END;

$$
;


-- ------------------------------------------------------------------------------
-- 6. verificar_senha_adm
-- Descriptografa a senha administrativa armazenada para um usuário
-- e compara com a senha informada.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verificar_senha_adm(
  user_id uuid,
  senha_digitada text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$

DECLARE
senha_valida boolean;
BEGIN
SELECT (pgp_sym_decrypt(senha_adm::bytea, '225419eb-fd25-4430-8103-9591d2e4361d') = senha_digitada)
INTO senha_valida
FROM public.users_profile
WHERE id = user_id;

RETURN COALESCE(senha_valida, false);
END;
$$;
