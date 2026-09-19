import { useEffect } from "react";
import { useUsuarios } from "../../../../hooks/useUsuarios";
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

  const { id } = useParams();

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
    </main>
  );
}
