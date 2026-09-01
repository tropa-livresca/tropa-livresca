import useSuporte from "../../hooks/useSuporte";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./Suporte.module.css";

export default function Suporte() {
  const {
    error,
    email,
    setEmail,
    telefone,
    setTelefone,
    nome,
    setNome,
    mensagem,
    setMensagem,
    motivo,
    setMotivo,
    enviarEmail,
    carregando,
  } = useSuporte();

  const handleSubmit = async (e) => {
    e.preventDefault();
    enviarEmail();
  };

  const motivos = [
    "Selecione um motivo",
    "Problemas de Autopublicação",
    "Problemas ao receber",
    "Dúvidas",
    "Outro"
  ];

  const [aberto, setAberto] = useState(false);

  const selecionarMotivo = (item) => {
    setMotivo(item);
    setAberto(false);
  };

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Entre em contato</h1>
        <p>
          Tem alguma dúvida? Entre em contato conosco.
        </p>
      </div>

      <div className={styles.container}>

      <form onSubmit={handleSubmit} method="POST" className={styles.form}>
        <legend className={styles.legend}>Preencha os campos abaixo</legend>
        

        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          className={styles.inputmodificado}
          value={email}
          placeholder="E-mail de destino"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="telefone">Celular</label>
        <input
          type="tel"
          id="telefone"
          className={styles.inputmodificado}
          name="telefone"
          value={telefone}
          placeholder="Telefone de contato"
          onChange={(e) => setTelefone(e.target.value)}
        />

        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          className={styles.inputmodificado}
          name="nome"
          value={nome}
          placeholder="Seu nome"
          onChange={(e) => setNome(e.target.value)}
        />

        <label htmlFor="motivo">Motivo de contato</label>

        <div className={styles.selectContainer}>
          <button
            type="button"
            className={styles.select}
            onClick={() => setAberto(!aberto)}
          >
            <span>{motivo || "Selecione um motivo"}</span>

            <span
              className={`${styles.seta} ${aberto ? styles.setaAberta : ""}`}
            >
              <FiChevronDown />
            </span>
          </button>

          <div
            className={`${styles.opcoes} ${aberto ? styles.opcoesAbertas : ""}`}
          >
            {motivos.map((item, index) => (
              <button
                key={index}
                type="button"
                className={styles.opcao}
                onClick={() => selecionarMotivo(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <label htmlFor="mensagem">Mensagem</label>
        <textarea
          id="mensagem"
          name="mensagem"
          value={mensagem}
          placeholder="Sua mensagem"
          rows={5}
          onChange={(e) => setMensagem(e.target.value)}
          className={styles.textarea}
        />

        <button type="submit" disabled={carregando} className={styles.button}>
          {carregando ? "Enviando..." : "Enviar"}
        </button>

        {error?.text && (
          <p className={styles.erro}>{error.text}</p>
        )}
      </form>
      </div>
    </main>
  );
}
