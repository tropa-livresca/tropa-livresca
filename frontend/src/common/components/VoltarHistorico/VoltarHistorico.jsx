import { useNavigate } from "react-router-dom";

function VoltarHistorico() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return <button onClick={handleVoltar}>Voltar</button>;
}

export default VoltarHistorico;
