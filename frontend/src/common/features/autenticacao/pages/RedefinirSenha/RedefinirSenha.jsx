import { useEffect, useState } from "react";
import { useRedefinirSenha } from "../../hooks/useRedefinirSenha";
import { useNavigate, useLocation } from "react-router-dom";
import supabase from "../../config/supabase";

export default function RedefinirSenha() {

  const {
    novaSenha, 
    setNovaSenha,
    confirmarSenha, 
    setConfirmarSenha,
    error, 
    setError,
    enviarRedefinirSenha,
    carregando,
    sucesso,

  } = useRedefinirSenha();

  const navigate = useNavigate();
  const location = useLocation();

  const iniciarRedefinirSenha = async (e) => {
      e.preventDefault();
      setError("");

      console.log( location.hash);
  
      if (novaSenha !== confirmarSenha) {
        setError("As senhas nao coincidem.");
        return;
      }
  
      try {

        const { data, error } = await supabase.auth.setSession({
      access_token: location.hash.split("&")[0].split("#")[1].split("=")[1],
      refresh_token: location.hash.split("&")[3].split("=")[1],
    });
        setNovaSenha("");
        setConfirmarSenha("");
        setTimeout(() => navigate("/auth/login"), 3000);

        if(error == null){
          enviarRedefinirSenha();
        }
      } catch (err) {
        setError(err.message || "Erro ao conectar com o servidor.");
      } 

    };

  return (
    <div>
      <form onSubmit={iniciarRedefinirSenha}>
        <h1>REDEFINIR SENHA</h1>
        <p>Digite e confirme sua nova senha abaixo para atualizar sua conta</p>

        <div>
          <label htmlFor="novaSenha">Nova Senha</label>
          <input
            type="password"
            name="novaSenha"
            id="novaSenha"
            placeholder="Digite a nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            disabled={carregando}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
          <input
            type="password"
            name="confirmarSenha"
            id="confirmarSenha"
            placeholder="Repita a nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={carregando}
            required
          />
        </div>

        <div>
          {error && <span style={{ color: "red" }}>{error}</span>}
          {sucesso && <span style={{ color: "green" }}>{sucesso}</span>}
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "ATUALIZANDO..." : "Redefinir Senha"}
        </button>
      </form>
    </div>
  );
}
