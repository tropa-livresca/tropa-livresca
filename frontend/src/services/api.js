export const apiFetch = async (endpoint, options = {}) => {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  fetchOptions.credentials = "include";
  fetchOptions.headers = {
    ...fetchOptions.headers,
  };

  if (!(fetchOptions.body instanceof FormData)) {
    fetchOptions.headers["Content-Type"] = "application/json";
  }

  const urlBase = import.meta.env.VITE_API_URL.replace(/\/$/, "");
  const caminhoEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  let response = await fetch(`${urlBase}${caminhoEndpoint}`, fetchOptions);

  const ehRotaRefresh = caminhoEndpoint.endsWith("/auth/refresh") || caminhoEndpoint.endsWith("/refresh");

  if (response.status === 401 && !ehRotaRefresh && !skipAuthRedirect) {
    try {
      const urlRefresh = `${urlBase}/api/v1/clients/auth/refresh`;

      const refreshResponse = await fetch(urlRefresh, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        response = await fetch(`${urlBase}${caminhoEndpoint}`, fetchOptions);
      } else if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Erro ao tentar renovar sessão:", error);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }

  return response;
};
