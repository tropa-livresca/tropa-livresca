import { useEffect, useState } from "react";
import { useUsuarios } from "../../hooks/useUsuarios";
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./VisualizarUsuario.module.css";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiChevronRight, FiMail, FiPhone } from "react-icons/fi";

const LIMITE_LISTA = 5;

const formatarTelefone = (telefone) => {
  const digitos = String(telefone || "").replace(/\D/g, "");
  if (digitos.length === 11)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  if (digitos.length === 10)
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  return telefone || "Não informado";
};

export default function VisualizarUsuario() {
  const { id } = useParams();

  const {
    buscarUsuarioById,
    usuario,
    carregando,
    promoverUsuario,
    inativarFuncionario,
  } = useUsuarios();

  const [executandoAcao, setExecutandoAcao] = useState(false);
  const [verTodosLivros, setVerTodosLivros] = useState(false);
  const [verTodasRevisoes, setVerTodasRevisoes] = useState(false);

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
        <p className={styles.semDados}>
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


  const livros = usuario.livros || [];
  const revisoes = usuario.revisoes || [];
  const livrosVisiveis = verTodosLivros ? livros : livros.slice(0, LIMITE_LISTA);
  const revisoesVisiveis = verTodasRevisoes
    ? revisoes
    : revisoes.slice(0, LIMITE_LISTA);
  const email = usuario.redes_sociais?.email || usuario.email;
  const tipoConta = isAdmin
    ? isMaster
      ? "Funcionário Master"
      : "Funcionário"
    : "Cliente";

  return (
    <main className={styles.mainContainer}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Detalhes do Usuário</h1>
        <Link to="/admin/usuarios" className={styles.btnVoltar}>
          <FiArrowLeft /> Voltar para usuários
        </Link>
      </div>

      <div className={styles.container}>
        <div className={styles.gridPerfil}>
          <section className={styles.cartao}>
            <div className={styles.cabecalhoPerfil}>
              <div className={styles.avatar} aria-hidden="true">
                {usuario.nome?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <h2 className={styles.nomeUsuario}>{usuario.nome}</h2>
                <span
                  className={`${styles.badge} ${isAdmin ? styles.badgeAdmin : styles.badgeCliente}`}
                >
                  {tipoConta}
                </span>
              </div>
            </div>

            <dl className={styles.dados}>
              <div>
                <dt>
                  <FiMail /> E-mail
                </dt>
                <dd>{email || "Não informado"}</dd>
              </div>
              <div>
                <dt>
                  <FiPhone /> Telefone
                </dt>
                <dd>{formatarTelefone(usuario.telefone)}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.cartao}>
            <h3 className={styles.subtitulo}>Ações de controle</h3>
            <p className={styles.descricao}>
              Gerencie os níveis de permissão e acessos deste perfil no sistema.
            </p>

            {!isAdmin ? (
              <button
                onClick={handlePromover}
                disabled={executandoAcao}
                className={styles.btnPrincipal}
              >
                {executandoAcao ? "Processando..." : "Promover a Funcionário"}
              </button>
            ) : (
              <div className={styles.grupoBotoes}>
                <button
                  onClick={handleInativar}
                  disabled={executandoAcao}
                  className={styles.btnPerigo}
                >
                  Inativar funcionário
                </button>
              </div>
            )}
          </section>
        </div>

        <section className={styles.cartao}>
          <div className={styles.cabecalhoSecao}>
            <h3 className={styles.subtitulo}>Livros do autor</h3>
            <span className={styles.contador}>{livros.length}</span>
          </div>

          {livros.length === 0 ? (
            <p className={styles.semDados}>Nenhum livro criado por este usuário.</p>
          ) : (
            <>
              <ul className={styles.lista}>
                {livrosVisiveis.map((livro) => (
                  <li key={livro.id} className={styles.item}>
                    <span className={styles.itemTitulo}>{livro.titulo}</span>
                    <span
                      className={`${styles.tag} ${styles[livro.estado] || styles.padrao}`}
                    >
                      {livro.estado}
                    </span>
                    <Link
                      to={`/admin/livros/detalhes/${livro.id}`}
                      className={styles.link}
                    >
                      Ver detalhes <FiChevronRight />
                    </Link>
                  </li>
                ))}
              </ul>

              {livros.length > LIMITE_LISTA && (
                <button
                  type="button"
                  className={styles.btnVerTodos}
                  onClick={() => setVerTodosLivros(!verTodosLivros)}
                >
                  {verTodosLivros
                    ? "Mostrar menos"
                    : `Ver todos os ${livros.length} livros`}
                </button>
              )}
            </>
          )}
        </section>

        {isAdmin && (
          <section className={styles.cartao}>
            <div className={styles.cabecalhoSecao}>
              <h3 className={styles.subtitulo}>Revisões realizadas</h3>
              <span className={styles.contador}>{revisoes.length}</span>
            </div>

            {revisoes.length === 0 ? (
              <p className={styles.semDados}>
                Nenhuma revisão realizada por este funcionário.
              </p>
            ) : (
              <>
                <ul className={styles.lista}>
                  {revisoesVisiveis.map((revisao) => (
                    <li key={revisao.id} className={styles.item}>
                      <span className={styles.itemTitulo}>
                        Revisão #{revisao.id}
                      </span>
                      <span
                        className={`${styles.tag} ${styles[revisao.status] || styles.finalizado}`}
                      >
                        {revisao.status || "Finalizada"}
                      </span>
                      <Link
                        to={`/admin/livros/revisoes/visualizar/${revisao.id}`}
                        className={styles.link}
                      >
                        Ver revisão <FiChevronRight />
                      </Link>
                    </li>
                  ))}
                </ul>

                {revisoes.length > LIMITE_LISTA && (
                  <button
                    type="button"
                    className={styles.btnVerTodos}
                    onClick={() => setVerTodasRevisoes(!verTodasRevisoes)}
                  >
                    {verTodasRevisoes
                      ? "Mostrar menos"
                      : `Ver todas as ${revisoes.length} revisões`}
                  </button>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
