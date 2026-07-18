import hotelApi from "./hotelApi";

export const listarHabitaciones = async () => {
  const response = await hotelApi.get("/habitaciones");
  return response.data;
};

export const listarHabitacionesDisponibles = async (fechaEntrada, fechaSalida) => {
  const response = await hotelApi.get("/habitaciones/disponibles", {
    params: {
      fechaEntrada,
      fechaSalida,
    },
  });

  return response.data;
};