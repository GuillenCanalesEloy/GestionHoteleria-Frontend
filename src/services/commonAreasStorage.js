export const COMMON_AREAS_KEY = "luxestay.commonAreas";
export const COMMON_AREA_RESERVATIONS_KEY = "luxestay.commonAreaReservations";

export const areaStatusLabels = {
  disponible: "DISPONIBLE",
  ocupada: "OCUPADA",
  mantenimiento: "MANTENIMIENTO",
};

export const reservationStatusLabels = {
  pendiente: "PENDIENTE",
  confirmada: "CONFIRMADA",
  cancelada: "CANCELADA",
  finalizada: "FINALIZADA",
};

const defaultAreas = [
  {
    id: "pool-deck",
    name: "Infinity Pool & Sun Deck",
    badge: "Popular",
    status: "disponible",
    capacity: 24,
    pricePerHour: 60,
    schedule: "07:00 - 21:00",
    image:
      "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=80",
    description:
      "Piscina panoramica con zona de descanso, tumbonas premium y atencion de bebidas.",
  },
  {
    id: "wellness-spa",
    name: "Wellness & Spa",
    badge: "Relax",
    status: "disponible",
    capacity: 8,
    pricePerHour: 85,
    schedule: "09:00 - 20:00",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    description:
      "Cabinas privadas, sauna y ambiente terapeutico para sesiones de bienestar.",
  },
  {
    id: "high-tech-gym",
    name: "High-Tech Gym",
    badge: "24/7",
    status: "disponible",
    capacity: 16,
    pricePerHour: 25,
    schedule: "00:00 - 23:59",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    description:
      "Equipamiento moderno, zona cardiovascular y espacio funcional para rutinas guiadas.",
  },
  {
    id: "azure-restaurant",
    name: "The Azure Restaurant",
    badge: "Cena",
    status: "ocupada",
    capacity: 40,
    pricePerHour: 120,
    schedule: "19:00 - 23:30",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    description:
      "Salon gastronomico para cenas privadas, reuniones especiales y celebraciones.",
  },
  {
    id: "private-lounge",
    name: "Private Lounge",
    badge: "Premium",
    status: "disponible",
    capacity: 12,
    pricePerHour: 75,
    schedule: "08:00 - 22:00",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
    description:
      "Lounge reservado con servicio de cafe, proyector y ambiente ejecutivo.",
  },
];

function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return fallback;
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getCommonAreas() {
  return readJson(COMMON_AREAS_KEY, defaultAreas);
}

export function saveCommonAreas(areas) {
  localStorage.setItem(COMMON_AREAS_KEY, JSON.stringify(areas));
  return areas;
}

export function normalizeCommonArea(area) {
  return {
    id: area.id || `area-${Date.now()}`,
    name: area.name?.trim() || "Area comun",
    badge: area.badge?.trim() || "Hotel",
    status: area.status || "disponible",
    capacity: Number(area.capacity) || 1,
    pricePerHour: Number(area.pricePerHour) || 0,
    schedule: area.schedule?.trim() || "08:00 - 22:00",
    image:
      area.image?.trim() ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    description: area.description?.trim() || "Espacio disponible para huespedes.",
  };
}

export function getAreaReservations() {
  return readJson(COMMON_AREA_RESERVATIONS_KEY, []);
}

export function saveAreaReservations(reservations) {
  localStorage.setItem(COMMON_AREA_RESERVATIONS_KEY, JSON.stringify(reservations));
  return reservations;
}

export function saveAreaReservation(reservation) {
  return saveAreaReservations([reservation, ...getAreaReservations()]);
}

export function minutesFromTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getReservationStart(reservation) {
  return new Date(`${reservation.date}T${reservation.startTime || "00:00"}`).getTime();
}

export function hasScheduleOverlap({ areaId, date, startTime, endTime, ignoreId }) {
  const start = minutesFromTime(startTime);
  const end = minutesFromTime(endTime);

  return getAreaReservations().some((reservation) => {
    if (
      reservation.id === ignoreId ||
      reservation.areaId !== areaId ||
      reservation.date !== date ||
      reservation.status === "cancelada" ||
      reservation.status === "finalizada"
    ) {
      return false;
    }

    const reservedStart = minutesFromTime(reservation.startTime);
    const reservedEnd = minutesFromTime(reservation.endTime);
    return start < reservedEnd && end > reservedStart;
  });
}
