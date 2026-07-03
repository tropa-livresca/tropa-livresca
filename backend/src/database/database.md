# 🗺️ Documentação do Modelo de Dados (Supabase/PostgreSQL)

Este documento contém o mapeamento estrutural (DDL) das tabelas do banco de dados do projeto. Ele serve como documentação técnica e script de recuperação para a arquitetura de tabelas.

---

## 🛠️ Instruções para Execução e Implantação

Se você precisar recriar estas tabelas em um banco de dados limpo ou em um novo ambiente do Supabase, siga rigorosamente as diretrizes abaixo:

1. **Dependências de Sequências (Sequences):**
   * A tabela `cupons` possui um vínculo com uma sequência de incremento automático (`DEFAULT nextval('cupons_2_id_seq'::regclass)`). 
   * Certifique-se de que essa sequência exista ou altere o campo para `bigserial` / `generated always as identity` caso crie o banco do zero de forma puramente relacional.

2. **Chaves Estrangeiras pendentes:**
   * Este bloco de código contém estritamente a estrutura estrutural de criação (`CREATE TABLE`). Os comandos de amarração de chaves estrangeiras (`ALTER TABLE ... ADD CONSTRAINT`) devem ser executados apenas **após** a criação bem-sucedida de todas as tabelas listadas aqui.

3. **Esquema de Destino:**
   * Todas as entidades estão mapeadas explicitamente para o esquema `public` (`CREATE TABLE public.nome_da_tabela`).

---

## 📐 Estrutura de Criação das Tabelas (DDL)

