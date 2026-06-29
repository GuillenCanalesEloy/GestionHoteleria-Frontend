export const areaStatusFromBackend = {
  DISPONIBLE: "disponible",
  OCUPADA: "ocupada",
  MANTENIMIENTO: "mantenimiento",
};

export const areaStatusToBackend = {
  disponible: "DISPONIBLE",
  ocupada: "OCUPADA",
  mantenimiento: "MANTENIMIENTO",
};

export const reservationStatusFromBackend = {
  PENDIENTE: "pendiente",
  CONFIRMADA: "confirmada",
  CANCELADA: "cancelada",
  FINALIZADA: "finalizada",
};

export const reservationStatusToBackend = {
  pendiente: "PENDIENTE",
  confirmada: "CONFIRMADA",
  cancelada: "CANCELADA",
  finalizada: "FINALIZADA",
};

const defaultAreaImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

export function mapBackendArea(area) {
  return {
    id: area.id,
    name: area.nombre,
    badge: area.estado || "Hotel",
    status: areaStatusFromBackend[area.estado] || "disponible",
    capacity: area.capacidadMaxima,
    pricePerHour: Number(area.precioPorHora || 0),
    schedule: "08:00 - 22:00",
    image: area.imagenUrl || defaultAreaImage,
    description: area.descripcion || "Espacio disponible para huéspedes.",
    raw: area,
  };
}

export function mapAreaRequest(area) {
  return {
    nombre: area.name?.trim(),
    descripcion: area.description?.trim(),
    capacidadMaxima: Number(area.capacity),
    precioPorHora: Number(area.pricePerHour),
    imagenUrl: area.image,
  };
}

export function mapBackendAreaReservation(reservation) {
  const status = reservationStatusFromBackend[reservation.estado] || "pendiente";
  const priceTotal = Number(reservation.precioTotal || 0);

  return {
    id: reservation.id,
    type: "area-comun",
    areaId: reservation.areaComunId,
    usuarioId: reservation.usuarioId,
    username: reservation.usuarioNombre || "Huésped",
    title: reservation.areaComunNombre || "Área común",
    image: defaultAreaImage,
    stage: status,
    date: reservation.fecha,
    startTime: reservation.horaInicio?.slice(0, 5),
    endTime: reservation.horaFin?.slice(0, 5),
    dates: `${reservation.fecha} / ${reservation.horaInicio?.slice(0, 5)} - ${reservation.horaFin?.slice(0, 5)}`,
    guests: "Por confirmar",
    status,
    total: `$${priceTotal.toFixed(2)}`,
    room: reservation.areaComunNombre || "Área común",
    duration: Number(reservation.duracionMinutos || 0) / 60,
    priceTotal,
    guest: {
      name: reservation.usuarioNombre || "Huésped",
      email: "Por confirmar",
      phone: "Por confirmar",
      requests: "Reserva registrada en backend.",
    },
    createdAt: reservation.createdAt,
    raw: reservation,
  };
}

export function mapAreaReservationRequest({ session, selectedArea, date, startTime, endTime }) {
  return {
    usuarioId: Number(session.id),
    areaComunId: Number(selectedArea.id),
    fecha: date,
    horaInicio: `${startTime}:00`,
    horaFin: `${endTime}:00`,
  };
}
