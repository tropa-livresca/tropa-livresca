import {useState, useCallback} from "react";

export const usePopup = () => {
  const [popup, setPopup] = useState(null);

  const mostrarPopup = useCallback((tipo, mensagem) => {
    setPopup({tipo, mensagem,});
  }, []);
  
  const fecharPopup = useCallback(() => {
    setPopup(null);
  }, []);

  return{
    popup,
    setPopup,
    mostrarPopup,
    fecharPopup,
  };
}