import { apiFetch } from "../../services/api";

const useSuporte = () => {
  const [campos, setCampos] = useState({
    email: "",
    nome: "",
    mensagem: "",
    motivo: "",
    telefone: "",
  });

  const [message, setMessage] = useState({ text: "", success: false });

  const [isLoading, setIsLoading] = useState(false);

  const enviarEmail = async (e) => {
    e.preventDefault();
    setMessage({
      text: "Formulário enviado com sucesso! Em breve te responderemos, por e-mail ou telefone.",
      success: true,
    });

    const formData = new FormData();
    Object.keys(campos).forEach((key) => FormData.append(key, campos[key]));

    try {
      const response = await apiFetch("/api/perfil");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
    } catch (err) {
        console.error("Erro em useSuporte.js", err);
    }
  };
};
export default useSuporte;
