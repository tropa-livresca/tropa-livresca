export const apiFetch = async (endpoint, options = {}) => {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  fetchOptions.credentials = "include";
  fetchOptions.headers = { ...fetchOptions.headers };

  if (!(fetchOptions.body instanceof FormData)) {
    fetchOptions.headers["Content-Type"] = "application/json";
  }

  const urlBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "";
  const caminhoEndpoint = (endpoint.startsWith("/") ? endpoint : `/${endpoint}`).replace(/\/$/, "");

  let response = await fetch(`${urlBase}${caminhoEndpoint}`, fetchOptions);

  const ehRotaRefresh = caminhoEndpoint.endsWith("/auth/refresh") || caminhoEndpoint.endsWith("/refresh");

  if (response.status === 401 && !ehRotaRefresh && !skipAuthRedirect) {
    try {
      const URL_ATUAL = window.location.pathname;
      const ehAdmin = URL_ATUAL.startsWith("/admin") || URL_ATUAL.includes("/auth/admin");

      const urlRefresh = ehAdmin
        ? `${urlBase}/api/v1/admin/auth/refresh`
        : `${urlBase}/api/v1/clients/auth/refresh`;

      const rotaLogin = ehAdmin ? "/auth/admin" : "/auth/login";

      const refreshResponse = await fetch(urlRefresh, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        response = await fetch(`${urlBase}${caminhoEndpoint}`, fetchOptions);
      } else if (window.location.pathname !== rotaLogin) {
        window.location.href = rotaLogin;
      }
    } catch (error) {
      console.error("Erro ao tentar renovar sessão:", error);
      const ehAdmin = window.location.pathname.startsWith("/admin") || window.location.pathname.includes("/auth/admin");
      const rotaLogin = ehAdmin ? "/auth/admin" : "/auth/login";
      
      if (window.location.pathname !== rotaLogin) {
        window.location.href = rotaLogin;
      }
    }
  }

  return response;
};
