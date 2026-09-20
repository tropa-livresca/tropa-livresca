import { useEffect, useState } from "react";
import { useUsuarios } from "../../../../hooks/useUsuarios";
import { FaSearch, FaUser, FaUserCheck, FaUserShield } from "react-icons/fa";
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./GerenciarUsuarios.module.css";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export default function GerenciarUsuarios() {
  const { buscarUsuarios, usuarios, carregando, meta } = useUsuarios();

  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("");
  const [funcao, setFuncao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      await buscarUsuarios(paginaAtual, 3, busca, funcao, ordem);
    };

    carregarDados();
  }, [paginaAtual, funcao, ordem, busca, buscarUsuarios]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarUsuarios(1, 3, busca, funcao, ordem);
  };

  const handleFiltro = (filtro, funcaoBool) => {
    if (funcaoBool === true) {
      setFuncao(filtro);
    } else {
      setOrdem(filtro);
    }
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Gerenciar Usuários</h1>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleBuscar} className={styles.buscaForm}>
          <div className={styles.inputGrupo}>
            <span className={styles.iconebusca}>
              <FaSearch />
            </span>
            <input
              className={styles.inputBusca}
              type="text"
              placeholder="Buscar usuário por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className={styles.filtrosGrupo}>
            <div className={styles.selectContainer}>
              <div
                className={styles.select}
                onClick={() =>
                  setDropdownAberto(
                    dropdownAberto === "filtro" ? null : "filtro",
                  )
                }
              >
                <span>
                  {funcao === "cliente"
                    ? "Clientes"
                    : funcao === "autor"
                      ? "Autores"
                      : funcao === "funcionario"
                        ? "Funcionários"
                        : "Filtrar por Função"}
                </span>
                <FiChevronDown
                  className={`${styles.seta} ${dropdownAberto === "filtro" ? styles.setaAberta : ""}`}
                />
              </div>

              {dropdownAberto === "filtro" && (
                <div className={styles.options}>
                  <div
                    onClick={() => handleFiltro("", true)}
                    className={styles.optionItem}
                  >
                    Todos
                  </div>
                  <div
                    onClick={() => handleFiltro("cliente", true)}
                    className={styles.optionItem}
                  >
                    Clientes
                  </div>
                  <div
                    onClick={() => handleFiltro("autor", true)}
                    className={styles.optionItem}
                  >
                    Autores
                  </div>
                  <div
                    onClick={() => handleFiltro("funcionario", true)}
                    className={styles.optionItem}
                  >
                    Funcionários
                  </div>
                </div>
              )}
            </div>

            <div className={styles.selectContainer}>
              <div
                className={styles.select}
                onClick={() =>
                  setDropdownAberto(dropdownAberto === "ordem" ? null : "ordem")
                }
              >
                <span>
                  {ordem === "ascendente" ? "Mais Antigos" : "Mais Recentes"}
                </span>
                <FiChevronDown
                  className={`${styles.seta} ${dropdownAberto === "ordem" ? styles.setaAberta : ""}`}
                />
              </div>

              {dropdownAberto === "ordem" && (
                <div className={styles.options}>
                  <div
                    onClick={() => handleFiltro("ascendente", false)}
                    className={styles.optionItem}
                  >
                    Mais Antigos
                  </div>
                  <div
                    onClick={() => handleFiltro("descendente", false)}
                    className={styles.optionItem}
                  >
                    Mais Recentes
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className={styles.btnbuscar}>
              Buscar
            </button>
          </div>
        </form>

        {carregando ? (
          <div className={styles.carregando}>
            <Carregando mensagem="Carregando usuários..." />
          </div>
        ) : !usuarios || usuarios.length === 0 ? (
          <div className={styles.semUsuariosContainer}>
            <p className={styles.semUsuarios}>Nenhum usuário encontrado.</p>
          </div>
        ) : (
          <div className={styles.tabelaWrapper}>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Nível Administrativo</th>
                  <th>É Autor?</th>
                  {funcao === "funcionario" && <th>E-mail Corporativo</th>}
                  <th className={styles.acoesHeader}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, c) => (
                  <tr key={c} className={styles.linhaTabela}>
                    <td className={styles.colunaNome}>
                      <span className={styles.avatarInline}>
                        {usuario.isAdmin ? (
                          <FaUserShield />
                        ) : usuario.isAutor ? (
                          <FaUserCheck />
                        ) : (
                          <FaUser />
                        )}
                      </span>
                      {usuario.nome}
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${usuario.isAdmin ? styles.badgeAdmin : styles.badgeCliente}`}
                      >
                        {usuario.isAdmin ? "Funcionário" : "Cliente"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${usuario.isAutor ? styles.badgeSim : styles.badgeNao}`}
                      >
                        {usuario.isAutor ? "Sim" : "Não"}
                      </span>
                    </td>
                    {funcao === "funcionario" && (
                      <td className={styles.colunaEmail}>
                        {usuario.redes_sociais?.email || "-"}
                      </td>
                    )}
                    <td className={styles.colunaAcoes}>
                      <Link to={`/admin/usuarios/${usuario.id}`}>
                        Visualizar Usuário
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!carregando && meta && meta.totalPages > 1 && (
        <Paginacao
          totalPaginas={meta.totalPages}
          totalItems={meta.totalItems}
          paginaAtual={paginaAtual}
          onMudarPagina={setPaginaAtual}
        />
      )}
    </main>
  );
}
