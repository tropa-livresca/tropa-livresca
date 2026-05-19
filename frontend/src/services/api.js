const BASE_URL = ["http://localhost:5173","https://ominous-waddle-7v5xpwvw7qwg2pg9v-3000.app.github.dev", "https://solid-space-eureka-r46pqvxg4666hw5.app.github.dev"];

export const apiFetch = async (endpoint, options = {}) => {
  options.credentials = "include"; 
  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  let response = await fetch(`${BASE_URL[1]}${endpoint}`, options);

  if (response.status === 401 && endpoint !== "/api/auth/refresh") {
    try {
      const refreshResponse = await fetch(`${BASE_URL[1]}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        response = await fetch(`${BASE_URL[1]}${endpoint}`, options);
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Erro ao tentar renovar sessão:", error);
      window.location.href = "/login";
    }
  }

  return response;
};
