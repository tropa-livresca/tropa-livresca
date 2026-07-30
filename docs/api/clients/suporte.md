# API - Canal de Suporte

Este documento detalha o endpoint de comunicação direta e envio de chamados integrado ao serviço de atendimento ao cliente (Clients) da plataforma Tropa Livresca.

---

## Visão Geral

* Acesso Público: Este endpoint é totalmente público, permitindo que usuários que enfrentem dificuldades de acesso ou problemas cadastrais entrem em contato sem necessidade de autenticação prévia.
* Disparo Assíncrono: O processamento do chamado é delegado à camada de serviços, que utiliza o Nodemailer para disparar e-mails formatados diretamente para a caixa postal da equipe editorial.
* Prefixo do Endpoint: Esta rota responde sob o caminho base completo `/api/v1/clients/suporte`.

---

## Tabela de Endpoints

| Método | Endpoint | Protegido | Descrição |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/clients/suporte/enviarEmail` | Não | Recebe as informações do formulário e realiza o disparo do e-mail de suporte. |

---

## Contratos de Dados e Comportamento Técnico

### POST `/enviarEmail`
* Payload Esperado (JSON):
  ```json
  {
    "nome": "Fulano de Tal",
    "email": "cliente@teste.com",
    "assunto": "Dificuldade no Login",
    "mensagem": "Não consigo acessar a área de autopublicação."
  }
  ```
* Resposta de Sucesso: Status `200 OK` retornando um objeto estruturado contendo a confirmação do envio e o identificador da mensagem gerado pelo servidor SMTP:
  ```json
  {
    "status": "success",
    "message": "Sua mensagem de suporte foi enviada com sucesso!",
    "responseId": "email-id-789"
  }
  ```
* Regras de Exceção:
  * Caso o serviço de mensageria externo enfrente instabilidades, o `SuporteService` lança uma exceção repassada com status `503 Service Unavailable` e a mensagem `"Serviço de e-mail indisponível."`.
  * Se a estrutura do corpo da requisição falhar nas validações internas, o manipulador global devolve status `400 Bad Request` com a mensagem `"Falha ao processar o chamado."`.

---

## Observações Gerais

* Camada de Serviços: O controlador `SuporteController` atua estritamente como um intermediário HTTP, delegando o ciclo completo de montagem do template de e-mail e autenticação SMTP para a função `processarChamado` dentro do `SuporteService`.
* Roteamento Dedicado: O endpoint está acoplado ao arquivo de rotas isolado do módulo, garantindo que o prefixo `/suporte/enviarEmail` permaneça consistente com a arquitetura definida para as demais funcionalidades do cliente.
