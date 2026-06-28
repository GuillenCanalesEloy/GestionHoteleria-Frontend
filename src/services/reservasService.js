import hotelApi from "./hotelApi";

export const listarReservas = async () => {
  const response = await hotelApi.get("/reservas");
  return response.data;
};

export const listarMisReservas = async (usuarioId) => {
  const response = await hotelApi.get(`/reservas/usuario/${usuarioId}`);
  return response.data;
};

export const crearReserva = async (reserva) => {
  const response = await hotelApi.post("/reservas", reserva);
  return response.data;
};