import { useState, useEffect } from "react";
import { useFuncionario } from "../../hooks/useFuncionario.js";
import { FaSearch } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Carregando from "../../../../../clients/components/Carregando/Carregando.jsx";
import Paginacao from "../../../../common/components/Paginacao.jsx";

export default function GerenciarFuncionarios() {
  const { funcionarios, buscarFuncionarios, carregando, meta } =
    useFuncionario();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      buscarFuncionarios(paginaAtual, busca, filtro, ordem);
    };
    carregarDados();
  }, [paginaAtual, busca, filtro, ordem]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarFuncionarios(1, busca, filtro, ordem);
  };

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const handleOrdem = (novaOrdem) => {
    setOrdem(novaOrdem);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const handleDetalhes = (id) => {
    navigate("/admin/usuarios/" + id);
  };

  return (
    <main>
      <div>
        <h1>Funcionários da editora</h1>
        <p>Os funcionários são os tijolos da firma.</p>
      </div>

      <div>
        <form onSubmit={handleBuscar}>
          <span>
            <FaSearch />
          </span>

          <input
            type="text"
            placeholder="Buscar funcionário..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div>
            <div
              onClick={() =>
                setDropdownAberto(dropdownAberto === "filtro" ? null : "filtro")
              }
            >
              <span>
                {filtro === "alfabetico"
                  ? "Ordem Alfabética"
                  : filtro === "data"
                    ? "Data de Publicação"
                    : "Filtrar por"}
              </span>
              <FiChevronDown />
            </div>

            {dropdownAberto === "filtro" && (
              <div>
                <div onClick={() => handleFiltro("")}>
                  <span>Filtrar por</span>
                </div>
                <div onClick={() => handleFiltro("alfabetico")}>
                  <span>Ordem Alfabética</span>
                </div>
                <div onClick={() => handleFiltro("data")}>
                  <span>Data de Publicação</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <div
              onClick={() =>
                setDropdownAberto(dropdownAberto === "ordem" ? null : "ordem")
              }
            >
              <span>
                {ordem === "ascendente"
                  ? "Mais Antigos"
                  : ordem === "descendente"
                    ? "Mais Recentes"
                    : "Ordenar por"}
              </span>
              <FiChevronDown />
            </div>

            {dropdownAberto === "ordem" && (
              <div>
                <div onClick={() => handleOrdem("")}>
                  <span>Ordenar por</span>
                </div>
                <div onClick={() => handleOrdem("ascendente")}>
                  <span>Mais Antigos</span>
                </div>
                <div onClick={() => handleOrdem("descendente")}>
                  <span>Mais Recentes</span>
                </div>
              </div>
            )}
          </div>

          <button type="submit">Buscar</button>
        </form>
      </div>

      {carregando ? (
        <div>
          <Carregando mensagem="Carregando funcionários..." />
        </div>
      ) : !funcionarios || funcionarios.length === 0 ? (
        <div>Nenhum funcionário encontrado.</div>
      ) : (
        <>
          <div>
            {funcionarios.map((funcionario) => (
              <div key={funcionario.id}>
                <p>Nome: {funcionario.nome}</p>
                <p>
                  Função:{" "}
                  {funcionario.funcao === "Master" ? (
                    <>Gerente</>
                  ) : (
                    <>Funcionário</>
                  )}
                </p>
                <button onClick={() => handleDetalhes(funcionario.id)}>
                  Detalhes
                </button>
              </div>
            ))}
          </div>

          {meta && (
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={meta.totalPaginas}
              totalItems={meta.totalItems}
              onMudarPagina={(novaPagina) => setPaginaAtual(novaPagina)}
            />
          )}
        </>
      )}
    </main>
  );
}
