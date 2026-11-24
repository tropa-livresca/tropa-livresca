import pb from "./pocketbase.js";
import { apiFetch } from "./api.js";

export async function loginComGoogle() {
  // Abre o popup imediatamente, durante o clique do usuário.
  const popup = window.open("", "oauth2-popup", "width=600,height=700");

  try {
    if (!popup) {
      throw new Error(
        "Não foi possível abrir a janela de autenticação. Verifique se o navegador bloqueou o popup.",
      );
    }

    const authData = await pb.collection("users_profile").authWithOAuth2({
      provider: "google",

      // Personaliza a URL antes de redirecionar para o Google.
      urlCallback: (url) => {
        const authUrl = new URL(url);

        authUrl.searchParams.set("prompt", "select_account");

        popup.location.href = authUrl.toString();
      },
    });

    if (!authData?.token) {
      throw new Error("A autenticação Google não retornou um token válido.");
    }

    const response = await apiFetch("/api/v1/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: authData.token,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível estabelecer a sessão.");
    }

    if (!data.user) {
      throw new Error("O servidor não retornou os dados do usuário.");
    }

    pb.authStore.clear();

    return data.user;
  } catch (error) {
    try {
      if (popup && !popup.closed) {
        popup.close();
      }
    } catch {
      // Ignora bloqueios do navegador.
    }

    pb.authStore.clear();

    console.error("[Google OAuth] Erro na autenticação:", error);

    throw error;
  }
}
