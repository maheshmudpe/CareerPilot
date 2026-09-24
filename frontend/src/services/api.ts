import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem("careerpilot_auth");

  if (storedAuth) {
    try {
      const { token } = JSON.parse(storedAuth) as {
        token: string;
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("careerpilot_auth");
    }
  }

  return config;
});

export default api;