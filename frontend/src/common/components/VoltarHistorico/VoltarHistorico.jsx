import { useNavigate } from "react-router-dom";
import styles from "./VoltarHistorico.module.css";
import { FaArrowLeft } from 'react-icons/fa';



function VoltarHistorico() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return <button onClick={handleVoltar} className={styles.btnvoltar}><FaArrowLeft/>Voltar</button>;
}

export default VoltarHistorico;
