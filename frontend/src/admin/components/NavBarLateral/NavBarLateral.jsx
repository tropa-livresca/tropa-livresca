import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import styles from "./NavBarLateral.module.css";
import useAdmin from "../../../common/hooks/useAdmin";

export default function NavBarLateral() {
  const { user } = useAdmin();
  const isMaster = !!user?.is_master;

  const [livrosAberto, setLivrosAberto] = useState(false);
  const [ecommerceAberto, setEcommerceAberto] = useState(false);
  const [analisesAberto, setAnalisesAberto] = useState(false);

  return (
    <div className={styles.menu}>
      <div className={styles.titulo}>Geral</div>

      {isMaster && (
        <Link to="/admin/usuarios">
          <div className={styles.itemMenu}>Usuários</div>
        </Link>
      )}

      <div
        className={styles.itemMenu}
        onClick={() => setLivrosAberto(!livrosAberto)}
      >
        Livros
        <FaChevronDown
          className={`${styles.seta} ${livrosAberto ? styles.setaAberta : ""}`}
        />
      </div>

      {livrosAberto && (
        <div className={styles.subMenu}>
          <Link to="/admin/livros/painel" className={styles.subItem}>
            Painel Livros
          </Link>

          <Link to="/admin/livros/revisoes" className={styles.subItem}>
            Revisões
          </Link>
        </div>
      )}

      <div className={`${styles.titulo} ${styles.tituloAdministracao}`}>
        Administração
      </div>

      <div
        className={styles.itemMenu}
        onClick={() => setEcommerceAberto(!ecommerceAberto)}
      >
        E-commerce
        <FaChevronDown
          className={`${styles.seta} ${
            ecommerceAberto ? styles.setaAberta : ""
          }`}
        />
      </div>

      {ecommerceAberto && (
        <div className={styles.subMenu}>
          <Link to="/admin/ecommerce/pedidos" className={styles.subItem}>
            Pedidos e Entregas
          </Link>
        </div>
      )}

      {isMaster && (
        <>
          <div
            className={styles.itemMenu}
            onClick={() => setAnalisesAberto(!analisesAberto)}
          >
            Desempenho
            <FaChevronDown
              className={`${styles.seta} ${
                analisesAberto ? styles.setaAberta : ""
              }`}
            />
          </div>

          {analisesAberto && (
            <div className={styles.subMenu}>
              <Link to="/admin/analises/financeiro" className={styles.subItem}>
                Financeiro
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
