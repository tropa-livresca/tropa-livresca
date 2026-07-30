# Frontend React e Vite

Este documento descreve a configuração, variáveis de ambiente e diretrizes de desenvolvimento do ecossistema do cliente web do projeto Tropa Livresca.

---

## Visão Geral do Template

O frontend é construído sobre o ecossistema React e Vite, fornecendo suporte nativo a Hot Module Replacement (HMR) e análise de código com regras estruturadas do ESLint.

A compilação utiliza plugins oficiais baseados nas seguintes tecnologias:
* `@vitejs/plugin-react`: Processamento de alta velocidade utilizando a ferramenta Oxc.
* `@vitejs/plugin-react-swc`: Alternativa estável baseada em compilação nativa com SWC.

---

## Configuração do Arquivo .env

Para configurar o ambiente de desenvolvimento do cliente, siga os passos abaixo:

1. Criação do Arquivo: Crie um novo arquivo chamado `.env` diretamente no diretório raiz do frontend.
2. Inserção de Chaves: Adicione as variáveis de infraestrutura necessárias baseando-se no modelo de propriedades listado abaixo.
3. Convenção de Prefixos: Todas as variáveis devem obrigatoriamente iniciar com o prefixo `VITE_` para que fiquem expostas ao escopo do cliente.
4. Consumo em Código: Acesse os valores de configuração ao longo do projeto utilizando a sintaxe nativa `import.meta.env.NOME_DA_VARIAVEL`.

### Modelo de Configuração (`frontend/.env`)

```env
# Integração com o Servidor Local Express
VITE_API_URL=http://localhost:3000

# Integração com os Serviços do Supabase
VITE_SUPABASE_URL=https://supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_anonima_ficticia
```

---

## React Compiler

O React Compiler não está habilitado neste template por razões de performance e tempos de resposta durante os processos locais de build e desenvolvimento. Caso necessite introduzir a compilação automática de memoização, consulte as instruções oficiais fornecidas na documentação do React Core.

---

## Expansão da Configuração do ESLint

A análise estática do projeto adota regras focadas em manter a consistência de escrita e exportação de componentes. Se houver interesse em migrar ou expandir o projeto para uma aplicação de produção tipada em TypeScript, certifique-se de adotar as regras de checagem baseadas em tipos ativando o pacote de utilitários `typescript-eslint`.

> Lembrete de Arquitetura: Conforme definido no fluxo do sistema, o cliente web não consome as credenciais de sessão do Supabase de forma local. Mantenha a flag `persistSession` em false no seu cliente JavaScript para delegar a segurança exclusivamente aos cookies geridos pelo backend.
