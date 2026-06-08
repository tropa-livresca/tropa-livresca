export const apiFetch = async (endpoint, options = {}) => {
  options.credentials = "include";
  options.headers = {
    ...options.headers,
  };

  if(!(options.body instanceof FormData)){
    options.headers["Content-Type"] = "application/json";
  }

  let response = await fetch(
    `${import.meta.env.VITE_API_URL}${endpoint}`,
    options,
  );

  if (response.status === 401 && endpoint !== "/api/auth/refresh") {
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
          options,
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
