import axios from "axios";

const hotelApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 8000,
});

// Interceptor para añadir el token JWT a cada petición
hotelApi.interceptors.request.use(
  (config) => {
    // Intenta obtener la sesión de admin o de cliente desde localStorage
    const adminSessionString = localStorage.getItem("luxestay.adminSession");
    const clientSessionString = localStorage.getItem("luxestay.clientSession");

    let token = null;

    // Priorizamos la sesión de admin si ambas existen
    const sessionString = adminSessionString || clientSessionString;

    if (sessionString) {
      const session = JSON.parse(sessionString);
      token = session?.token;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Clientes (Usuarios)
export const clientesApi = {
  getAll: () => hotelApi.get("/clientes"),
  getById: (id) => hotelApi.get(`/clientes/${id}`),
  create: (data) => hotelApi.post("/clientes", data),
  update: (id, data) => hotelApi.put(`/clientes/${id}`, data),
  delete: (id) => hotelApi.delete(`/clientes/${id}`),
};

export const reservasApi = {
  getAll: (params) => hotelApi.get("/reservas", { params }),
};

export default hotelApi;
