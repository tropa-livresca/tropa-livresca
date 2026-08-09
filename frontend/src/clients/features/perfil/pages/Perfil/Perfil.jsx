import { useEffect } from "react";
import { usePerfil } from "../../hooks/usePerfil";
import styles from "./Perfil.module.css";
import Input from "../../../../../common/components/Input/Input";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaImage,
} from "react-icons/fa";

export default function Perfil() {
  const {
    getPerfil,
    nome,
    telefone,
    descricao,
    redesSociais,
    previewUrl,
    carregando,
    editando,
    setNome,
    setTelefone,
    setDescricao,
    setEditando,
    handleFileChange,
    handleRemoverImagem,
    handleRedeChange,
    handleCancelar,
    updatePerfil,
  } = usePerfil();

  useEffect(() => {
    getPerfil();
  }, [getPerfil]);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePerfil();
  };

  return (
    <main className={styles.container}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Meu Perfil</h1>
        <p>
          Gerencie suas informações pessoais, redes sociais e foto de perfil.
        </p>
      </div>

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

          <button
            type="button"
            className={styles.botaoEditar}
            onClick={() => setEditando(true)}
          >
            Editar informações
          </button>
        </div>

        <form
          className={`${styles.formulario} ${!editando ? styles.formularioBloqueado : ""}`}
          onSubmit={handleSubmit}
        >
          <section>
            <h3>Informações pessoais</h3>
            <p className={styles.subtitulo}>
              Como as pessoas irão te encontrar.
            </p>

            <div className={styles.inputs}>
              <div>
                <label>Nome</label>
                <Input
                  placeholder="Inserir nome"
                  value={nome}
                  disabled={!editando}
                  className={styles.inputmodificado}
                  handleOnChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div>
                <label>Telefone</label>
                <Input
                  placeholder="Inserir telefone"
                  value={telefone}
                  disabled={!editando}
                  className={styles.inputmodificado}
                  id={styles.telefone}
                  handleOnChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <div>
                <label>E-mail</label>
                <Input
                  placeholder=" Inserir e-mail"
                  type="email"
                  value={redesSociais.email}
                  disabled={!editando}
                  className={styles.inputmodificado}
                  handleOnChange={(e) =>
                    handleRedeChange("email", e.target.value)
                  }
                />
              </div>
            </div>

            <div className={styles.campo}>
              <label>Descrição</label>

              <textarea
                disabled={!editando}
                placeholder=" Inserir descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </section>

          <section>
            <h3>Redes sociais</h3>

            <p className={styles.subtitulo}>
              Adicione apenas o nome de usuário.
            </p>

            <div className={styles.inputs}>
              <Input
                placeholder="Inserir instagram"
                value={redesSociais.instagram}
                disabled={!editando}
                className={styles.inputmodificado}
                handleOnChange={(e) =>
                  handleRedeChange("instagram", e.target.value)
                }
              />

              <Input
                placeholder="Inserir facebook"
                value={redesSociais.facebook}
                disabled={!editando}
                className={styles.inputmodificado}
                handleOnChange={(e) =>
                  handleRedeChange("facebook", e.target.value)
                }
              />

              <Input
                placeholder="Inserir linkedin"
                value={redesSociais.linkedin}
                disabled={!editando}
                className={styles.inputmodificado}
                handleOnChange={(e) =>
                  handleRedeChange("linkedin", e.target.value)
                }
              />
            </div>
          </section>

          <section>
            <h3>Foto de perfil</h3>

            <p className={styles.subtitulo}>PNG ou JPG, até 5MB.</p>

            <div className={styles.containerFotoBotoes}>
              <label
                className={`${styles.carregar} ${!editando ? styles.carregardesabilitado : ""}`}
              >
                <FaImage className={styles.carregarsvg} />

                <span>
                  Selecionar imagem
                  <span id={styles.clique}>
                    Clique para escolher um arquivo
                  </span>
                </span>

                <input
                  type="file"
                  name="imagem"
                  hidden
                  disabled={!editando}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              {previewUrl && (
                <button
                  type="button"
                  disabled={!editando}
                  className={styles.removerFoto}
                  onClick={handleRemoverImagem}
                >
                  Remover Foto
                </button>
              )}
            </div>
          </section>

          <div className={styles.acoes}>
            <button
              type="button"
              disabled={!editando}
              className={styles.cancelar}
              onClick={handleCancelar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!editando}
              className={styles.atualizar}
            >
              Atualizar Perfil
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
