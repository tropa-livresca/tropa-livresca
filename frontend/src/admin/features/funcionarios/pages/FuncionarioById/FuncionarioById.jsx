import { useFuncionario } from "../../hooks/useFuncionario";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Carregando from "../../../../components/Carregando/Carregando";

export default function FuncionarioById() {
  const { funcionario, carregando, buscarFuncionarioById } = useFuncionario();
  const { id } = useParams();

  useEffect(() => {
    const CarregarDados = () => {
      buscarFuncionarioById(id);
    };
    CarregarDados();
  }, [id]);

  return (
    <main>
      {!funcionario || funcionario === null ? (
        <p>Dados para esse funcionário não encontrados.</p>
      ) : (
        <p>
          {funcionario.nome}
          {funcionario.sobrenome}
          {funcionario.funcao}
          {funcionario.is_admin}
          {funcionario.email}
        </p>
      )}

      <Link to="/admin/funcionarios">Voltar para funcionários</Link>

      {carregando && <Carregando mensagem="Carregando dados do funcionário" />}
    </main>
  );
}
