export const ROOMS_STORAGE_KEY = 'gestionHotelera.rooms';

const defaultImageByType = {
  Individual: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=900',
  Doble: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900',
  Suite: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=900',
};

const publicTagByType = {
  Individual: 'Business',
  Doble: 'Deluxe',
  Suite: 'Suite',
};

export const defaultAdminRooms = [
  { id: 1, number: '402', type: 'Suite', status: 'disponible', price: 450, capacity: 4, floor: 4 },
  { id: 2, number: '305', type: 'Doble', status: 'ocupada', price: 220, capacity: 2, floor: 3 },
  { id: 3, number: '101', type: 'Individual', status: 'mantenimiento', price: 140, capacity: 1, floor: 1 },
  { id: 4, number: '204', type: 'Doble', status: 'disponible', price: 220, capacity: 2, floor: 2 },
  { id: 5, number: '405', type: 'Suite', status: 'ocupada', price: 450, capacity: 4, floor: 4 },
];

export function normalizeRoom(room) {
  const type = room.type || 'Individual';
  const capacity = Number(room.capacity) || 1;
  const floor = Number(room.floor) || 1;
  const price = Number(room.price) || 0;
  const number = String(room.number || '').trim();

  return {
    id: room.id || Date.now(),
    number,
    type,
    status: room.status || 'disponible',
    price,
    capacity,
    floor,
    title: room.title || `Habitacion ${type} ${number}`,
    tag: room.tag || publicTagByType[type] || type,
    rating: room.rating || '4.8',
    guests: room.guests || `${capacity} ${capacity === 1 ? 'Adult' : 'Adults'}`,
    size: room.size || `${Math.max(32, capacity * 18)} m2`,
    image: room.image || defaultImageByType[type] || defaultImageByType.Individual,
    description:
      room.description ||
      `Habitacion ${type.toLowerCase()} numero ${number}, ubicada en el piso ${floor}, preparada para ${capacity} huesped${capacity === 1 ? '' : 'es'}.`,
    features: room.features || [
      `${capacity} huesped${capacity === 1 ? '' : 'es'}`,
      `Piso ${floor}`,
      'Bano privado',
      'Smart TV',
      'Internet',
    ],
  };
}

export function getStoredRooms() {
  const fallbackRooms = defaultAdminRooms.map(normalizeRoom);

  try {
    const storedRooms = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (!storedRooms) {
      return fallbackRooms;
    }

    const parsedRooms = JSON.parse(storedRooms);
    if (!Array.isArray(parsedRooms)) {
      return fallbackRooms;
    }

    return parsedRooms.map(normalizeRoom);
  } catch {
    return fallbackRooms;
  }
}

export function saveStoredRooms(rooms) {
  localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms.map(normalizeRoom)));
}
