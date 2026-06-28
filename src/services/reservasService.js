import hotelApi from './hotelApi.js';

export function crearReserva(payload) {
  return hotelApi.post('/reservas', payload);
}

export function confirmarPagoSimulado(reservaId) {
  return hotelApi.post(`/reservas/${reservaId}/confirmar-pago-simulado`);
}
