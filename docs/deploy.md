# Deploy

O projeto foi implantado utilizando as plataformas Render e Vercel.

## Arquitetura de deploy

- Backend: hospedado no Render
- Frontend: hospedado na Vercel
- Banco de dados: Supabase

## Considerações principais

- O backend é responsável pela API e pelo processamento de regras de negócio.
- O frontend é publicado na Vercel para disponibilizar a interface web.
- As variáveis de ambiente de produção devem ser configuradas nas plataformas correspondentes.

## Configuração recomendada

### Render

- Definir as variáveis de ambiente necessárias para o backend.
- Configurar o comando de inicialização do servidor.
- Garantir que a aplicação esteja apontando para as credenciais corretas do Supabase.

### Vercel

- Definir as variáveis de ambiente do frontend.
- Configurar o build do projeto React/Vite.
- Garantir que a URL da API esteja correta no ambiente de produção.

## Observação

A implantação pode ser ajustada conforme a evolução do projeto e as necessidades de infraestrutura.
