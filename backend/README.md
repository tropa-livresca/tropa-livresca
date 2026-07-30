# Configuração do Arquivo .env

Para configurar o ambiente de desenvolvimento do backend, siga as instruções abaixo:

---

## Passo a Passo para Configuração

1. Criação do Arquivo: Crie um novo arquivo chamado `.env` diretamente no diretório principal da pasta backend.
2. Inserção de Chaves: Adicione as variáveis de infraestrutura necessárias baseando-se no modelo de propriedades listado abaixo.
3. Salvamento de Dados: Salve as modificações realizadas no arquivo para que o módulo dotenv consiga ler as configurações.
4. Segurança de Credenciais: Certifique-se de que o arquivo está listado no `.gitignore` para bloquear o envio a repositórios públicos.
5. Inicialização do Servidor: Com o ambiente definido, inicie o backend em modo de desenvolvimento utilizando os comandos padrão do projeto.

---

## Modelo Base de Configuração (`backend/.env`)

Substitua os valores fictícios pelas credenciais correspondentes do seu ambiente local e do seu projeto no Supabase:

```env
# Configurações do Servidor Local
PORT=3000
NODE_ENV=development

# Integração com a Infraestrutura do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima-ficticia
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-ficticia
SUPABASE_REDIRECT_URL=http://localhost:5173/confirmacao-email

# Segurança e Criptografia
MINHA_CHAVE_SUPER_SECRETA=b42ad8109312923b374b031d3c597710b8c80a0def542caf0b1a36fdca33e6a8
JWT_SECRET=sua-jwt-key

# Configurações do Serviço de E-mail (SMTP / Nodemailer)
SMTP_HOST=seu-smtp
SMTP_PORT=sua-porta-smtp
SMTP_USER=seu-smtp-user
SMTP_PASS=seu-smtp-password
```

> Nunca compartilhe, versione ou envie o arquivo `.env` contendo credenciais ativas para plataformas de hospedagem de código.
