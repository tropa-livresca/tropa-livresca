import styles from "./Inicio.module.css";

import LinkButton from "../../components/layout/LinkButton/LinkButton";
import Cadastro from "../cadastro/Cadastro";

import { useUsuarios } from "../../hooks/useUsuarios";

export default function Inicio() {
  
    const usuarios = useUsuarios();

    return (
    <section className={styles.inicio_container}>
      <h1>Início</h1>
      <h2>
        Bem-vindo à <span>Tropa Livresca</span>
      </h2>
      <p>Comece a gerenciar os seus projetos agora mesmo!</p>

      <Cadastro/>
      <LinkButton to="/seautopublique" text="Se Autopublique" />
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>{u.nome}</li>
        ))}
      </ul>
    </section>
  );
}
