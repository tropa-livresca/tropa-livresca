import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import styles from "./NavBarLateral.module.css";

export default function NavBarLateral() {
  const [usuariosAberto, setUsuariosAberto] = useState(false);
  const [funcionariosAberto, setFuncionariosAberto] = useState(false);
  const [livrosAberto, setLivrosAberto] = useState(false);
  const [ecommerceAberto, setEcommerceAberto] = useState(false);
  const [comunidadeAberto, setComunidadeAberto] = useState(false);
  const [analisesAberto, setAnalisesAberto] = useState(false);

  return (
    <div className={styles.menu}>
      <div className={styles.titulo}>Geral</div>

      <div
        className={styles.itemMenu}
        onClick={() => setUsuariosAberto(!usuariosAberto)}
      >
        Usuários
        <FaChevronDown
          className={`${styles.seta} ${
            usuariosAberto ? styles.setaAberta : ""
          }`}
        />
      </div>

      {usuariosAberto && (
        <div className={styles.subMenu}>
          <Link to="/admin/usuarios/novo" className={styles.subItem}>
            Novo Usuário
          </Link>

          <Link to="/admin/usuarios" className={styles.subItem}>
            Gerenciar Usuários
          </Link>
        </div>
      )}

      <div
        className={styles.itemMenu}
        onClick={() => setFuncionariosAberto(!funcionariosAberto)}
      >
        Funcionários
        <FaChevronDown
          className={`${styles.seta} ${
            funcionariosAberto ? styles.setaAberta : ""
          }`}
        />
      </div>

      {funcionariosAberto && (
        <div className={styles.subMenu}>
          <Link to="/admin/funcionarios/novo" className={styles.subItem}>
            Novo Funcionário
          </Link>

          <Link to="/admin/funcionarios" className={styles.subItem}>
            Gerenciar Funcionários
          </Link>
        </div>
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
          <Link to="/admin/categorias" className={styles.subItem}>
            Categorias
          </Link>

          <Link to="/admin/livros/painel" className={styles.subItem}>
            Painel Livros
          </Link>

          <Link to="/admin/livros/catalogo" className={styles.subItem}>
            Gerenciar Catálogo
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
            Gerenciar Pedidos
          </Link>

          <Link to="/admin/ecommerce/entregas" className={styles.subItem}>
            Monitorar Entregas
          </Link>

          <Link to="/admin/ecommerce/cupons" className={styles.subItem}>
            Gerenciar Cupons
          </Link>
        </div>
      )}

      <div
        className={styles.itemMenu}
        onClick={() => setComunidadeAberto(!comunidadeAberto)}
      >
        Comunidade e Suporte
        <FaChevronDown
          className={`${styles.seta} ${
            comunidadeAberto ? styles.setaAberta : ""
          }`}
        />
      </div>

      {comunidadeAberto && (
        <div className={styles.subMenu}>
          <Link
            to="/admin/comunidade/autores-leitores"
            className={styles.subItem}
          >
            Autores e Leitores
          </Link>

          <Link to="/admin/comunidade/notificacoes" className={styles.subItem}>
            Enviar Notificações
          </Link>

          <Link to="/admin/comunidade/contato" className={styles.subItem}>
            Formulários de Contato
          </Link>
        </div>
      )}

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
          <Link to="/admin/analises/relatorios" className={styles.subItem}>
            Relatórios Gerais
          </Link>
        </div>
      )}
    </div>
  );
}
