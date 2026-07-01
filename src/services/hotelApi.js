import axios from "axios";

const isDev = import.meta.env.DEV;

const hotelApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  // En local falla rápido; en producción (Render free tier) espera el cold-start
  timeout: isDev ? 8000 : 35000,
});

// En producción: reintenta hasta 2 veces solo si fue timeout (cold-start de Render)
// En local: falla inmediatamente para no ocultar que el backend no está levantado
hotelApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || isDev) return Promise.reject(error);

    const isTimeout = error.code === "ECONNABORTED";
    config._retryCount = config._retryCount ?? 0;

    if (isTimeout && config._retryCount < 2) {
      config._retryCount += 1;
      await new Promise((resolve) =>
        setTimeout(resolve, config._retryCount * 2000),
      );
      return hotelApi(config);
    }

    return Promise.reject(error);
  },
);

hotelApi.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith("/auth/")) {
      return config;
    }
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
  updateEstado: (id, estado) => hotelApi.patch(`/reservas/${id}/estado`, { estado }),
  delete: (id) => hotelApi.delete(`/reservas/${id}`),
};

export const pagosApi = {
  getAll: () => hotelApi.get("/pagos"),
  getById: (id) => hotelApi.get(`/pagos/${id}`),
  getByReserva: (reservaId) => hotelApi.get(`/pagos/reserva/${reservaId}`),
  create: (data) => hotelApi.post("/pagos", data),
};

export const habitacionesApi = {
  getAll: (params) => hotelApi.get("/habitaciones", { params }),
  getById: (id) => hotelApi.get(`/habitaciones/${id}`),
  getDisponibles: (params) => hotelApi.get("/habitaciones/disponibles", { params }),
  create: (data) => hotelApi.post("/habitaciones", data),
  update: (id, data) => hotelApi.put(`/habitaciones/${id}`, data),
  patch: (id, data) => hotelApi.patch(`/habitaciones/${id}`, data),
  delete: (id) => hotelApi.delete(`/habitaciones/${id}`),
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

export const dashboardApi = {
  getResumen: () => hotelApi.get("/dashboard/resumen"),
  getReservas: (params) => hotelApi.get("/dashboard/reservas", { params }),
  getIngresos: (params) => hotelApi.get("/dashboard/ingresos", { params }),
  getOcupacion: (params) => hotelApi.get("/dashboard/ocupacion", { params }),
  getMetricas: (params) => hotelApi.get("/dashboard/metricas", { params }),
};

export default hotelApi;
