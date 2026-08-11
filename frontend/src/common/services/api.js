export const apiFetch = async (endpoint, options = {}) => {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  fetchOptions.credentials = "include";
  fetchOptions.headers = { ...fetchOptions.headers };

  if (!(fetchOptions.body instanceof FormData)) {
    fetchOptions.headers["Content-Type"] = "application/json";
  } else {
    delete fetchOptions.headers["Content-Type"];
  }

  let backupFormData = null;
  if (fetchOptions.body instanceof FormData) {
    backupFormData = new FormData();
    for (const [key, value] of fetchOptions.body.entries()) {
      backupFormData.append(key, value);
    }
  }

  const fallbackUrlBase = import.meta.env.DEV ? "" : "";
  const urlBase = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : fallbackUrlBase;
  const caminhoEndpoint = (
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  ).replace(/\/$/, "");

  let response = await fetch(`${urlBase}${caminhoEndpoint}`, fetchOptions);

  const ehRotaIgnorada =
    caminhoEndpoint.endsWith("/auth/refresh") ||
    caminhoEndpoint.endsWith("/refresh") ||
    caminhoEndpoint.endsWith("/auth/session") ||
    caminhoEndpoint.endsWith("/session");

  if (response.status === 401 && !ehRotaIgnorada && !skipAuthRedirect) {
    try {
      const URL_ATUAL = window.location.pathname;
      const ehAdmin =
        URL_ATUAL.startsWith("/admin") || URL_ATUAL.includes("/auth/admin");

      // Rota de refresh unificada conforme solicitado
      const urlRefresh = `${urlBase}/api/v1/auth/refresh`;
      const rotaLogin = ehAdmin ? "/auth/admin" : "/auth/login";

      const refreshResponse = await fetch(urlRefresh, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        if (backupFormData) {
          const novoSubmitData = new FormData();
          for (const [key, value] of backupFormData.entries()) {
            novoSubmitData.append(key, value);
          }
          fetchOptions.body = novoSubmitData;
          delete fetchOptions.headers["Content-Type"];
        }
        response = await fetch(`${urlBase}${caminhoEndpoint}`, fetchOptions);
      } else {
        const payload = await refreshResponse.json().catch(() => ({}));
        if (payload?.error === "Token de atualização não fornecido.") {
          return response;
        }

        if (window.location.pathname !== rotaLogin) {
          window.location.href = rotaLogin;
        }
      }
    } catch (error) {
      console.error("Erro ao tentar renovar sessão:", error);
      const ehAdmin =
        window.location.pathname.startsWith("/admin") ||
        window.location.pathname.includes("/auth/admin");
      const rotaLogin = ehAdmin ? "/auth/admin" : "/auth/login";

      if (window.location.pathname !== rotaLogin) {
        window.location.href = rotaLogin;
      }
    }
  }

  return response;
};
