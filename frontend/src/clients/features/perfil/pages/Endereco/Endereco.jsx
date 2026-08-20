import { useEffect, useState } from "react";
import { useEndereco } from "../../hooks/useEndereco.js";
import styles from "./Endereco.module.css";

export default function Endereco() {
  const {
    enderecos,
    estado,
    setEstado,
    cidade,
    setCidade,
    bairro,
    setBairro,
    rua,
    setRua,
    numero,
    setNumero,
    CEP,
    complemento,
    setComplemento,
    pais,
    setPais,
    carregando,
    BuscarEnderecos,
    BuscarEnderecoById,
    AtualizarEndereco,
    InativarEndereco,
    LimparFormulario,
    handleCriarEndereco,
    AplicarMascaraCEP,
    BuscarCepAutomatico,
    DefinirEnderecoPrincipal,
  } = useEndereco();

  const [idSelecionado, setIdSelecionado] = useState("");

  useEffect(() => {
    BuscarEnderecos();
  }, [BuscarEnderecos]);

  useEffect(() => {
    if (CEP.length === 9) {
      BuscarCepAutomatico(CEP);
    }
  }, [CEP, BuscarCepAutomatico]);

  const executarSalvar = (e) => {
    e.preventDefault();
    if (idSelecionado) {
      AtualizarEndereco(idSelecionado, e);
    } else {
      handleCriarEndereco(e);
    }
  };

  const selecionarParaEditar = (end) => {
    setIdSelecionado(end.id);
    BuscarEnderecoById(end.id);
  };

  const executarLimpar = () => {
    setIdSelecionado("");
    LimparFormulario();
  };

  return (
    <div className={styles.container}>
    <div className={styles.topo}>
      <h1 className={styles.titulo}>Gerenciamento de Endereços</h1>
      </div>

      {carregando && (
        <div className={styles.loading}>
          <strong>Aguarde...</strong> Processando requisição...
        </div>
      )}

      <div className={styles.conteudoLayout}>
        <div className={styles.colunaFormulario}>
          <h2 className={styles.subtitulo}>{idSelecionado ? "Editar Endereço" : "Novo Endereço"}</h2>

          <form onSubmit={executarSalvar} className={styles.formularioGrid}>
            <div className={styles.formGrupo}>
              <label className={styles.label}>CEP:</label>
              <input
                type="text"
                className={`${styles.input} ${styles.fontnumero}`}
                value={CEP}
                onChange={(e) => AplicarMascaraCEP(e.target.value)}
                placeholder="00000-000"
              />
            </div>

            <div className={styles.formGrupo}>
              <label className={styles.label}>Rua:</label>
              <input
                type="text"
                className={styles.input}
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                placeholder="Inserir rua"
              />
            </div>

            <div className={styles.formGrupo}>
              <label className={styles.label}>Número:</label>
              <input
                type="text"
                className={`${styles.input} ${styles.fontnumero2}`}
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Inserir numero"
              />
            </div>

            <div className={styles.formGrupo}>
              <label className={styles.label}>Bairro:</label>
              <input
                type="text"
                className={styles.input}
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Inserir bairro"
              />
            </div>

            <div className={styles.formGrupo}>
              <label className={styles.label}>Cidade:</label>
              <input
                type="text"
                className={styles.input}
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Inserir cidade"
              />
            </div>

            <div className={styles.formGrupo}>
              <label className={styles.label}>Estado:</label>
              <input
                type="text"
                className={styles.input}
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Inserir estado"
              />
            </div>

            <div className={styles.formGrupo}>
              <label className={styles.label}>Complemento:</label>
              <input
                type="text"
                className={styles.input}
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Inserir complemento"
              />
            </div>

            <div className={styles.formGrupo}>
              <label className={styles.label}>País:</label>
              <input
                type="text"
                className={styles.input}
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                placeholder="Inserir país"
              />
            </div>

            <div className={styles.areaAcoesForm}>
              <button type="submit" className={styles.btnSalvar}>
                {idSelecionado ? "Atualizar" : "Salvar"}
              </button>

              <button type="button" onClick={executarLimpar} className={styles.btnLimpar}>
                Limpar
              </button>
            </div>
          </form>
        </div>

        <div className={styles.colunaListagem}>
          <div className={styles.listagemTopo}>
            <h2 className={styles.subtitulo}>Endereços Cadastrados</h2>
            <button onClick={BuscarEnderecos} className={styles.btnAtualizar}>
              Atualizar
            </button>
          </div>

          <div className={styles.containerTabela}>
            <table className={styles.tabelaEnderecos}>
              <thead className={styles.tabelaCabecalho}>
                <tr>
                  <th className={styles.tabelaTh}>CEP</th>
                  <th className={styles.tabelaTh}>Logradouro</th>
                  <th className={styles.tabelaTh}>Cidade/UF</th>
                  <th className={styles.tabelaTh}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {enderecos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={styles.tabelaVazia}>
                      Nenhum endereço encontrado.
                    </td>
                  </tr>
                ) : (
                  enderecos.map((end) => (
                    <tr key={end.id} className={styles.tabelaLinha}>
                      <td className={styles.tabelaTd}>
                        <span className={styles.fontnumero}>
                        {end.CEP || end.cep}
                        {end.principal && (
                          <span className={styles.badgePrincipal}>Principal</span>
                        )}</span>
                      </td>
                      <td className={styles.tabelaTd}>{`${end.rua || ""}, ${end.num || end.numero || "S/N"}`}</td>
                      <td className={styles.tabelaTd}>{`${end.cidade} - ${end.estado}`}</td>
                      <td className={styles.tabelaTd}>
                        <div className={styles.acoesTabela}>
                          <button onClick={() => selecionarParaEditar(end)} className={styles.btnEditar}>
                            Editar
                          </button>
                          
                          {!end.principal && (
                            <button 
                              onClick={() => DefinirEnderecoPrincipal(end.id)} 
                              className={styles.btnPrincipalAction}
                            >
                              Principal
                            </button>
                          )}

                          <button onClick={() => InativarEndereco(end.id)} className={styles.btnStatus}>
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
