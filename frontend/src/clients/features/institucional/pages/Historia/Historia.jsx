import styles from "./Historia.module.css";

import his1 from "../../images/historia1.png";
import his2 from "../../images/historia2.png";
import his3 from "../../images/historia3.png";
import his4 from "../../images/historia4.png";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";

export default function Historia() {
  return (
    <main>
      <DescricaoTela
        titulo="Nossa História"
        descricao="
          Conheça a nossa história, nossos valores e o que nos move todos os
          dias."
      />

      <div className={styles.container}>
        <section className={styles.historiaSecao}>
          <div className={styles.timeline}>
            <article className={styles.bloco}>
              <div className={styles.imagem}>
                <img src={his1} alt="Origem da Tropa Livresca" />
              </div>

              <div className={styles.conteudo}>
                <div>
                  <h3>Nossa origem</h3>

                  <p>
                    A origem da empresa Tropa Livresca por Moisés Álvaro Pereira
                    e Adilson Silva Pereira remonta antes de sua oficialização
                    durante a pandemia.
                  </p>
                </div>
              </div>
            </article>

            <article className={`${styles.bloco} ${styles.invertido}`}>
              <div className={styles.imagem}>
                <img src={his2} alt="O começo da Gráfica Regional" />
              </div>

              <div className={styles.conteudo}>
                <div>
                  <h3>O começo</h3>

                  <p>
                    A iniciativa partiu de Moisés ao perceber que a impressão de
                    documentos para amigos e familiares oferecia um negócio
                    rentável, tanto assim que, em agosto de 2005, ele decidiu
                    montar a Gráfica Regional, convidando para sócio o amigo
                    Adilson.
                  </p>

                  <p>
                    Situada no centro de Taquarituba (SP), a gráfica trabalhava
                    na impressão de livros sob demanda e na personalização de
                    roupas, cerâmica e acrílico.
                  </p>
                </div>
              </div>
            </article>

            <article className={styles.bloco}>
              <div className={styles.imagem}>
                <img src={his3} alt="Nova fase da Tropa Livresca" />
              </div>

              <div className={styles.conteudo}>
                <div>
                  <h3>Nova fase</h3>

                  <p>
                    A partir de 2009, no entanto, eles resolveram restringir os
                    serviços da empresa à editoração, o que lhes impôs a
                    necessidade de alterar o nome do empreendimento.
                  </p>

                  <p>
                    Originalmente, pensaram em intitulá-la como “Gráfica Dois
                    Amigos” ou “Gráfica e Livraria (GL)”, porém, após assistirem
                    a alguns tropeiros numa festa do Peão, concordaram em
                    batizá-la como “Tropa Livresca”, em alusão à tradição local,
                    o que se deu formalmente em 14 de Julho de 2009.
                  </p>

                  <p>
                    Acompanharam essas mudanças a reforma do lugar, a obtenção
                    de máquinas e o aumento do número de funcionários.
                  </p>
                </div>
              </div>
            </article>

            <article className={`${styles.bloco} ${styles.invertido}`}>
              <div className={styles.imagem}>
                <img src={his4} alt="A Tropa Livresca atualmente" />
              </div>

              <div className={styles.conteudo}>
                <div>
                  <h3>Atualmente</h3>

                  <p>
                    A empresa Tropa Livresca, apesar do período pandêmico de
                    2021 até meados de 2023 e de vários cortes decorrentes dele,
                    conseguiu manter-se aberta.
                  </p>

                  <p>
                    A experiência, todavia, revelou-lhes a imprescindibilidade
                    de adaptarem-se à tendência de digitalização de serviços.
                  </p>

                  <p>
                    Por essa razão, a editora atualmente procura abraçar a
                    publicação independente não só física, mas também
                    virtualmente, por meio de um site.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.valores}>
          <div className={styles.tituloSecao}>
            <span>NOSSOS VALORES</span>

            <h2>O que nos move</h2>

            <p>
              Mais do que publicar livros, acreditamos no poder das histórias
              para aproximar pessoas.
            </p>
          </div>

          <div className={styles.valoresGrid}>
            <div className={styles.valor}>
              <div className={styles.icone}>♡</div>
              <h3>Amor pela literatura</h3>
              <p>Acreditamos no poder dos livros para transformar vidas.</p>
            </div>

            <div className={styles.valor}>
              <div className={styles.icone}>♧</div>
              <h3>Comunidade</h3>
              <p>
                Valorizamos pessoas, ideias e conexões construídas através da
                literatura.
              </p>
            </div>

            <div className={styles.valor}>
              <div className={styles.icone}>✦</div>
              <h3>Diversidade</h3>
              <p>
                Damos espaço para diferentes vozes, histórias e perspectivas.
              </p>
            </div>

            <div className={styles.valor}>
              <div className={styles.icone}>✧</div>
              <h3>Qualidade</h3>
              <p>
                Buscamos sempre entregar o melhor para nossos leitores e
                autores.
              </p>
            </div>
          </div>
        </section>
      </div>
      <section className={styles.final}>
        <div className={styles.finalImagem}>
          <img src={his4} alt="Livros da Tropa Livresca" />
        </div>

        <div className={styles.finalTexto}>
          <span>UMA HISTÓRIA QUE CONTINUA</span>

          <h2>
            Seguimos escrevendo
            <br />
            essa história com você.
          </h2>

          <p>
            Porque acreditamos que todo livro tem o poder de aproximar pessoas,
            transformar ideias e criar novas histórias.
          </p>

          <div className={styles.finalLinha}></div>
        </div>
      </section>
    </main>
  );
}
