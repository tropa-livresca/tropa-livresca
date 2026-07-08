import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../../../components/form/Input/Input";
import styles from "./Confirmacao.module.css";
export default function Confirmacao({ dadosLivro, irParaEtapaEspecifica, publicarLivro }) {

  const urlPreviewManga = dadosLivro.conteudo?.manuscrito ? URL.createObjectURL(dadosLivro.conteudo.manuscrito) : null;
  const urlPreviewCapa = dadosLivro.conteudo?.capa ? URL.createObjectURL(dadosLivro.conteudo.capa) : null;

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
            <li>Autor: {dadosLivro.detalhes.autor.nome} {dadosLivro.detalhes.autor.sobrenome}</li>
            <li>Colaboradores: {dadosLivro.detalhes.colaboradores.join(", ")}</li>
            <li>Publico Principal: {dadosLivro.detalhes.publicoPrincipal}</li>
            <li>Categorias: {dadosLivro.detalhes.categorias.join(", ")}</li>
            <li>Palavras-chave: {dadosLivro.detalhes.palavrasChave.join(", ")}</li>
          </ul>
        )}
        <button onClick={() => irParaEtapaEspecifica(2)}>Editar</button>
      </div>
      <div>
        <div>
          <div>
            <p><strong>Manuscrito:</strong> {dadosLivro.conteudo?.manuscrito ? "Arquivo carregado" : "Não enviado"}</p>
            {urlPreviewManga && (
              <iframe src={urlPreviewManga} title="Pré-visualização do Manuscrito" style={styles.pdfPreview} />
            )}
          </div>
          <div>
            <p><strong>Capa:</strong> {dadosLivro.conteudo?.capa ? "Imagem carregada" : "Não enviada"}</p>
            {urlPreviewCapa && (
              <img src={urlPreviewCapa} alt="Pré-visualização da Capa" style={styles.imgPreview} />
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
