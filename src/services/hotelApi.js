import axios from "axios";

const hotelApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 8000,
});

// Clientes (Usuarios)
export const clientesApi = {
  getAll: () => hotelApi.get("/usuarios"),
  getById: (id) => hotelApi.get(`/usuarios/${id}`),
  create: (data) => hotelApi.post("/usuarios", data),
  update: (id, data) => hotelApi.put(`/usuarios/${id}`, data),
  delete: (id) => hotelApi.delete(`/usuarios/${id}`),
};

export default hotelApi;
