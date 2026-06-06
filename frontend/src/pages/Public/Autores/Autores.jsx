import styles from "./Autores.module.css";
import {useAutor} from "../../../hooks/useAutor";

import { useEffect, useState } from "react";
import Cabecalho from "../../../components/layout/Cabecalho/Cabecalho";

export default function Autores() {
  const { autores, carregando, erro } = useAutor();

  if (carregando) return <p>Carregando...</p>

  if(erro) return <p>{erro}</p>

  if (autores.length === 0) return <p>Nenhum autor cadastrado</p>

  return (
    <div>
      <Cabecalho nome="Autores" descricao="Conheça nossos autores" />
      <main>
        <div className={styles.container}>
          <div className={styles.subtitulo}>
            <h4>
              A editora Tropa Livresca reúne autores independentes de todo o
              Brasil . Descubra escritores que compartilham histórias únicas,
              cheias de emoção e originalidade em suas obras. Autopublicação com
              qualidade editorial e reconhecimento!
            </h4>
          </div>
          <div className={styles.barrasearch}>
            <input
              type="text"
              placeholder="Pesquisar..."
              className={styles.inputsearch}
            />
            <button type="submit" className={styles.buttonsearch}>
              🔍
            </button>
          </div>
          <div className={styles.containerautores}>
            {autores.map((autor) => (
              <div key={autor.id} className={styles.autor}>
                {autor.imagem ? (<img src={autor.imagem} alt={autor.nome} />) : (<div>Sem foto</div>)}
                <h3>{autor.nome || "Autor anônimo"}</h3>
                <p>{autor.descricao || "Sem descrição"}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
