import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../common/services/api";
import { PerfilContext } from "./PerfilContext.jsx";

export function PerfilProvider({ children }) {
    const [perfil, setPerfil] = useState(null);
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");
    const [redesSociais, setRedesSociais] = useState({
        instagram: "",
        facebook: "",
        linkedin: "",
        email: "",
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [editando, setEditando] = useState(false);

    const resetEstados = useCallback(() => {
        setPerfil(null);
        setNome("");
        setDescricao("");
        setTelefone("");
        setPreviewUrl(null);
        setImagem("");
        setRedesSociais({ instagram: "", facebook: "", linkedin: "", email: "" });
    }, []);

    const getPerfil = useCallback(async () => {
        try {
            const response = await apiFetch("/api/v1/clients/perfil");
            if (!response.ok) {
                if (response.status === 404) {
                    resetEstados();
                    return;
                }
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }
            const json = await response.json();
            const dadosPerfil = json.data || json;

            setPerfil(dadosPerfil);
            setNome(dadosPerfil.nome || "");
            setDescricao(dadosPerfil.descricao || "");
            setTelefone(dadosPerfil.telefone || "");
            setPreviewUrl(dadosPerfil.imagem || null);
            setRedesSociais({
                email: dadosPerfil.redes_sociais?.email || "",
                instagram: dadosPerfil.redes_sociais?.instagram || "",
                facebook: dadosPerfil.redes_sociais?.facebook || "",
                linkedin: dadosPerfil.redes_sociais?.linkedin || "",
            });
        } catch (error) {
            console.error("Erro ao recolher os dados do supabase", error);
        } finally {
            setCarregando(false);
        }
    }, [resetEstados]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <PerfilContext.Provider
            value={{
                perfil,
                setPerfil,
                nome,
                setNome,
                telefone,
                setTelefone,
                descricao,
                setDescricao,
                imagem,
                setImagem,
                redesSociais,
                setRedesSociais,
                previewUrl,
                setPreviewUrl,
                carregando,
                setCarregando,
                editando,
                setEditando,
                getPerfil,
                resetEstados,
            }}
        >
            {children}
        </PerfilContext.Provider>
    );
}
