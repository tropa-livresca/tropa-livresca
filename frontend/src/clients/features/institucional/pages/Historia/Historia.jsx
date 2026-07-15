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
              A origem da empresa Tropa Livresca por Moisés Ãlvaro Pereira e
              Adilson Silva Pereira remonta antes de sua oficializaÃ§Ã£o durante a
              pandemia.
            </p>
          </div>

          <div className={styles.img}>
            <img src={his1} alt="" />
          </div>
        </div>

        <div className={styles.bloco}>
          <div className={styles.img}>
            <img src={his2} alt="" />
          </div>
          <div className={styles.texto}>
            <h2>O comeÃ§o</h2>
            <p>
              A iniciativa partiu de Moisés ao perceber que a impressÃ£o de
              documentos para amigos e familiares oferecia um negÃ³cio rentÃ¡vel,
              tanto assim que, em agosto de 2005, ele decidiu montar a GrÃ¡fica
              Regional, convidando para sÃ³cio o amigo Adilson.Â  Situada no
              centro de Taquarituba (SP), a grÃ¡fica trabalhava na impressÃ£o de
              livros sob demanda e na personalizaÃ§Ã£o de roupas, cerÃ¢mica e
              acrÃ­lico.
            </p>
          </div>
        </div>

        <div className={styles.bloco}>
          <div className={styles.texto}>
            <h2>Nova fase</h2>
            <p>
              A partir de 2009, no entanto, eles resolveram restringir os
              serviÃ§os da empresa Ã  editoraÃ§Ã£o, o que lhes impÃ´s a necessidade
              de alterar o nome do empreendimento. Originalmente, pensaram em
              intitulÃ¡-la como â€œGrÃ¡fica Dois Amigosâ€ ou â€œGrÃ¡fica e Livraria
              (GL)â€, porém, após assistirem a alguns tropeiros numa festa do
              PeÃ£o, concordaram em batizÃ¡-la como â€œTropa Livrescaâ€ em alusÃ£o Ã
              tradiÃ§Ã£o local, o que se deu formalmente em 14 de Julho de 2009.
              Acompanharam essas mudanÃ§as a reforma do lugar, a obtenÃ§Ã£o de
              mÃ¡quinas e o aumento do nÃºmero de funcionÃ¡rios.
            </p>
          </div>

          <div className={styles.img}>
            <img src={his3} alt="" />
          </div>
        </div>

        <div className={styles.bloco}>
          <div className={styles.img}>
            <img src={his4} alt="" />
          </div>
          <div className={styles.texto}>
            <h2>Atualmente</h2>
            <p>
              A empresa Tropa Livresca, apesar do perÃ­odo pandÃªmico de 2021 até
              meados de 2023 e de vÃ¡rios cortes decorrentes dele, conseguiu
              manter-se aberta. A experiÃªncia, todavia, revelou-lhes a
              imprescindibilidade de adaptarem-se Ã  tendÃªncia de digitalizaÃ§Ã£o
              de serviÃ§os. Por essa razÃ£o, a editora atualmente procura abraÃ§ar
              a publicaÃ§Ã£o independente nÃ£o sÃ³ fÃ­sica, mas também virtualmente,
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
          A origem da empresa Tropa Livresca por Moisés Ãlvaro Pereira e Adilson
          Silva Pereira remonta antes de sua oficializaÃ§Ã£o durante a pandemia.
        </p>
        <img />
      </span>
      <span>
        <img />
        <p>
          A iniciativa partiu de Moisés ao perceber que a impressÃ£o de
          documentos para amigos e familiares oferecia um negÃ³cio rentÃ¡vel,
          tanto assim que, em agosto de 2005, ele decidiu montar a GrÃ¡fica
          Regional, convidando para sÃ³cio o amigo Adilson. Situada no centro de
          Taquarituba (SP), a grÃ¡fica trabalhava na impressÃ£o de livros sob
          demanda e na personalizaÃ§Ã£o de roupas, cerÃ¢mica e acrÃ­lico.
        </p>
      </span>
      <span>
        <p>
          A partir de 2009, no entanto, eles resolveram restringir os serviÃ§os
          da empresa Ã  editoraÃ§Ã£o, o que lhes impÃ´s a necessidade de alterar o
          nome do empreendimento. Originalmente, pensaram em intitulÃ¡-la como
          â€œGrÃ¡fica Dois Amigosâ€ ou â€œGrÃ¡fica e Livraria (GL)â€, porém, após
          assistirem a alguns tropeiros numa festa do PeÃ£o, concordaram em
          batizÃ¡-la como â€œTropa Livrescaâ€ em alusÃ£o Ã  tradiÃ§Ã£o local, o que se
          deu formalmente em 14 de Julho de 2009. Acompanharam essas mudanÃ§as a
          reforma do lugar, a obtenÃ§Ã£o de mÃ¡quinas e o aumento do nÃºmero de
          funcionÃ¡rios.
        </p>
        <img />
      </span>
      <span>
        <img />
        <p>A empresa Tropa Livresca, apesar do perÃ­odo pandÃªmico de 2021 até meados de 2023 e de vÃ¡rios cortes decorrentes dele, conseguiu manter-se aberta. A experiÃªncia, todavia, revelou-lhes a imprescindibilidade de adaptarem-se Ã  tendÃªncia de digitalizaÃ§Ã£o de serviÃ§os. Por essa razÃ£o, a editora atualmente procura abraÃ§ar a publicaÃ§Ã£o independente nÃ£o sÃ³ fÃ­sica, mas também virtualmente, por meio de um site.</p>
      </span>*/
}




