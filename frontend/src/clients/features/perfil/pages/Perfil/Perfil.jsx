import { usePerfil } from "../../hooks/usePerfil";
import styles from "./Perfil.module.css";
import Input from "../../../../../common/components/Input/Input";
import { useEffect, useState } from "react";
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
    perfil,
    nome,
    telefone,
    imagem,
    descricao,
    redesSociais,
    setNome,
    setTelefone,
    setImagem,
    setDescricao,
    setRedesSociais,
    updatePerfil,
    getPerfil,
  } = usePerfil();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      await getPerfil();
      setCarregando(false);
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (!perfil) return;

    if (imagem === "") {
      setPreviewUrl(perfil.imagem || null);
    } else if (imagem === "remover") {
      setPreviewUrl(null);
    }

    setNome((prev) => prev || perfil.nome || "");
    setTelefone((prev) => prev || perfil.telefone || "");
    setDescricao((prev) => prev || perfil.descricao || "");
  }, [perfil, imagem]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoverImagem = (e) => {
    e.preventDefault();
    setImagem("remover");
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRedeChange = (plataforma, valor) => {
    setRedesSociais((prev) => ({ ...prev, [plataforma]: valor }));
  };

  const handleCancelar = () => {
    setEditando(false);

    if (perfil) {
      setNome(perfil.nome || "");
      setTelefone(perfil.telefone || "");
      setDescricao(perfil.descricao || "");

      setRedesSociais({
        email: perfil.redes_sociais?.email || "",
        instagram: perfil.redes_sociais?.instagram || "",
        facebook: perfil.redes_sociais?.facebook || "",
        linkedin: perfil.redes_sociais?.linkedin || "",
      });

      if (perfil.imagem) {
        setPreviewUrl(perfil.imagem);
        setImagem("");
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultado = await updatePerfil({
      nome,
      telefone,
      imagem: imagem === "remover" ? "" : imagem,
      descricao,
      redes_sociais: redesSociais,
    });

    if (resultado?.sucess) {
      alert("Perfil atualizado com sucesso!");
      setEditando(false);
    } else {
      alert(
        `Erro ao atualizar perfil: ${resultado?.error || "Erro desconhecido"}`,
      );
    }
  };

  if (carregando) {
    return <p>Carregando...</p>;
  }

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

            <label
              className={`${styles.carregar} ${!editando ? styles.carregardesabilitado : ""}`}
            >
              <FaImage className={styles.carregarsvg} />

              <span>
                Selecionar imagem
                <span id={styles.clique}>Clique para escolher um arquivo</span>
              </span>

              <input
                type="file"
                hidden
                disabled={!editando}
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
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
