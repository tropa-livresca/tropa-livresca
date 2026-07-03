# Banco de dados

O projeto utiliza o Supabase como camada principal para armazenamento de dados, autenticação e arquivos.

## Localização dos arquivos

A configuração de conexão e os arquivos relacionados ao banco estão localizados em:

- [backend/src/config/supabase.js](../backend/src/config/supabase.js)
- [backend/src/database](../backend/src/database)

## Variáveis de ambiente relacionadas

- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## Configuração

1. Criar um projeto no Supabase.
2. Configurar as tabelas e políticas necessárias.
3. Preencher as variáveis de ambiente com as chaves corretas.
4. Garantir que a aplicação backend esteja apontando para o projeto correto.

> A documentação detalhada do esquema do banco pode ser expandida conforme o projeto evoluir.
