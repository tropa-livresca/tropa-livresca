import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../../../components/form/Input/Input";

export default function Confirmacao({ dados, irParaEtapaEspecifica, publicarLivro }) {
  const [urlPreviewManga, setUrlPreviewManga] = useState(null);
  const [urlPreviewFrente, setUrlPreviewFrente] = useState(null);
  const [urlPreviewVerso, setUrlPreviewVerso] = useState(null);
  const [urlPreviewOrelhas, setUrlPreviewOrelhas] = useState(null);

  useEffect(() => {
    let urlManga = null;
    let urlFrente = null;
    let urlVerso = null;
    let urlOrelhas = null;

    // Correção: Verifica "dado" (parâmetro) em vez de "dados" (escopo pai)
    const extrairArquivo = (dado) => {
      if (!dado) return null;

      // Se já for um arquivo direto (File), retorna ele
      if (dado instanceof File) return dado;

      // CORREÇÃO: Se for uma FileList, extrai o primeiro arquivo [0] dela
      if (dado instanceof FileList && dado.length > 0) return dado[0];

      // Caso o dado venha como um Array tradicional do JS
      if (Array.isArray(dado) && dado.length > 0) return dado[0];

      // Se o seu componente customizado <Input /> envelopar o arquivo em algum objeto
      if (dado[0] instanceof File) return dado[0];

      return null;
    };

    // Correção 1: Declarando as variáveis antes de usá-las
    const arquivoManuscrito = extrairArquivo(dados.conteudo?.manuscrito);
    const arquivoFrente = extrairArquivo(dados.conteudo?.capa?.frente);
    const arquivoVerso = extrairArquivo(dados.conteudo?.capa?.verso);
    const arquivoOrelhas = extrairArquivo(dados.conteudo?.capa?.orelhas);

    // Processamento do Manuscrito (Adicionado de volta)
    if (arquivoManuscrito) {
      urlManga = URL.createObjectURL(arquivoManuscrito);
      setUrlPreviewManga(urlManga);
    } else if (typeof dados.conteudo?.manuscrito === "string") {
      setUrlPreviewManga(dados.conteudo.manuscrito);
    } else {
      setUrlPreviewManga(null);
    }

    // Processamento da Frente (Correção: URL.createObjectURL e setUrlPreviewFrente)
    if (arquivoFrente) {
      urlFrente = URL.createObjectURL(arquivoFrente);
      setUrlPreviewFrente(urlFrente);
    } else if (typeof dados.conteudo?.capa?.frente === "string") {
      setUrlPreviewFrente(dados.conteudo.capa.frente);
    } else {
      setUrlPreviewFrente(null);
    }

    // Processamento do Verso
    if (arquivoVerso) {
      urlVerso = URL.createObjectURL(arquivoVerso);
      setUrlPreviewVerso(urlVerso);
    } else if (typeof dados.conteudo?.capa?.verso === "string") {
      setUrlPreviewVerso(dados.conteudo.capa.verso);
    } else {
      setUrlPreviewVerso(null);
    }

    // Processamento das Orelhas (Correção: Vinculação correta das variáveis das orelhas)
    if (arquivoOrelhas) {
      urlOrelhas = URL.createObjectURL(arquivoOrelhas);
      setUrlPreviewOrelhas(urlOrelhas);
    } else if (typeof dados.conteudo?.capa?.orelhas === "string") {
      setUrlPreviewOrelhas(dados.conteudo.capa.orelhas);
    } else {
      setUrlPreviewOrelhas(null);
    }

    return () => {
      if (urlManga) URL.revokeObjectURL(urlManga);
      if (urlFrente) URL.revokeObjectURL(urlFrente);
      if (urlVerso) URL.revokeObjectURL(urlVerso);
      if (urlOrelhas) URL.revokeObjectURL(urlOrelhas);
    };
  }, [dados.conteudo]);

  const temAlgumaCapa = dados.conteudo?.capa?.frente || dados.conteudo?.capa?.verso || dados.conteudo?.capa?.orelhas;

  return (
    <main>
      <h1>Confirmação</h1>
      <div>
        Formato: {dados.formato?.tipoPublicacao || "Não definido"}
        <button onClick={() => irParaEtapaEspecifica(1)}>Editar</button>
      </div>
      <div>
        Detalhes:
        {dados.detalhes && (
          <ul>
            <li>Título: {dados.detalhes.titulo}</li>
            <li>Subtítulo: {dados.detalhes.subtitulo}</li>
            <li>Descrição: {dados.detalhes.descricao}</li>
            <li>Idioma: {dados.detalhes.idioma}</li>
            <li>Direito de Publicação: {dados.detalhes.direitoPublicacao}</li>
            <li>Autor: {dados.detalhes.autor?.nome} {dados.detalhes.autor?.sobrenome}</li>
            <li>
              Colaboradores: {dados.detalhes.colaboradores?.map(c => `${c.nome} ${c.sobrenome} (${c.funcao})`).join(", ") || "Nenhum"}
            </li>
            <li>Publico Principal: {dados.detalhes.publicoPrincipal}</li>
            <li>Categorias: {dados.detalhes.categorias?.join(", ")}</li>
            <li>Palavras-chave: {dados.detalhes.palavrasChave?.join(", ")}</li>
          </ul>
        )}
        <button onClick={() => irParaEtapaEspecifica(2)}>Editar</button>
      </div>
      <div>
        <div>
          <div>
            <p><strong>Manuscrito:</strong> {dados.conteudo?.manuscrito ? "Arquivo carregado" : "Não enviado"}</p>
            {urlPreviewManga && (
              <iframe src={urlPreviewManga} title="Pré-visualização do Manuscrito" type="application/pdf" width="100%" height="200px" />
            )}
          </div>
          <p><strong>Imagens da Capa:</strong></p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {urlPreviewFrente && (
              <div>
                <p><small>Frente:</small></p>
                <img src={urlPreviewFrente} alt="Frente da Capa" width="150" />
              </div>
            )}
            {urlPreviewVerso && (
              <div>
                <p><small>Verso:</small></p>
                <img src={urlPreviewVerso} alt="Verso da Capa" width="150" />
              </div>
            )}
            {urlPreviewOrelhas && (
              <div>
                <p><small>Orelhas:</small></p>
                <img src={urlPreviewOrelhas} alt="Orelhas da Capa" width="150" />
              </div>
            )}
          </div>
          <button onClick={() => irParaEtapaEspecifica(3)}>Editar</button>
        </div>
      </div>
      <div>
        Orçamento:{dados.orcamento && (
          <ul>
            <li>Tipo de Formatação: {dados.orcamento.tipoFormatacao}</li>
            <li>Valor do Livro Físico: {dados.orcamento.valorLivroFisico}</li>
            <li>Valor do Livro Digital: {dados.orcamento.valorLivroDigital}</li>
          </ul>
        )}
        <button onClick={() => irParaEtapaEspecifica(4)}>Editar</button>
      </div>
      <div>
        <button type="button" onClick={() => publicarLivro(true)}>Publicar Livro</button>
        <button type="button" onClick={() => publicarLivro(false)}>Salvar como Rascunho</button>
      </div>
    </main>
  );
}
