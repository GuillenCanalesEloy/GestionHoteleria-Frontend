const CLIENT_RESERVATIONS_KEY = "luxestay.clientReservations";

export function getClientReservations() {
  try {
    const storedReservations = localStorage.getItem(CLIENT_RESERVATIONS_KEY);
    if (!storedReservations) {
      return [];
    }

    const parsedReservations = JSON.parse(storedReservations);
    return Array.isArray(parsedReservations) ? parsedReservations : [];
  } catch {
    return [];
  }
}

export function saveClientReservation(reservation) {
  const currentReservations = getClientReservations();
  const nextReservations = [reservation, ...currentReservations];
  localStorage.setItem(CLIENT_RESERVATIONS_KEY, JSON.stringify(nextReservations));
  return nextReservations;
}

export function saveClientReservations(reservations) {
  localStorage.setItem(CLIENT_RESERVATIONS_KEY, JSON.stringify(reservations));
  return reservations;
}
