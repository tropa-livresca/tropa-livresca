# Autenticação e Autorização

A autenticação da aplicação é realizada por sessão e cookies, com validação centralizada no backend para assegurar o controle de acesso tanto para clientes quanto para administradores.

---

## Fluxo Principal

1. **Cadastro**: O usuário realiza o cadastro enviando os dados obrigatórios para a API.
2. **Confirmação**: O sistema delega ao Supabase a validação de identidade e dispara os fluxos de confirmação de e-mail.
3. **Login**: O usuário fornece suas credenciais na tela correspondente do frontend.
4. **Geração de Sessão**: O backend valida os dados, gera a sessão e anexa os tokens (_access_ e _refresh_) em cookies criptografados.
5. **Validação Contínua**: O middleware local intercepta as requisições em rotas sensíveis para validar a integridade dos cookies ativos.

---

## Recursos Contemplados

- **Cadastro e Login**: Fluxos isolados para usuários comuns (_Clients_) e painel de gerenciamento (ADM).
- **Autenticação de Administradores (ADM)**: O login do administrador passa por uma verificação estruturada em duas etapas no backend: validação das credenciais através do Supabase Auth e checagem de privilégios de acesso na tabela `users_profile`. Tentativas de login no painel administrativo por contas sem as propriedades `is_admin` ou `is_master` ativas são abortadas imediatamente com status _403 Forbidden_.
- **Renovação Transparente**: Atualização automatizada da sessão por meio do interceptador global HTTP quando o token expira.
- **Perfil do Usuário**: Acesso seguro aos dados cadastrais e atualização de informações com suporte a upload de mídia.
- **Logout**: Revogação da sessão na API do Supabase e destruição imediata dos cookies locais do navegador.
- **Acesso Restrito**: Proteção baseada em rotas privadas no ecossistema React Router para autopublicação, painel administrativo e visualização de dados sensíveis.

## Autenticação com Google

O botão de login solicita ao backend uma URL OAuth do Supabase. Depois da autorização, o Supabase redireciona o navegador para `/auth/callback` no frontend, que troca o código ou os tokens por uma sessão e cookies gerenciados pelo backend.

Para habilitar esse fluxo:

1. No Google Cloud Console, crie um cliente OAuth do tipo **Aplicativo da Web**. Em **URIs de redirecionamento autorizados**, adicione `https://<project-ref>.supabase.co/auth/v1/callback` (substitua `<project-ref>` pelo identificador do projeto Supabase).
2. No Supabase, abra **Authentication > Sign In / Providers > Google**, habilite o provedor e informe o Client ID e o Client Secret gerados pelo Google. O segredo deve permanecer no painel Supabase; não o adicione a `frontend/.env*`, nem com prefixo `VITE_`.
3. Em **Authentication > URL Configuration** no Supabase, configure o Site URL com a origem do frontend de produção e adicione à lista de Redirect URLs todos os callbacks utilizados, por exemplo `http://localhost:5173/auth/callback` e `https://<dominio-do-frontend>/auth/callback`.
4. Configure `VITE_API_URL` no ambiente de produção do frontend e `FRONTEND_URL` e `BACKEND_URL` no ambiente do backend. Em desenvolvimento local, o frontend usa `http://localhost:3000` como backend padrão e o callback é construído com a origem atual.

O endereço `/auth/callback` pertence à aplicação. O endereço `/auth/v1/callback` do projeto Supabase pertence ao retorno configurado no Google Cloud Console; eles não são intercambiáveis.

---

## Detalhes Técnicos de Infraestrutura

- **Cookies HttpOnly**: Os tokens são injetados sob as chaves `auth-token` e `refresh-token` com a propriedade `httpOnly` ativada, bloqueando o acesso de scripts maliciosos (XSS).
- **SameSite e Secure**: Configurações locais parametrizadas (`sameSite: 'lax'` e `secure: false` para localhost) que viabilizam o tráfego seguro de credenciais entre portas diferentes no ambiente de desenvolvimento.
- **Gerenciamento Dinâmico de Atores**: O interceptador da API inspeciona o _pathname_ da requisição atual para redirecionar o usuário à tela correta (`/auth/login` para clientes ou `/auth/admin` para administradores) caso a tentativa de renovação de sessão falhe.
- **Isolamento de Persistência**: O cliente do Supabase no frontend opera com a gravação local desativada (`persistSession: false`), garantindo que a responsabilidade de manter o estado da sessão pertença exclusivamente aos cookies geridos pelo backend Express.
- **Middlewares de Segurança**:
  - `checkAuth`: Intercepta, valida e decodifica o cookie `auth-token`, anexando as informações essenciais do usuário à requisição (`req.user`).
  - `checkAdmin`: Aplicado obrigatoriamente no diretório `src/Admin`. Este interceptor inspeciona a tabela `users_profile` após a execução do `checkAuth` e barra a requisição caso os sinalizadores `is_admin` ou `is_master` retornem falsos.
