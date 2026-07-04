import {useState} from "react";
import Select from "../../../../components/form/Select/Select";

export default function Detalhes() {
  const [idioma, setIdioma] = useState("");
  const listaIdiomas = ["Português", "Inglês", "Espanhol", "Bilíngue: Português e Inglês", "Bilíngue: Português e Espanhol", "Outro"];

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");

  const [numeroEdicao, setNumeroEdicao] = useState("");

  const [autorNome, setAutorNome] = useState("");
  const [autorSobrenome, setAutorSobrenome] = useState("");

  const [colaboradores, setColaboradores] = useState([{ funcao: "", nome: "", sobrenome: "" }]);

  const [descricao, setDescricao] = useState("");

  const [direitoPublicacao, setDireitoPublicacao] = useState("");

  const [publicoPrincipal, setPublicoPrincipal] = useState("");

  const [categorias, setCategorias] = useState([]);

  const [palavrasChave, setPalavrasChave] = useState([]);


  return (
    <main>
      <form>
        <Select 
        name = "idioma"
        value = {idioma}
        handleOnChange = {setIdioma}
        options = {listaIdiomas}
        />


      </form>
    </main>
  );
}
