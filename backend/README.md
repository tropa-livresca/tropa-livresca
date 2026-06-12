# Configuração do arquivo `.env`

Para configurar o ambiente do backend, siga os passos abaixo:

1. **Crie um arquivo `.env` na raiz do projeto**
   Se ainda não existir, crie um novo arquivo chamado `.env` no diretório principal do backend.

2. **Adicione as variáveis de ambiente necessárias**  
    Insira as variáveis conforme o exemplo abaixo, ajustando os valores conforme sua necessidade:

    ```env
    # Exemplo de configuração
    DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
    JWT_SECRET=sua_chave_secreta
    PORT=3000
    NODE_ENV=development
    API_URL=http://localhost:3000
    ```

3. **Salve o arquivo**
   Salve o arquivo após inserir as informações.

4. **Proteja o arquivo**
   O `.env` contém dados sensíveis e não deve ser enviado a repositórios públicos.

5. **Execute o backend**
   Com o `.env` configurado, inicie o projeto conforme as instruções do README principal.

> Consulte a documentação do projeto para conhecer todas as variáveis de ambiente necessárias.