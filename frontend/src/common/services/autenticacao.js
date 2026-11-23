import pb from "./pocketbase.js";
import { apiFetch } from "./api.js";

export async function loginComGoogle() {
  const popup = window.open("", "oauth2-popup", "width=600,height=700");

  try {
    const authMethods = await pb.collection("users_profile").listAuthMethods();
    const providers = authMethods.oauth2?.providers || authMethods.authProviders || [];
    const googleProvider = providers.find((p) => p.name === "google");

    if (!googleProvider) {
      throw new Error("Provedor Google não encontrado.");
    }

    const authUrl = new URL(googleProvider.authURL || googleProvider.authUrl);
    authUrl.searchParams.set("prompt", "select_account");

    if (popup) {
      popup.location.href = authUrl.toString();
    }

    const authData = await new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error("Janela fechada pelo usuário."));
        }
      }, 500);

      pb.realtime.subscribe("@oauth2", async (e) => {
        if (e.state !== googleProvider.state) return;

        clearInterval(checkClosed);
        pb.realtime.unsubscribe("@oauth2");
        popup?.close();

        if (e.error || !e.code) {
          reject(new Error(e.error || "Erro na autenticação Google."));
          return;
        }

        try {
          const redirectUrl = `${pb.baseURL || pb.baseUrl}/api/oauth2-redirect`;
          const res = await pb.collection("users_profile").authWithOAuth2Code(
            googleProvider.name,
            e.code,
            googleProvider.codeVerifier,
            redirectUrl
          );
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
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
    if (popup && !popup.closed) popup.close();
    pb.authStore.clear();
    throw error;
  }
}
