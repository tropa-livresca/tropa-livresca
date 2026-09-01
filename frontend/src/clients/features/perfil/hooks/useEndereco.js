import { useCallback, useState } from "react";
import { apiFetch } from "../../../../common/services/api";

export const useEndereco = () => {
  const [popup, setPopup] = useState(null);

  const mostrarPopup = useCallback((tipo, mensagem) => {
    setPopup({
      tipo,
      mensagem,
    });
  }, []);

  const fecharPopup = useCallback(() => {
    setPopup(null);
  }, []);

  const [endereco, setEndereco] = useState(null);
  const [enderecos, setEnderecos] = useState([]);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [CEP, setCEP] = useState("");
  const [complemento, setComplemento] = useState("");
  const [pais, setPais] = useState("");
  const [carregando, setCarregando] = useState(false);

  const LimparFormulario = useCallback(() => {
    setEstado("");
    setCidade("");
    setBairro("");
    setRua("");
    setNumero("");
    setCEP("");
    setComplemento("");
    setPais("");
    setEndereco(null);
  }, []);

  const ValidarCampos = useCallback(() => {
    if (!CEP || CEP.trim() === "") {
      mostrarPopup("erro", "O campo CEP é obrigatório.");
      return false;
    }
    if (!estado || estado.trim() === "") {
      mostrarPopup("erro", "O campo Estado é obrigatório.");
      return false;
    }
    if (!cidade || cidade.trim() === "") {
      mostrarPopup("erro", "O campo Cidade é obrigatório.");
      return false;
    }
    if (!bairro || bairro.trim() === "") {
      mostrarPopup("erro", "O campo Bairro é obrigatório.");
      return false;
    }
    if (!rua || rua.trim() === "") {
      mostrarPopup("erro", "O campo Rua é obrigatório.");
      return false;
    }
    if (!numero || numero.trim() === "") {
      mostrarPopup("erro", "O campo Número é obrigatório.");
      return false;
    }
    if (!pais || pais.trim() === "") {
      mostrarPopup("erro", "O campo País é obrigatório.");
      return false;
    }
    return true;
  }, [CEP, estado, cidade, bairro, rua, numero, pais, mostrarPopup]);

  const AplicarMascaraCEP = useCallback((valor) => {
    const apenasNumeros = valor.replace(/\D/g, "");

    if (apenasNumeros.length <= 5) {
      setCEP(apenasNumeros);
    } else {
      setCEP(`${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5, 8)}`);
    }
  }, []);

  const BuscarCepAutomatico = useCallback(async (cepInformado) => {
    const cepLimpo = cepInformado.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    setCarregando(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!response.ok) throw new Error("Erro na busca do CEP.");

      const json = await response.json();

      if (json.erro) {
        mostrarPopup("", "CEP não encontrado.");
        return;
      }

      setEstado(json.uf || "");
      setCidade(json.localidade || "");
      setBairro(json.bairro || "");
      setRua(json.logradouro || "");
      setComplemento(json.complemento || "");
      setPais("Brasil");
    } catch (error) {
      console.error("Erro ao buscar CEP externo: ", error);
    } finally {
      setCarregando(false);
    }
  }, [mostrarPopup]);

  const BuscarEnderecos = useCallback(async () => {
    setCarregando(true);
    try {
      const response = await apiFetch("/api/v1/clients/enderecos");

      if (!response.ok) {
        if (response.status === 404) {
          setEnderecos([]);
          return;
        }
        throw new Error(`Erro ${response.status}`);
      }

      const json = await response.json();
      const dadosEnderecos = json.data || json;
      setEnderecos(dadosEnderecos);
    } catch (error) {
      console.error("Erro ao buscar endereços: ", error);
      setEnderecos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  const BuscarEnderecoById = useCallback(async (id) => {
    if (!id) return;
    setCarregando(true);
    try {
      const response = await apiFetch(`/api/v1/clients/enderecos/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 404) {
          setEndereco(null);
          return;
        }
        throw new Error(`Erro ${response.status}`);
      }

      const json = await response.json();
      const dadosEndereco = json.data || json;
      setEndereco(dadosEndereco);

      const valorCep = dadosEndereco.cep || "";
      if (valorCep.replace(/\D/g, "").length === 8) {
        setCEP(`${valorCep.slice(0, 5)}-${valorCep.slice(5, 8)}`);
      } else {
        setCEP(valorCep);
      }

      setEstado(dadosEndereco.estado || "");
      setCidade(dadosEndereco.cidade || "");
      setBairro(dadosEndereco.bairro || "");
      setRua(dadosEndereco.rua || "");
      setNumero(dadosEndereco.num || ""); 
      setPais(dadosEndereco.pais || "");
      setComplemento(dadosEndereco.complemento || "");
    } catch (error) {
      console.error("Erro ao buscar endereço: ", error);
      setEndereco(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  const FinalizarPayload = useCallback(() => {
    return JSON.stringify({
      estado,
      pais,
      cep: CEP.replace(/\D/g, ""),
      cidade,
      bairro,
      rua,
      num: numero,
      complemento,
    });
  }, [estado, pais, CEP, cidade, bairro, rua, numero, complemento]);

  const AtualizarEndereco = useCallback(async (id, e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!id) return;
    if (!ValidarCampos()) return;

    setCarregando(true);
    try {
      const response = await apiFetch(`/api/v1/clients/enderecos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: FinalizarPayload(),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      const json = await response.json();
      const data = json.data || json;

      setEndereco(data);
       mostrarPopup("sucesso", "Informações atualizadas com sucesso!");
      await BuscarEnderecos();
    } catch (error) {
      console.error("Erro ao atualizar endereço: ", error);
      mostrarPopup("erro", "Ocorreu um erro ao atualizar o endereço.");
    } finally {
      setCarregando(false);
    }
  }, [ValidarCampos, FinalizarPayload, BuscarEnderecos, mostrarPopup]);

  const InativarEndereco = useCallback(async (id) => {
    if (!id) return;
    setCarregando(true);

    try {
      const response = await apiFetch(`/api/v1/clients/enderecos/${id}/ativo`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      const json = await response.json();
      const data = json.data || json;

      setEndereco(data);
      mostrarPopup("sucesso", "Status do endereço alterado com sucesso!");
      await BuscarEnderecos();
    } catch (error) {
      console.error("Erro ao alterar status do endereço", error);
      mostrarPopup("erro", "Ocorreu um erro ao alterar o status do endereço.");
    } finally {
      setCarregando(false);
    }
  }, [BuscarEnderecos, mostrarPopup]);

  const handleCriarEndereco = useCallback(async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!ValidarCampos()) return;
    
    setCarregando(true);

    try {
      const response = await apiFetch(`/api/v1/clients/enderecos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: FinalizarPayload(),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      const json = await response.json();
      const data = json.data || json;

      setEndereco(data);
      mostrarPopup("sucesso", "Endereço criado com sucesso!");
      LimparFormulario();
      await BuscarEnderecos();
    } catch (error) {
      console.error("Erro ao criar endereço", error);
      mostrarPopup("erro", "Ocorreu um erro ao criar endereço.");
    } finally {
      setCarregando(false);
    }
  }, [ValidarCampos, FinalizarPayload, LimparFormulario, BuscarEnderecos,mostrarPopup]);

  const BuscarEnderecoPrincipal = useCallback(async()=>{
    try{
      const response = await apiFetch(`/api/v1/clients/enderecos/principal`, {
        method: "GET"
      });

      if(!response.ok) throw new Error(`Erro ${response.status}`);

      const json = await response.json();
      const data = json.data || json;

      setEndereco(data);
    }catch(error){
      console.error("Erro ao buscar endereço principal: ", error);
    }
  }, []);

  const DefinirEnderecoPrincipal = useCallback(async (id) => {
    if (!id) return;
    setCarregando(true);

    try {
      const response = await apiFetch(`/api/v1/clients/enderecos/${id}/principal`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      const json = await response.json();
      const data = json.data || json;

      setEndereco(data);
      mostrarPopup("sucesso", "Endereço definido como principal com sucesso!");
      await BuscarEnderecos();
    } catch (error) {
      console.error("Erro ao definir endereço principal: ", error);
      mostrarPopup("erro", "Ocorreu um erro ao atualizar o endereço principal.");
    } finally {
      setCarregando(false);
    }
  }, [BuscarEnderecos, mostrarPopup]);

  return {
    endereco,
    setEndereco,
    enderecos,
    setEnderecos,
    estado,
    setEstado,
    cidade,
    setCidade,
    bairro,
    setBairro,
    rua,
    setRua,
    numero,
    setNumero,
    CEP,
    setCEP,
    complemento,
    setComplemento,
    pais,
    setPais,
    carregando,
    BuscarEnderecos,
    BuscarEnderecoById,
    AtualizarEndereco,
    InativarEndereco,
    LimparFormulario,
    handleCriarEndereco,
    BuscarCepAutomatico,
    AplicarMascaraCEP,
    DefinirEnderecoPrincipal,
    BuscarEnderecoPrincipal,
    popup,
    fecharPopup,
  };
};
