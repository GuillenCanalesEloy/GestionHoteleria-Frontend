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

export const habitacionesApi = {
  getAll: (params) => hotelApi.get("/habitaciones", { params }),
  getById: (id) => hotelApi.get(`/habitaciones/${id}`),
};

export const areasComunesApi = {
  getAll: () => hotelApi.get("/areas-comunes"),
  getDisponibles: () => hotelApi.get("/areas-comunes/disponibles"),
  getById: (id) => hotelApi.get(`/areas-comunes/${id}`),
  create: (data) => hotelApi.post("/areas-comunes", data),
  update: (id, data) => hotelApi.put(`/areas-comunes/${id}`, data),
  updateEstado: (id, estado) => hotelApi.put(`/areas-comunes/${id}/estado`, JSON.stringify(estado), {
    headers: { "Content-Type": "application/json" },
  }),
  delete: (id) => hotelApi.delete(`/areas-comunes/${id}`),
};

export const reservasAreasComunesApi = {
  getAll: () => hotelApi.get("/reservas-areas-comunes"),
  getById: (id) => hotelApi.get(`/reservas-areas-comunes/${id}`),
  getByUsuario: (usuarioId) => hotelApi.get(`/reservas-areas-comunes/usuario/${usuarioId}`),
  getByArea: (areaComunId) => hotelApi.get(`/reservas-areas-comunes/area/${areaComunId}`),
  getByAreaAndDate: (areaComunId, fecha) =>
    hotelApi.get(`/reservas-areas-comunes/area/${areaComunId}/fecha`, { params: { fecha } }),
  create: (data) => hotelApi.post("/reservas-areas-comunes", data),
  updateEstado: (id, estado) =>
    hotelApi.put(`/reservas-areas-comunes/${id}/estado`, { estado }),
  delete: (id) => hotelApi.delete(`/reservas-areas-comunes/${id}`),
};

export default hotelApi;
