import axios from "axios";

const hotelApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 8000,
});

hotelApi.interceptors.request.use(
  (config) => {
    const adminSessionString = localStorage.getItem("luxestay.adminSession");
    const clientSessionString = localStorage.getItem("luxestay.clientSession");

    let token = null;
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

export const clientesApi = {
  getAll: () => hotelApi.get("/clientes"),
  getById: (id) => hotelApi.get(`/clientes/${id}`),
  create: (data) => hotelApi.post("/clientes", data),
  update: (id, data) => hotelApi.put(`/clientes/${id}`, data),
  delete: (id) => hotelApi.delete(`/clientes/${id}`),
};

export const reservasApi = {
  getAll: (params) => hotelApi.get("/reservas", { params }),
  getById: (id) => hotelApi.get(`/reservas/${id}`),
  getByCliente: (clienteId) => hotelApi.get(`/reservas/cliente/${clienteId}`),
  create: (data) => hotelApi.post("/reservas", data),
  update: (id, data) => hotelApi.put(`/reservas/${id}`, data),
  delete: (id) => hotelApi.delete(`/reservas/${id}`),
};

export const habitacionesApi = {
  getAll: (params) => hotelApi.get("/habitaciones", { params }),
  getById: (id) => hotelApi.get(`/habitaciones/${id}`),
  getDisponibles: (params) =>
    hotelApi.get("/habitaciones/disponibles", { params }),
};

export default hotelApi;