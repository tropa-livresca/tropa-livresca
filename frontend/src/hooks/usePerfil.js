import { useContext } from "react";
import {PerfilContext} from "../context/perfil/Perfil";

const usePerfil = () => {
  const context = useContext(PerfilContext);

   if (!context) {
    throw new Error(
      "Erro de Escopo: usePerfil() foi chamado em um componente fora do <PerfilProvider> ou há uma divergência nos caminhos de importação no projeto."
    );
  }
  
  return context;
};

export default usePerfil;
