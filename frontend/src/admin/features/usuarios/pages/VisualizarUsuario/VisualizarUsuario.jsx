import { useEffect, useState } from "react";
import { useUsuarios } from "../../hooks/useUsuarios";
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./VisualizarUsuario.module.css";
import { useParams, Link } from "react-router-dom";

export default function VisualizarUsuario() {
  const { id } = useParams();

  const {
    buscarUsuarioById,
    usuario,
    carregando,
    promoverUsuario,
    alterarIsMasterFuncionario,
    inativarFuncionario,
  } = useUsuarios();

  const [executandoAcao, setExecutandoAcao] = useState(false);
  const [verMaisLivros, setVerMaisLivros] = useState(false);
  const [verMaisRevisoes, setVerMaisRevisoes] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      if (id) {
        await buscarUsuarioById(id);
      }
    };
    carregarDados();
  }, [id, buscarUsuarioById]);

  if (carregando) {
    return (
      <div className={styles.carregando}>
        <Carregando mensagem="Carregando detalhes do usuário..." />
      </div>
    );
  }

  if (!usuario || (!usuario.id && !usuario.nome)) {
    return (
      <main className={styles.container}>
        <p className={styles.erro}>
          Usuário não encontrado ou dados inválidos.
        </p>
        <Link to="/admin/usuarios" className={styles.btnVoltar}>
          Voltar para Gerenciar Usuários
        </Link>
      </main>
    );
  }

  const isAdmin = !!usuario.is_admin;
  const isMaster = !!usuario.is_master;

  const handlePromover = async () => {
    if (!window.confirm(`Deseja promover ${usuario.nome} a Funcionário?`))
      return;
    setExecutandoAcao(true);
    try {
      await promoverUsuario(usuario.id);
      await buscarUsuarioById(usuario.id);
    } catch (erro) {
      alert(erro.message || "Erro ao promover usuário.");
    } finally {
      setExecutandoAcao(false);
    }
  };

  const handleMudarMaster = async () => {
    const novoStatusMaster = !isMaster;
    const mensagem = novoStatusMaster
      ? `Deseja dar cargo de Gerente Master para ${usuario.nome}?`
      : `Deseja remover as permissões Master de ${usuario.nome}?`;

    if (!window.confirm(mensagem)) return;

    setExecutandoAcao(true);
    try {
      await alterarIsMasterFuncionario(usuario.id, novoStatusMaster);
      await buscarUsuarioById(usuario.id);
    } catch (erro) {
      alert(erro.message || "Erro ao alterar nível administrativo.");
    } finally {
      setExecutandoAcao(false);
    }
  };

  const handleInativar = async () => {
    if (
      !window.confirm(
        `Tem certeza que deseja INATIVAR o funcionário ${usuario.nome}? Ele perderá os acessos.`,
      )
    )
      return;
    setExecutandoAcao(true);
    try {
      await inativarFuncionario(usuario.id);
      await buscarUsuarioById(usuario.id);
    } catch (erro) {
      alert(erro.message || "Erro ao inativar funcionário.");
    } finally {
      setExecutandoAcao(false);
    }
  };


  return (
    <main className={styles.mainContainer}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Detalhes do Usuário</h1>
        <Link to="/admin/usuarios" className={styles.btnVoltar}>
          Voltar
        </Link>
      </div>

      <div className={styles.gridPerfil}>
        <div className={styles.cartaoPerfil}>
          <div className={styles.dadosUsuario}>
            <h2 className={styles.nomeUsuario}>{usuario.nome}</h2>
            <div className={styles.infoLinha}>
              <strong>Tipo de Conta:</strong>{" "}
              <span
                className={`${styles.badge} ${isAdmin ? styles.badgeAdmin : styles.badgeCliente}`}
              >
                {isAdmin
                  ? isMaster
                    ? "Funcionário Master"
                    : "Funcionário"
                  : "Cliente"}
              </span>
            </div>
            <div className={styles.infoLinha}>
              <strong>E-mail:</strong>{" "}
              <span className={styles.textEmail}>
                {usuario.redes_sociais?.email ||
                  usuario.email ||
                  "Não informado"}
              </span>
            </div>
            {usuario.telefone && (
              <div className={styles.infoLinha}>
                <strong>Telefone:</strong>{" "}
                <span className={styles.textEmail}>{usuario.telefone}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.cartaoAcoes}>
          <h3 className={styles.subtituloAcoes}>Ações de Controle</h3>
          <p className={styles.descricaoAcoes}>
            Gerencie os níveis de permissão e acessos deste perfil no sistema.
          </p>

          <div className={styles.containerBotoes}>
            {!isAdmin ? (
              <button
                onClick={handlePromover}
                disabled={executandoAcao}
                className={styles.btnPromover}
              >
                {executandoAcao ? "Processando..." : "Promover a Funcionário"}
              </button>
            ) : (
              <div className={styles.grupoBotoes}>
                <button
                  onClick={handleMudarMaster}
                  disabled={executandoAcao}
                  className={
                    isMaster ? styles.btnRemoverMaster : styles.btnTornarMaster
                  }
                >
                  {isMaster ? "Remover Cargo Master" : "Tornar Master"}
                </button>

                <button
                  onClick={handleInativar}
                  disabled={executandoAcao}
                  className={styles.btnInativar}
                >
                  Inativar Funcionário
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.secao}>
        {!verMaisLivros ? (
          <></>
        ) : (
          <div className={styles.listaWrapper}>
            <ul className={styles.lista}>
              {usuario.livros.map((livro) => (
                <li key={livro.id} className={styles.item}>
                  <span className={styles.livroTitulo}>{livro.titulo}</span>
                  <span
                    className={`${styles.tagEstado} ${styles[livro.estado] || styles.padrao}`}
                  >
                    {livro.estado}
                  </span>
                  <span
                    
                  >
                    <Link to={"../livros/detalhes/"+livro.id}>ver detalhes</Link>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>


      <div className={styles.secao}>
          {!verMaisRevisoes ? (
            <></>
          ) : (
            <div className={styles.listaWrapper}>
              <ul className={styles.lista}>
                {usuario.revisoes.map((revisao) => (
                  <li key={revisao.id} className={styles.item}>
                    <span className={styles.revisaoId}>
                      Revisão Código: {revisao.id}
                    </span>
                    <span
                      className={`${styles.tagStatus} ${styles[revisao.status] || styles.finalizado}`}
                    >
                      {revisao.status || "Finalizada"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      

      <div className={styles.secao}>
        <h3 className={styles.secaoTitulo}>Livros do Autor</h3>
        {!usuario.livros || usuario.livros.length === 0 ? (
          <p className={styles.semDados}>
            Nenhum livro criado por este usuário.
          </p>
        ) : (
          
          <div className={styles.listaWrapper}>

              
            <span className={styles.livroTitulo}>{usuario.livros[0].titulo}</span>
            <span
             className={`${styles.tagEstado} ${styles[usuario.livros[0].estado] || styles.padrao}`}
            >
            {usuario.livros[0].estado}
            </span>

            {usuario.livros.length > 1 ? (<button onClick={() => {setVerMaisLivros(!verMaisLivros)}}>ver mais livros</button>) : (<></>) }

          </div>
        )}
      </div>

      {isAdmin && (
        <div className={styles.secao}>
          {!usuario.revisoes || usuario.revisoes.length === 0 ? (
            <p className={styles.semDados}>
              Nenhuma revisão realizada por este funcionário.
            </p>
          ) : (
            <div className={styles.listaWrapper}>
                    <span className={styles.revisaoId}>
                      Revisão Código: {usuario.revisoes[0].id}
                    </span>
                    <span
                      className={`${styles.tagStatus} ${styles[usuario.revisoes[0].status] || styles.finalizado}`}
                    >
                      {usuario.revisoes[0].status || "Finalizada"}
                    </span>

                    {usuario.revisoes.length > 0 ? (<button onClick={() => {setVerMaisRevisoes(!verMaisRevisoes)}}>ver mais revisoes</button>) : (<></>) }
            </div>
          )}
        </div>
      )}
    </main>
  );
}
