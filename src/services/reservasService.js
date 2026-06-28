import hotelApi from './hotelApi.js';

export function crearReserva(payload) {
  return hotelApi.post('/reservas', payload);
}
