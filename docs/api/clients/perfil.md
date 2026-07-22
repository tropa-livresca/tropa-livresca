# API - Perfil de Usuários

Este documento detalha os endpoints de consulta e atualização cadastral voltados para a área logada do usuário comum (Clients) da plataforma Tropa Livresca.

---

## Visão Geral

* Proteção Estrita: Ambas as rotas são totalmente privadas e exigem a presença do cookie de sessão `auth-token` válido para a correta identificação do usuário.
* Identificação Segura: O backend não depende de IDs enviados no corpo ou na query da requisição; o identificador do usuário é extraído diretamente do token descriptografado pelo middleware de autenticação (`req.user.id`).
* Upload de Arquivos: O endpoint de atualização é híbrido, aceitando tanto campos textuais comuns quanto arquivos binários de mídia para a foto de perfil.
* Prefixo dos Endpoints: Todas as rotas deste módulo respondem sob o caminho base `/api/v1/clients/perfil`.

---

## Tabela de Endpoints

| Método | Endpoint | Protegido | Descrição |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/clients/perfil/` | Sim | Recupera as informações cadastrais e sociais do usuário autenticado. |
| PUT | `/api/v1/clients/perfil/` | Sim | Modifica os dados textuais do perfil e/ou atualiza a imagem de avatar. |

---

## Contratos de Dados e Comportamento Técnico

### GET `/` (Consulta de Perfil)
* Requisito de Cabeçalho: O navegador deve encaminhar automaticamente o cookie `auth-token` ativo.
* Resposta de Sucesso: Status `200 OK` retornando o objeto contendo as informações de perfil vinculadas no banco:
  ```json
  {
    "id": "perfil-999",
    "userId": "user-abc-123",
    "nome": "Clarice Lispector",
    "telefone": "11999999999",
    "descricao": "Escritora de ficção e crônicas.",
    "redes_sociais": {
      "linkedin": "link-perfil",
      "instagram": "arroba-perfil"
    }
  }
  ```
* Regra de Exceção: Caso o perfil não seja localizado na base de dados, o `PerfilService` dispara uma exceção que o middleware global converte em status `404 Not Found` com a mensagem `"Perfil não encontrado."`.

### PUT `/` (Atualização de Perfil)
* Tipo de Conteúdo (Content-Type): Exige obrigatoriamente a formatação `multipart/form-data`.
* Payload Esperado (Form-Data):
  * `nome`: String contendo o nome atualizado do usuário (Opcional).
  * `telefone`: String contendo o telefone formatado (Opcional).
  * `descricao`: Texto descritivo/biográfico para o perfil (Opcional).
  * `redes_sociais`: Objeto estruturado ou String JSON contendo os links das redes (Opcional).
  * `imagem`: Arquivo binário contendo a foto de perfil (Opcional, capturado sob a chave `req.file` pelo Multer através da configuração `upload.single('imagem')`).
* Resposta de Sucesso: Status `200 OK` devolvendo o objeto consolidado com todas as alterações persistidas com sucesso na camada do Supabase.
* Regra de Exceção: Se o processo de persistência falhar ou os dados enviados estiverem corrompidos, o manipulador global devolve status `400 Bad Request` com a mensagem `"Falha ao salvar as alterações do perfil."`.

---

## Observações Gerais

* Middleware Interceptador: A rota de escrita aplica sequencialmente o middleware `checkAuth` e o utilitário do Multer `upload.single('imagem')`. Isso garante que o arquivo seja isolado e validado em memória antes de ser encaminhado para processamento no `PerfilService`.
* Flexibilidade de Envio: Se nenhuma imagem for enviada no campo `imagem`, o serviço ignora o fluxo de armazenamento do Storage do Supabase e atualiza exclusivamente as propriedades textuais do `dadosPerfil` sem corromper a foto antiga.
