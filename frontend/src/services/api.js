export const apiFetch = async (endpoint, options = {}) => {
  const { skipAuthRedirect = false, ...fetchOptions } = options;
  fetchOptions.credentials = "include";
  fetchOptions.headers = {
    ...fetchOptions.headers,
  };

  if (!(fetchOptions.body instanceof FormData)) {
    fetchOptions.headers["Content-Type"] = "application/json";
  }

  let response = await fetch(
    `${import.meta.env.VITE_API_URL}${endpoint}`,
    fetchOptions,
  );

  if (
    response.status === 401 &&
    endpoint !== "/api/auth/refresh" &&
    !skipAuthRedirect
  ) {
    try {
      const refreshResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (refreshResponse.ok) {
        response = await fetch(
          `${import.meta.env.VITE_API_URL}${endpoint}`,
          fetchOptions,
        );
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
