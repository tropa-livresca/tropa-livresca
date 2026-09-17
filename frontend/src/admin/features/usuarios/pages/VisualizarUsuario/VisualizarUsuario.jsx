import { useEffect, useState } from "react";
import { useUsuarios } from "../../../../hooks/useUsuarios";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./VisualizarUsuario.module.css";
import { useParams, Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export default function GerenciarUsuarios() {
  const { buscarUsuarioById, usuario, carregando } = useUsuarios();

  const { id } = useParams();

  console.log(id);
  console.log(usuario);

  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("");
  const [funcao, setFuncao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      await buscarUsuarioById(id);
    };

    carregarDados();
  }, []);

  return <div></div>;
}
