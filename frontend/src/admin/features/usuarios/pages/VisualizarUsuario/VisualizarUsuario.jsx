import { useEffect } from "react";
import { useUsuarios } from "../../../../hooks/useUsuarios";
<<<<<<< HEAD
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./VisualizarUsuario.module.css";
import { useParams, Link } from "react-router-dom";
=======
import { useLivros } from "../../../../hooks/useLivros";
import { useRevisao } from "../../../../hooks/useRevisao";
import styles from "./VisualizarUsuario.module.css";
import { useEndereco } from "../../../../hooks/useEndereco";
import { Link, useParams } from "react-router-dom";
import Carregando from "../../../../components/Carregando/Carregando";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function VisualizarUsuario() {
  const {
    buscarUsuarioById,
    nome,
    telefone,
    descricao,
    redesSociais,
    previewUrl,
    carregando,
  } = useUsuarios();

  const { enderecos, BuscarEnderecos } = useEndereco();

  const { livros, buscarLivrosByUserId } = useLivros();

  const { revisoes, BuscarRevisaoByUserId } = useRevisao();
>>>>>>> 59fa0bcf720b4b1d1dda4f9f8cc96a5ccf4c709e

export default function VisualizarUsuario() {
  const { id } = useParams();

<<<<<<< HEAD
  const {
    buscarUsuarioById,
    usuario,
    carregando,
    promoverUsuario,
    alterarIsMasterFuncionario,
    inativarFuncionario,
  } = useUsuarios();

  const [executandoAcao, setExecutandoAcao] = useState(false);

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
        {/* Cartão de Informações Principais */}
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
        <h3 className={styles.secaoTitulo}>Livros do Autor</h3>
        {!usuario.livros || usuario.livros.length === 0 ? (
          <p className={styles.semDados}>
            Nenhum livro criado por este usuário.
          </p>
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Histórico de Revisões</h3>
          {!usuario.revisoes || usuario.revisoes.length === 0 ? (
            <p className={styles.semDados}>
              Nenhuma revisão realizada por este funcionário.
            </p>
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
      )}
=======
  useEffect(() => {
    BuscarEnderecos(id);
  }, [BuscarEnderecos]);

  useEffect(() => {
    buscarUsuarioById(id);
  }, [buscarUsuarioById]);

  useEffect(() => {
    buscarLivrosByUserId(id);
  }, [buscarLivrosByUserId]);

  useEffect(() => {
    BuscarRevisaoByUserId(id);
  }, [BuscarRevisaoByUserId]);

  if (carregando) {
    return <Carregando />;
  }

  console.log(revisoes);

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Meu Perfil</h1>
        <p>
          Gerencie suas informações pessoais, redes sociais e foto de perfil.
        </p>
      </div>
      <div className={styles.container}>
        <section className={styles.containerperfil}>
          <div className={styles.perfilesq}>
            <div className={styles.fotocontainer}>
              {previewUrl ? (
                <img src={previewUrl} alt="Perfil" className={styles.foto} />
              ) : (
                <div className={styles.semFoto}>
                  <FaUserCircle />
                </div>
              )}
            </div>

            <h2>{nome || "Seu Nome"}</h2>

            <div className={styles.linha}></div>

            <p className={styles.descricaoPerfil}>
              {descricao || "Adicione uma descrição sobre você."}
            </p>

            <div className={styles.contatos}>
              <span>
                <FaEnvelope />
                {redesSociais.email || "email@email.com"}
              </span>

              <span className={styles.telefone}>
                <FaPhone />
                {telefone || "(00) 00000-0000"}
              </span>
            </div>

            <div className={styles.redes}>
              <span>
                <FaInstagram />
              </span>

              <span>
                <FaFacebookF />
              </span>

              <span>
                <FaLinkedinIn />
              </span>
            </div>
          </div>
          <section>
            <h3>Redes sociais</h3>

            <div className={styles.inputs}>
              <h3>{redesSociais.instagram}</h3>

              <h3>{redesSociais.facebook}</h3>

              <h3>{redesSociais.linkedin}</h3>
            </div>
          </section>
          <section>
            <h3>Endereços</h3>

            {enderecos.length != 0 ? (
              enderecos.map((endereco) => {
                return (
                  <div
                    className={`${styles.enderecoFormulario}`}
                    key={endereco.id}
                  >
                    <div className={styles.enderecoInfo}>
                      <FaMapMarkerAlt />

                      <span className={styles.david}>
                        {endereco.rua || ""}
                        {endereco.rua && ", "}

                        <span className={styles.numero}>
                          {endereco.num || "S/N"}
                        </span>

                        {endereco.bairro && ` - ${endereco.bairro}`}
                        {endereco.cidade && ` - ${endereco.cidade}`}
                        {endereco.estado && `/${endereco.estado}`}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`${styles.enderecoFormulario}`}>
                <div className={styles.semEndereco}>
                  <FaMapMarkerAlt />

                  <span className={styles.david}>
                    Nenhum endereço cadastrado.
                  </span>
                </div>
              </div>
            )}
          </section>
          {livros.length != 0 ? (
            livros.map((livro) => {
              let capaObjeto =
                livro.capa != undefined
                  ? JSON.parse(livro.capa).frente != undefined
                    ? JSON.parse(livro.capa).frente
                    : undefined
                  : undefined;
              return (
                <div key={livro.id}>
                  {capaObjeto != undefined ? (
                    <img
                      className={styles.foto}
                      src={JSON.parse(livro.capa).frente}
                      alt={livro.titulo}
                    />
                  ) : (
                    <div className={styles.semfoto}>Sem capa</div>
                  )}
                  <h1>{livro.titulo}</h1>
                  <h1>{livro.autor_nome}</h1>
                  <h1>{livro.data_de_publicacao}</h1>
                  <h1>{livro.estado}</h1>
                  <Link to={`../livros/detalhes/${livro.id}`}>
                    ver detalhes
                  </Link>
                </div>
              );
            })
          ) : (
            <></>
          )}

          {revisoes.length != 0 ? (
            revisoes.map((revisao) => {
              const livro = revisao.livros;
              return (
                <div key={revisao.id}>
                  <ul>
                    <li>Id do livro: {livro?.id || "Sem id"}</li>
                    <li>
                      {livro?.capa?.frente ? (
                        <img
                          src={livro.capa.frente}
                          alt={`Capa do livro ${livro?.titulo}`}
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        "Sem capa encontrada"
                      )}
                    </li>
                    <li>Título: {livro?.titulo || "Sem título"}</li>
                    <li>Subtítulo: {livro?.subtitulo || "Sem subtítulo"}</li>
                    <li>Nome: {revisao.nome}</li>
                    <li>Apontamento: {revisao.apontamento}</li>
                    <li>Data: {revisao.data}</li>
                  </ul>
                  <Link to={`../livros/revisoes/visualizar/${revisao.id}`}>
                    Ver Revisão
                  </Link>
                  {livro?.id && (
                    <Link to={`../livros/detalhes/${revisao.livros.id}`}>
                      Ver livro revisto
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            <></>
          )}
        </section>
      </div>
>>>>>>> 59fa0bcf720b4b1d1dda4f9f8cc96a5ccf4c709e
    </main>
  );
}
