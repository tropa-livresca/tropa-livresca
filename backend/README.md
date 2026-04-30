# Configuração do arquivo `.env`

Para configurar o ambiente do projeto, siga os passos abaixo:
    
1. **Crie um arquivo `.env` na raiz do projeto**  
    Caso não exista, crie um novo arquivo chamado `.env` no diretório principal do backend.

2. **Adicione as variáveis de ambiente necessárias**  
    Insira as variáveis conforme o exemplo abaixo, ajustando os valores conforme sua necessidade:

    ```env
    # Exemplo de configuração
    DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
    JWT_SECRET=sua_chave_secreta
    PORT=3000
    ```

3. **Salve o arquivo**  
    Certifique-se de salvar o arquivo após inserir as informações.

4. **Não compartilhe o `.env  `**  
    O arquivo `.env` contém informações sensíveis. Não o envie para repositórios públicos.

5. **Execute o projeto**  
    Com o `.env` configurado, execute o projeto normalmente conforme as instruções do README principal.

> Consulte a documentação do projeto para saber todas as variáveis necessárias.