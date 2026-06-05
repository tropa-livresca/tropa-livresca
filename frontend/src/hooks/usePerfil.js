import { useContext } from "react";
import {PerfilContext} from "../context/perfil/Perfil";

const usePerfil = () => {
  const context = useContext(PerfilContext);
  return context;
};

export default usePerfil;