```sql
-- ==========================================
-- CRIAÇÃO DA TABELA: adm_credenciais
-- ==========================================
CREATE TABLE public.adm_credenciais (
    codigo_especial text NOT NULL,
    id bigint PRIMARY KEY,
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    ativo boolean DEFAULT true,
    senha_adn text NOT NULL
);

-- ==========================================
-- CRIAÇÃO DA TABELA: adm_funcoes
-- ==========================================
CREATE TABLE public.adm_funcoes (
    id bigint PRIMARY KEY,
    fk_categorias_id bigint,
    fk_user_profile_id uuid DEFAULT gen_random_uuid()
);

-- ==========================================
-- CRIAÇÃO DA TABELA: blogs
-- ==========================================
CREATE TABLE public.blogs (
    titulo text NOT NULL,
    id bigint PRIMARY KEY,
    texto text NOT NULL,
    data_criacao time with time zone NOT NULL,
    fk_adms_id bigint,
    data date NOT NULL
);

-- ==========================================
-- CRIAÇÃO DA TABELA: blogs_categorias
-- ==========================================
CREATE TABLE public.blogs_categorias (
    id bigint PRIMARY KEY,
    fk_blogs_id bigint,
    fk_categorias_id bigint
);

-- ==========================================
-- CRIAÇÃO DA TABELA: categorias
-- ==========================================
CREATE TABLE public.categorias (
    data_criacao timestamp with time zone NOT NULL,
    tipo text NOT NULL,
    nome text NOT NULL,
    id bigint PRIMARY KEY,
    fk_adms_id bigint
);

-- ==========================================
-- CRIAÇÃO DA TABELA: colaboradores
-- ==========================================
CREATE TABLE public.colaboradores (
    sobrenome text,
    funcao text,
    nome text,
    fk_livros_id bigint,
    id bigint PRIMARY KEY
);

-- ==========================================
-- CRIAÇÃO DA TABELA: comentarios
-- ==========================================
CREATE TABLE public.comentarios (
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    id bigint PRIMARY KEY,
    texto text NOT NULL,
    fk_livros_id bigint,
    data timestamp without time zone NOT NULL
);

-- ==========================================
-- CRIAÇÃO DA TABELA: cupons
-- ==========================================
CREATE TABLE public.cupons (
    codigo text NOT NULL,
    id bigint DEFAULT nextval('cupons_2_id_seq'::regclass) PRIMARY KEY,
    valor numeric NOT NULL,
    universal boolean DEFAULT false NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    data_inicio timestamp with time zone NOT NULL,
    data_fim timestamp with time zone NOT NULL,
    limite_uso_total integer,
    limite_usuario integer DEFAULT 1,
    valor_minimo_compra numeric DEFAULT 0,
    data_criacao timestamp with time zone DEFAULT now(),
    data_atualizacao timestamp with time zone DEFAULT now(),
    fk_livros_id bigint,
    fk_adm_credential_id bigint,
    nome text NOT NULL,
    tipo_desconto text NOT NULL
);

-- ==========================================
-- CRIAÇÃO DA TABELA: denuncias
-- ==========================================
CREATE TABLE public.denuncias (
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    descricao text NOT NULL,
    tipo text NOT NULL,
    id bigint PRIMARY KEY,
    data timestamp without time zone NOT NULL
);

-- ==========================================
-- CRIAÇÃO DA TABELA: enderecos
-- ==========================================
CREATE TABLE public.enderecos (
    complemento text,
    cep character varying NOT NULL,
    estado character varying NOT NULL,
    bairro text NOT NULL,
    id bigint PRIMARY KEY,
    num integer NOT NULL,
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    rua text NOT NULL,
    cidade text NOT NULL
);

-- ==========================================
-- CRIAÇÃO DA TABELA: funcoes_base
-- ==========================================
CREATE TABLE public.funcoes_base (
    nome text NOT NULL,
    id bigint PRIMARY KEY,
    fk_adm_funcoes_id bigint
);

-- ==========================================
-- CRIAÇÃO DA TABELA: imagens
-- ==========================================
CREATE TABLE public.imagens (
    tipo text NOT NULL,
    id bigint PRIMARY KEY,
    imagem text NOT NULL,
    fk_user_profile_id uuid DEFAULT gen_random_uuid()
);

-- ==========================================
-- CRIAÇÃO DA TABELA: itens_venda
-- ==========================================
CREATE TABLE public.itens_venda (
    subtotal numeric NOT NULL,
    qtd bigint NOT NULL,
    id bigint PRIMARY KEY,
    fk_vendas_id bigint,
    fk_livros_itens_id bigint
);

-- ==========================================
-- CRIAÇÃO DA TABELA: livros
-- ==========================================
CREATE TABLE public.livros (
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    id bigint PRIMARY KEY,
    direitos_de_publicacao boolean NOT NULL,
    conteudo_por_IA boolean NOT NULL,
    imagens_explicitas boolean NOT NULL,
    numero_edicao smallint,
    data_de_publicacao date NOT NULL,
    comissao numeric NOT NULL,
    preco_digital numeric NOT NULL,
    preco_fisico numeric NOT NULL,
    ativo boolean DEFAULT true,
    formato text NOT NULL,
    tipo_de_livro text NOT NULL,
    publico_alvo text,
    capa text NOT NULL,
    titulo text NOT NULL,
    subtitulo text NOT NULL,
    descricao text NOT NULL,
    autor_nome text NOT NULL,
    autor_sobrenome text NOT NULL,
    status text DEFAULT 'rascunho'::text
);

-- ==========================================
-- CRIAÇÃO DA TABELA: livros_categorias
-- ==========================================
CREATE TABLE public.livros_categorias (
    fk_livros_id bigint,
    fk_categorias_id bigint,
    id bigint PRIMARY KEY
);

-- ==========================================
-- CRIAÇÃO DA TABELA: met_pagamentos
-- ==========================================
CREATE TABLE public.met_pagamentos (
    nome text NOT NULL,
    id bigint PRIMARY KEY
);

-- ==========================================
-- CRIAÇÃO DA TABELA: notificacoes
-- ==========================================
CREATE TABLE public.notificacoes (
    id bigint PRIMARY KEY,
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    lida boolean NOT NULL,
    ADM boolean NOT NULL,
    data timestamp without time zone NOT NULL,
    tipo text NOT NULL,
    texto text NOT NULL
);

-- ==========================================
-- CRIAÇÃO DA TABELA: revisoes
-- ==========================================
CREATE TABLE public.revisoes (
    fk_livros_id bigint,
    apontamento text,
    arquivo text NOT NULL,
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    data timestamp without time zone NOT NULL,
    id bigint PRIMARY KEY
);

-- ==========================================
-- CRIAÇÃO DA TABELA: users_profile
-- ==========================================
CREATE TABLE public.users_profile (
    tipo text NOT NULL,
    imagem text,
    nome text NOT NULL,
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    telefone text NOT NULL,
    descricao text
);

-- ==========================================
-- CRIAÇÃO DA TABELA: usu_redes
-- ==========================================
CREATE TABLE public.usu_redes (
    url text NOT NULL,
    plataforma text,
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    id bigint PRIMARY KEY
);

-- ==========================================
-- CRIAÇÃO DA TABELA: usuarios_cartoes
-- ==========================================
CREATE TABLE public.usuarios_cartoes (
    bandeira_varchar character varying NOT NULL,
    data_expiracao character varying NOT NULL,
    id bigint PRIMARY KEY,
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    token_pagamento text,
    final_cartao character varying NOT NULL,
    nome_no_cartao text NOT NULL
);

-- ==========================================
-- CRIAÇÃO DA TABELA: vendas
-- ==========================================
CREATE TABLE public.vendas (
    transacao_id text,
    id bigint PRIMARY KEY,
    fk_met_pagamentos_id bigint,
    data timestamp without time zone NOT NULL,
    status_pagamento text,
    fk_user_profile_id uuid DEFAULT gen_random_uuid(),
    total numeric
);

---

## 🔗 Relacionamentos e Restrições (Chaves Estrangeiras)

As diretivas abaixo realizam as amarrações lógicas entre as entidades do ecossistema. Certifique-se de executar este bloco **apenas após** a criação de todas as tabelas listadas anteriormente.

```sql
-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: adm_credenciais
-- ==========================================
ALTER TABLE public.adm_credenciais ADD CONSTRAINT adm_credenciais_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: adm_funcoes
-- ==========================================
ALTER TABLE public.adm_funcoes ADD CONSTRAINT adm_funcoes_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);
ALTER TABLE public.adm_funcoes ADD CONSTRAINT adm_funcoes_fk_categorias_id_fkey FOREIGN KEY (fk_categorias_id) REFERENCES categorias(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: blogs_categorias
-- ==========================================
ALTER TABLE public.blogs_categorias ADD CONSTRAINT "blogs-categorias_fk_categorias_id_fkey" FOREIGN KEY (fk_categorias_id) REFERENCES categorias(id);
ALTER TABLE public.blogs_categorias ADD CONSTRAINT "blogs-categorias_fk_blogs_id_fkey" FOREIGN KEY (fk_blogs_id) REFERENCES blogs(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: categorias
-- ==========================================
ALTER TABLE public.categorias ADD CONSTRAINT categorias_fk_adms_id_fkey FOREIGN KEY (fk_adms_id) REFERENCES adm_credenciais(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: colaboradores
-- ==========================================
ALTER TABLE public.colaboradores ADD CONSTRAINT colaboradores_fk_livros_id_fkey FOREIGN KEY (fk_livros_id) REFERENCES livros(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: comentarios
-- ==========================================
ALTER TABLE public.comentarios ADD CONSTRAINT comentarios_fk_livros_id_fkey FOREIGN KEY (fk_livros_id) REFERENCES livros(id);
ALTER TABLE public.comentarios ADD CONSTRAINT comentarios_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: cupons
-- ==========================================
ALTER TABLE public.cupons ADD CONSTRAINT cupons_fk_adm_credencial_id_fkey FOREIGN KEY (fk_adm_credencial_id) REFERENCES adm_credenciais(id);
ALTER TABLE public.cupons ADD CONSTRAINT cupons_fk_livros_id_fkey FOREIGN KEY (fk_livros_id) REFERENCES livros(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: denuncias
-- ==========================================
ALTER TABLE public.denuncias ADD CONSTRAINT denuncias_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: enderecos
-- ==========================================
ALTER TABLE public.enderecos ADD CONSTRAINT enderecos_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: funcoes_base
-- ==========================================
ALTER TABLE public.funcoes_base ADD CONSTRAINT funcoes_base_fk_adm_funcoes_id_fkey FOREIGN KEY (fk_adm_funcoes_id) REFERENCES adm_funcoes(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: imagens
-- ==========================================
ALTER TABLE public.imagens ADD CONSTRAINT imagens_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: itens_venda
-- ==========================================
ALTER TABLE public.itens_venda ADD CONSTRAINT itens_venda_fk_livros_itens_id_fkey FOREIGN KEY (fk_livros_itens_id) REFERENCES livros(id);
ALTER TABLE public.itens_venda ADD CONSTRAINT itens_venda_fk_vendas_id_fkey FOREIGN KEY (fk_vendas_id) REFERENCES vendas(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: livros
-- ==========================================
ALTER TABLE public.livros ADD CONSTRAINT livros_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: livros_categorias
-- ==========================================
ALTER TABLE public.livros_categorias ADD CONSTRAINT livros_categorias_fk_categorias_id_fkey FOREIGN KEY (fk_categorias_id) REFERENCES categorias(id);
ALTER TABLE public.livros_categorias ADD CONSTRAINT livros_categorias_fk_livros_id_fkey FOREIGN KEY (fk_livros_id) REFERENCES livros(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: notificacoes
-- ==========================================
ALTER TABLE public.notificacoes ADD CONSTRAINT notificacoes_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: revisoes
-- ==========================================
ALTER TABLE public.revisoes ADD CONSTRAINT revisoes_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);
ALTER TABLE public.revisoes ADD CONSTRAINT revisoes_fk_livros_id_fkey FOREIGN KEY (fk_livros_id) REFERENCES livros(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: users_profile
-- ==========================================
-- Atenção: Depende da tabela interna de autenticação nativa do Supabase (auth.users)
ALTER TABLE public.users_profile ADD CONSTRAINT users_profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: usu_redes
-- ==========================================
ALTER TABLE public.usu_redes ADD CONSTRAINT usu_redes_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: usuarios_cartoes
-- ==========================================
ALTER TABLE public.usuarios_cartoes ADD CONSTRAINT usuarios_cartoes_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);

-- ==========================================
-- CHAVES ESTRANGEIRAS DA TABELA: vendas
-- ==========================================
ALTER TABLE public.vendas ADD CONSTRAINT vendas_fk_user_profile_id_fkey FOREIGN KEY (fk_user_profile_id) REFERENCES users_profile(id);
ALTER TABLE public.vendas ADD CONSTRAINT vendas_fk_met_pagamentos_id_fkey FOREIGN KEY (fk_met_pagamentos_id) REFERENCES met_pagamentos(id);
```
