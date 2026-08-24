import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./NavBarLateral.module.css";

export default function NavBarLateral({ aberto, aoFechar }) {
  const [usuariosAberto, setUsuariosAberto] = useState(false);
  const [funcionariosAberto, setFuncionariosAberto] = useState(false);
  const [livrosAberto, setLivrosAberto] = useState(false);
  const [ecommerceAberto, setEcommerceAberto] = useState(false);
  const [comunidadeAberto, setComunidadeAberto] = useState(false);
  const [analisesAberto, setAnalisesAberto] = useState(false);

  return (
    <>
      {aberto && <div className={styles.overlay} onClick={aoFechar} />}

      <div className={`${styles.menu} ${aberto ? styles.aberto : ""}`}>
        <div className={styles.titulo}>Geral</div>

        <div className={styles.itemMenu} onClick={() => setUsuariosAberto(!usuariosAberto)}>
          <div>Usuários</div>
          {usuariosAberto ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {usuariosAberto && (
          <div className={styles.subMenu}>
            <Link to="/admin/usuarios/novo" className={styles.subItem}>Novo Usuário</Link>
            <Link to="/admin/usuarios" className={styles.subItem}>Gerenciar Usuários</Link>
          </div>
        )}

        <div className={styles.itemMenu} onClick={() => setFuncionariosAberto(!funcionariosAberto)}>
          <div>Funcionários</div>
          {funcionariosAberto ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {funcionariosAberto && (
          <div className={styles.subMenu}>
            <Link to="/admin/funcionarios/novo" className={styles.subItem}>Novo Funcionário</Link>
            <Link to="/admin/funcionarios" className={styles.subItem}>Gerenciar Funcionários</Link>
          </div>
        )}

        <div className={styles.itemMenu} onClick={() => setLivrosAberto(!livrosAberto)}>
          <div>Livros</div>
          {livrosAberto ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {livrosAberto && (
          <div className={styles.subMenu}>
            <Link to="/admin/categorias" className={styles.subItem}>Categorias</Link>
            <Link to="/admin/livros/painel" className={styles.subItem}>Painel Livros</Link>
            <Link to = "/admin/livros/revisoes">Revisões</Link>  
            <Link to="/admin/livros/catalogo" className={styles.subItem}>Gerenciar Catálogo</Link>
          </div>
        )}

        <div className={styles.titulo}>Administração</div>

        <div className={styles.itemMenu} onClick={() => setEcommerceAberto(!ecommerceAberto)}>
          <div>E-commerce</div>
          {ecommerceAberto ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {ecommerceAberto && (
          <div className={styles.subMenu}>
            <Link to="/admin/ecommerce/pedidos" className={styles.subItem}>Gerenciar Pedidos</Link>
            <Link to="/admin/ecommerce/entregas" className={styles.subItem}>Monitorar Entregas</Link>
            <Link to="/admin/ecommerce/cupons" className={styles.subItem}>Gerenciar Cupons</Link>
          </div>
        )}

        <div className={styles.itemMenu} onClick={() => setComunidadeAberto(!comunidadeAberto)}>
          <div>Comunidade e Suporte</div>
          {comunidadeAberto ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {comunidadeAberto && (
          <div className={styles.subMenu}>
            <Link to="/admin/comunidade/autores-leitores" className={styles.subItem}>Autores e Leitores</Link>
            <Link to="/admin/comunidade/notificacoes" className={styles.subItem}>Enviar Notificações</Link>
            <Link to="/admin/comunidade/contato" className={styles.subItem}>Formulários de Contato</Link>
          </div>
        )}

        <div className={styles.itemMenu} onClick={() => setAnalisesAberto(!analisesAberto)}>
          <div>Desempenho</div>
          {analisesAberto ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {analisesAberto && (
          <div className={styles.subMenu}>
            <Link to="/admin/analises/relatorios" className={styles.subItem}>Relatórios Gerais</Link>
          </div>
        )}
      </div>
    </>
  );
}
