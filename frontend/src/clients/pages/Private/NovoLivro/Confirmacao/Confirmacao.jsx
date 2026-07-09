import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../../../components/form/Input/Input";

export default function Confirmacao({ dadosLivro, irParaEtapaEspecifica, publicarLivro }) {
  const [urlPreviewManga, setUrlPreviewManga] = useState(null);
  const [urlPreviewCapa, setUrlPreviewCapa] = useState(null);

  useEffect(() => {
    let urlManga = null;
    let urlCapa = null;

    if (dadosLivro.conteudo?.manuscrito instanceof File) {
      urlManga = URL.createObjectURL(dadosLivro.conteudo.manuscrito);
      setUrlPreviewManga(urlManga);
    } else if (typeof dadosLivro.conteudo?.manuscrito === "string") {
      setUrlPreviewManga(dadosLivro.conteudo.manuscrito);
    }

    if (dadosLivro.conteudo?.capa instanceof File) {
      urlCapa = URL.createObjectURL(dadosLivro.conteudo.capa);
      setUrlPreviewCapa(urlCapa);
    } else if (typeof dadosLivro.conteudo?.capa === "string") {
      setUrlPreviewCapa(dadosLivro.conteudo.capa);
    }

    return () => {
      if (urlManga) URL.revokeObjectURL(urlManga);
      if (urlCapa) URL.revokeObjectURL(urlCapa);
    };
  }, [dadosLivro.conteudo?.manuscrito, dadosLivro.conteudo?.capa]);

  return (
    <main>
      <h1>Confirmação</h1>
      <div>
        Formato: {dadosLivro.formato}
        <button onClick={() => irParaEtapaEspecifica(1)}>Editar</button>
      </div>
      <div>
        Detalhes:
        {dadosLivro.detalhes && (
          <ul>
            <li>Título: {dadosLivro.detalhes.titulo}</li>
            <li>Subtítulo: {dadosLivro.detalhes.subtitulo}</li>
            <li>Descrição: {dadosLivro.detalhes.descricao}</li>
            <li>Idioma: {dadosLivro.detalhes.idioma}</li>
            <li>Direito de Publicação: {dadosLivro.detalhes.direitoPublicacao}</li>
            <li>Autor: {dadosLivro.detalhes.autor?.nome} {dadosLivro.detalhes.autor?.sobrenome}</li>
            <li>
              Colaboradores: {dadosLivro.detalhes.colaboradores?.map(c => `${c.nome} ${c.sobrenome} (${c.funcao})`).join(", ") || "Nenhum"}
            </li>
            <li>Publico Principal: {dadosLivro.detalhes.publicoPrincipal}</li>
            <li>Categorias: {dadosLivro.detalhes.categorias?.join(", ")}</li>
            <li>Palavras-chave: {dadosLivro.detalhes.palavrasChave?.join(", ")}</li>
          </ul>
        )}
        <button onClick={() => irParaEtapaEspecifica(2)}>Editar</button>
      </div>
      <div>
        <div>
          <div>
            <p><strong>Manuscrito:</strong> {dadosLivro.conteudo?.manuscrito ? "Arquivo carregado" : "Não enviado"}</p>
            {urlPreviewManga && (
              <iframe src={urlPreviewManga} title="Pré-visualização do Manuscrito" type="application/pdf" />
            )}
          </div>
          <div>
            <p><strong>Capa:</strong> {dadosLivro.conteudo?.capa ? "Imagem carregada" : "Não enviada"}</p>
            {urlPreviewCapa && (
              <img src={urlPreviewCapa} alt="Pré-visualização da Capa" />
            )}
          </div>
          <button onClick={() => irParaEtapaEspecifica(3)}>Editar</button>
        </div>
      </div>
      <div>
        Orçamento:{dadosLivro.orcamento && (
          <ul>
            <li>Tipo de Formatação: {dadosLivro.orcamento.tipoFormatacao}</li>
            <li>Valor do Livro Físico: {dadosLivro.orcamento.valorLivroFisico}</li>
            <li>Valor do Livro Digital: {dadosLivro.orcamento.valorLivroDigital}</li>
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
