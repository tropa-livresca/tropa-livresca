import styles from "./Historia.module.css";

import his1 from "../../images/historia1.png";
import his2 from "../../images/historia2.png";
import his3 from "../../images/historia3.png";
import his4 from "../../images/historia4.png";

export default function Historia() {
  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Sobre Nós</h1>
      </div>

      <div className={styles.containerbloco}>
        <div className={styles.bloco}>
          <div className={styles.texto}>
            <h2>Nossa origem</h2>
            <p>
              A origem da empresa Tropa Livresca por Moisés Álvaro Pereira e
              Adilson Silva Pereira remonta antes de sua oficialização durante a
              pandemia.
            </p>
          </div>

          <div className={styles.img}>
            <img src={his1} alt="Origem da Tropa Livresca" />
          </div>
        </div>

        <div className={styles.bloco}>
          <div className={styles.img}>
            <img src={his2} alt="O começo da Gráfica" />
          </div>
          <div className={styles.texto}>
            <h2>O começo</h2>
            <p>
              A initiative partiu de Moisés ao perceber que a impressão de
              documentos para amigos e familiares oferecia um negócio rentável,
              tanto assim que, em agosto de 2005, ele decidiu montar a Gráfica
              Regional, convidando para sócio o amigo Adilson. Situada no
              centro de Taquarituba (SP), a gráfica trabalhava na impressão de
              livros sob demanda e na personalização de roupas, cerâmica e
              acrílico.
            </p>
          </div>
        </div>

        <div className={styles.bloco}>
          <div className={styles.texto}>
            <h2>Nova fase</h2>
            <p>
              A partir de 2009, no entanto, eles resolveram restringir os
              serviços da empresa à editoração, o que lhes impôs a necessidade
              de alterar o nome do empreendimento. Originalmente, pensaram em
              intitulá-la como “Gráfica Dois Amigos” ou “Gráfica e Livraria
              (GL)”, porém, após assistirem a alguns tropeiros numa festa do
              Peão, concordaram em batizá-la como “Tropa Livresca” em alusão à
              tradição local, o que se deu formalmente em 14 de Julho de 2009.
              Acompanharam essas mudanças a reforma do lugar, a obtenção de
              máquinas e o aumento do número de funcionários.
            </p>
          </div>

          <div className={styles.img}>
            <img src={his3} alt="Nova fase da Editora" />
          </div>
        </div>

        <div className={styles.bloco}>
          <div className={styles.img}>
            <img src={his4} alt="A Tropa Livresca Atualmente" />
          </div>
          <div className={styles.texto}>
            <h2>Atualmente</h2>
            <p>
              A empresa Tropa Livresca, apesar do período pandêmico de 2021 até
              meados de 2023 e de vários cortes decorrentes dele, conseguiu
              manter-se aberta. A experiência, todavia, revelou-lhes a
              imprescindibilidade de adaptarem-se à tendência de digitalização
              de serviços. Por essa razão, a editora atualmente procura abraçar
              a publicação independente não só física, mas também virtualmente,
              por meio de um site.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

{
  /*
  <span>
    <p>
      A origem da empresa Tropa Livresca por Moisés Álvaro Pereira e Adilson
      Silva Pereira remonta antes de sua oficialização durante a pandemia.
    </p>
    <img alt="" />
  </span>
  <span>
    <img alt="" />
    <p>
      A iniciativa partiu de Moisés ao perceber que a impressão de
      documentos para amigos e familiares oferecia um negócio rentável,
      tanto assim que, em agosto de 2005, ele decidiu montar a Gráfica
      Regional, convidando para sócio o amigo Adilson. Situada no centro de
      Taquarituba (SP), a gráfica trabalhava na impressão de livros sob
      demanda e na personalização de roupas, cerâmica e acrílico.
    </p>
  </span>
  <span>
    <p>
      A partir de 2009, no entanto, eles resolveram restringir os serviços
      da empresa à editoração, o que lhes impôs a necessidade de alterar o
      nome do empreendimento. Originalmente, pensaram em intitulá-la como
      “Gráfica Dois Amigos” ou “Gráfica e Livraria (GL)”, porém, após
      assistirem a alguns tropeiros numa festa do Peão, concordaram em
      batizá-la como “Tropa Livresca” em alusão à tradição local, o que se
      deu formalmente em 14 de Julho de 2009. Acompanharam essas mudanças a
      reforma do lugar, a obtenção de máquinas e o aumento do número de
      funcionários.
    </p>
    <img alt="" />
  </span>
  <span>
    <img alt="" />
    <p>A empresa Tropa Livresca, apesar do período pandêmico de 2021 até meados de 2023 e de vários cortes decorrentes dele, conseguiu manter-se aberta. A experiência, todavia, revelou-lhes a imprescindibilidade de adaptarem-se à tendência de digitalização de serviços. Por essa razão, a editora atualmente procura abraçar a publicação independente não só física, mas também virtualmente, por meio de um site.</p>
  </span>
  */
}
