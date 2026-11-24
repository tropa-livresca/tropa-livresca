import pb from "./pocketbase.js";
import { apiFetch } from "./api.js";

export async function loginComGoogle() {
  const popup = window.open("", "oauth2-popup", "width=600,height=700");

  try {
    if (!popup) {
      throw new Error(
        "Não foi possível abrir a janela de autenticação. Verifique se o navegador bloqueou o popup.",
      );
    }

    const authMethods = await pb.collection("users_profile").listAuthMethods();

    const providers =
      authMethods.oauth2?.providers || authMethods.authProviders || [];

    const googleProvider = providers.find(
      (provider) => provider.name === "google",
    );

    if (!googleProvider) {
      throw new Error("Provedor Google não encontrado.");
    }

    const redirectUrl = pb.buildURL("/api/oauth2-redirect");

    const authUrl = new URL(
      (googleProvider.authURL || googleProvider.authUrl) + redirectUrl,
    );

    authUrl.searchParams.set("prompt", "select_account");

    const authData = await new Promise((resolve, reject) => {
      let finalizado = false;

      const timeout = setTimeout(
        () => {
          finalizar(
            reject,
            new Error("Tempo limite da autenticação Google excedido."),
          );
        },
        5 * 60 * 1000,
      );

      const finalizar = (callback, resultado) => {
        if (finalizado) return;

        finalizado = true;

        clearTimeout(timeout);

        pb.realtime.unsubscribe("@oauth2");

        try {
          popup.close();
        } catch {
          // O navegador pode bloquear o acesso ao popup por COOP.
        }

        callback(resultado);
      };

      pb.realtime.subscribe("@oauth2", async (e) => {
        if (e.state !== googleProvider.state || finalizado) {
          return;
        }

        if (e.error || !e.code) {
          finalizar(
            reject,
            new Error(e.error || "Erro na autenticação Google."),
          );
          return;
        }

        try {
          const res = await pb
            .collection("users_profile")
            .authWithOAuth2Code(
              googleProvider.name,
              e.code,
              googleProvider.codeVerifier,
              redirectUrl,
            );

          finalizar(resolve, res);
        } catch (error) {
          finalizar(reject, error);
        }
      });

      popup.location.href = authUrl.toString();
    });

    const response = await apiFetch("/api/v1/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: authData.token }),
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
      popup?.close();
    } catch {
      // Ignora bloqueios de acesso ao popup.
    }

    pb.authStore.clear();

    throw error;
  }
}
