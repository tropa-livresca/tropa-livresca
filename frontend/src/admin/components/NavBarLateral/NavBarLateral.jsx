import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./NavBarLateral.module.css";

export default function NavBarLateral({ aberto, aoFechar }) {
  const [funcionariosAberta, setFuncionariosAberta] = useState(false);

  const handleToggleFuncionarios = () => {
    setFuncionariosAberta(!funcionariosAberta);
  };

  return (
    <>
      {aberto && <div className={styles.overlay} onClick={aoFechar} />}

      <div className={`${styles.menu} ${aberto ? styles.aberto : ""}`}>
        <div className={styles.titulo}>Geral</div>

        <div className={styles.itemMenu} onClick={handleToggleFuncionarios}>
          <div>Usuários</div>

          {funcionariosAberta ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {funcionariosAberta && (
          <div className={styles.subMenu}>
            <div className={styles.subItem}>Nova Postagem</div>

            <div className={styles.subItem}>Gerenciar Posts</div>
          </div>
        )}

        <div className={styles.itemMenu} onClick={handleToggleFuncionarios}>
          <div>Funcionários</div>

          {funcionariosAberta ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {funcionariosAberta && (
          <div className={styles.subMenu}>
            <div className={styles.subItem}>Novo Funcionário</div>
            <div className={styles.subItem}>Gerenciar Funcionários</div>
          </div>
        )}
      </div>
    </>
  );
}
