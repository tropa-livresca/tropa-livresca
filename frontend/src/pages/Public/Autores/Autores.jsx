import styles from "./Autores.module.css";
import Cabecalho from "../../../components/layout/Cabecalho/Cabecalho";
export default function Autores (){
  return (
    <div>
      <Cabecalho nome = "Autores" descricao = "Conheça nossos autores"/>
      <main>
        <div className={styles.h1}>
          <h1>Autores</h1>
          <div className={styles.autores}>
          </div>
        </div>
      </main>
    </div>
  )
}
