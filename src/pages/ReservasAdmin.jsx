import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getClientReservations,
  saveClientReservations,
} from "../services/clientReservationsStorage.js";
import { getStoredRooms } from "../services/roomsStorage.js";

const guestOptions = [
  "1 Adulto",
  "2 Adultos",
  "2 Adultos, 1 Nino",
  "Familia 4 Personas",
  "Grupo 6 Personas",
];

const fallbackReservations = [
  {
    id: "RES-94021",
    title: "Suite 402",
    room: "Suite 402",
    checkIn: "2026-04-26",
    checkOut: "2026-04-29",
    guests: "2 Adultos",
    status: "Confirmada",
    stage: "Proxima estadia",
    dates: "2026-04-26 - 2026-04-29",
    total: "$450.00",
    guest: {
      name: "user",
      email: "user@demo.com",
      phone: "999000000",
      requests: "Sin peticiones especiales.",
    },
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=900",
  },
];

const statusLabels = {
  Confirmada: "Confirmada",
  Pendiente: "Pendiente",
  Cancelada: "Cancelada",
};

function normalizeReservation(reservation) {
  const [fallbackCheckIn = "", fallbackCheckOut = ""] = reservation.dates
    ? reservation.dates.split(" - ")
    : [];

  return {
    ...reservation,
    id: reservation.id || `RES-${Date.now().toString().slice(-6)}`,
    room: reservation.room || reservation.title || "Habitacion",
    checkIn: reservation.checkIn || fallbackCheckIn,
    checkOut: reservation.checkOut || fallbackCheckOut,
    guests: reservation.guests || "1 Adulto",
    status: reservation.status || "Confirmada",
    guest: {
      name: reservation.guest?.name || "user",
      email: reservation.guest?.email || "user@demo.com",
      phone: reservation.guest?.phone || "Sin telefono",
      requests: reservation.guest?.requests || "Sin peticiones especiales.",
    },
  };
}

function ReservasAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [reservations, setReservations] = useState(() => {
    const storedReservations = getClientReservations().map(normalizeReservation);
    return storedReservations.length ? storedReservations : fallbackReservations;
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [form, setForm] = useState({
    room: "",
    checkIn: "",
    checkOut: "",
    guests: "1 Adulto",
    status: "Confirmada",
  });

  const selectedReservation = reservations.find(
    (reservation) => reservation.id === selectedReservationId,
  );

  const availableRooms = useMemo(
    () => getStoredRooms().filter((room) => room.status === "disponible"),
    [],
  );

  const roomOptions = useMemo(() => {
    const currentRoom = selectedReservation?.room;
    const currentRoomExists = availableRooms.some(
      (room) => room.title === currentRoom || `${room.type} ${room.number}` === currentRoom,
    );

    if (currentRoom && !currentRoomExists) {
      return [
        {
          id: "current-room",
          title: currentRoom,
          number: "",
          type: "Habitacion actual",
        },
        ...availableRooms,
      ];
    }

    return availableRooms;
  }, [availableRooms, selectedReservation]);

  useEffect(() => {
    const storedReservations = getClientReservations().map(normalizeReservation);
    if (storedReservations.length) {
      setReservations(storedReservations);
    }
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const searchText =
        `${reservation.id} ${reservation.guest.name} ${reservation.room}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "todos" || reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  const totals = useMemo(() => {
    return reservations.reduce(
      (accumulator, reservation) => {
        accumulator.total += 1;
        accumulator[reservation.status] += 1;
        return accumulator;
      },
      { total: 0, Confirmada: 0, Pendiente: 0, Cancelada: 0 },
    );
  }, [reservations]);

  const openReservationModal = (reservation) => {
    setSelectedReservationId(reservation.id);
    setForm({
      room: reservation.room,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guests: reservation.guests,
      status: reservation.status,
    });
  };

  const closeReservationModal = () => {
    setSelectedReservationId(null);
    setForm({
      room: "",
      checkIn: "",
      checkOut: "",
      guests: "1 Adulto",
      status: "Confirmada",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const persistReservations = (nextReservations) => {
    setReservations(nextReservations);
    saveClientReservations(nextReservations);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextReservations = reservations.map((reservation) =>
      reservation.id === selectedReservationId
        ? {
            ...reservation,
            title: form.room,
            room: form.room,
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            dates: `${form.checkIn} - ${form.checkOut}`,
            guests: form.guests,
            status: form.status,
            stage: form.status === "Cancelada" ? "Reserva cancelada" : "Proxima estadia",
          }
        : reservation,
    );

    persistReservations(nextReservations);
    closeReservationModal();
  };

  const cancelReservation = () => {
    const nextReservations = reservations.map((reservation) =>
      reservation.id === selectedReservationId
        ? { ...reservation, status: "Cancelada", stage: "Reserva cancelada" }
        : reservation,
    );
    persistReservations(nextReservations);
    closeReservationModal();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("todos");
  };

  return (
    <div className="admin-shell reservations-admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin/dashboard">
          <span>LM</span>
          <div>
            <strong>LuxeManage</strong>
            <small>Premium operations</small>
          </div>
        </Link>

        <nav className="admin-nav" aria-label="Panel administrativo">
          <Link className={location.pathname === "/admin/dashboard" ? "active" : ""} to="/admin/dashboard">
            Dashboard
          </Link>
          <Link className={location.pathname === "/admin/habitaciones" ? "active" : ""} to="/admin/habitaciones">
            Habitaciones
          </Link>
          <Link className={location.pathname === "/admin/clientes" ? "active" : ""} to="/admin/clientes">
            Clientes
          </Link>
          <Link className={location.pathname === "/admin/reservas" ? "active" : ""} to="/admin/reservas">
            Reservas
          </Link>
          <Link className={location.pathname === "/admin/pagos" ? "active" : ""} to="/admin/pagos">
            Pagos
          </Link>
          <Link className={location.pathname === "/admin/reportes" ? "active" : ""} to="/admin/reportes">
            Reportes
          </Link>
        </nav>

        <div className="admin-user">
          <strong>Admin</strong>
          <span>Panel de trabajadores</span>
        </div>
      </aside>

      <main className="admin-main reservations-admin-main">
        <header className="admin-topbar reservations-admin-topbar">
          <input
            type="search"
            placeholder="Buscar reserva, habitacion o huesped..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="admin-profile-menu">
            <button type="button" onClick={() => setProfileOpen((open) => !open)}>
              Admin Profile
            </button>
            {profileOpen && (
              <div className="admin-profile-dropdown">
                <button type="button" onClick={() => navigate("/")}>
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="rooms-admin-heading">
          <div>
            <h1>Gestion de reservas</h1>
            <p>Revisa las reservas del cliente user y modifica habitacion, fechas o estado.</p>
          </div>
        </section>

        <section className="rooms-admin-stats" aria-label="Resumen de reservas">
          <article>
            <span>Total</span>
            <strong>{totals.total}</strong>
            <small>Reservas registradas</small>
          </article>
          <article>
            <span>Confirmadas</span>
            <strong>{totals.Confirmada}</strong>
            <small>Reservas validadas</small>
          </article>
          <article>
            <span>Pendientes</span>
            <strong>{totals.Pendiente}</strong>
            <small>Por revisar</small>
          </article>
          <article>
            <span>Canceladas</span>
            <strong>{totals.Cancelada}</strong>
            <small>Reservas anuladas</small>
          </article>
        </section>

        <section className="rooms-admin-toolbar reservations-admin-toolbar" aria-label="Filtros de reservas">
          <label>
            <span>Buscar</span>
            <input
              type="search"
              placeholder="ID, huesped o habitacion..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label>
            <span>Estado</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="todos">Todos los estados</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </label>
          <button type="button" onClick={handleResetFilters}>
            Limpiar filtros
          </button>
        </section>

        <section className="reservations-admin-layout reservations-admin-layout-single">
          <article className="reservations-admin-table-card">
            <div className="reservations-admin-table-header">
              <span>ID</span>
              <span>Huesped</span>
              <span>Habitacion</span>
              <span>Entrada</span>
              <span>Salida</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>

            <div className="rooms-admin-table-body">
              {filteredReservations.map((reservation) => (
                <div className="reservations-admin-row" key={reservation.id}>
                  <strong>{reservation.id}</strong>
                  <span>{reservation.guest.name}</span>
                  <span>{reservation.room}</span>
                  <span>{reservation.checkIn || "Por confirmar"}</span>
                  <span>{reservation.checkOut || "Por confirmar"}</span>
                  <span className={`reservation-status ${reservation.status}`}>
                    {statusLabels[reservation.status]}
                  </span>
                  <div className="rooms-admin-actions reservations-admin-actions">
                    <button type="button" onClick={() => openReservationModal(reservation)}>
                      Ver reserva
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{filteredReservations.length}</strong> de{" "}
              <strong>{reservations.length}</strong> reservas
            </footer>
          </article>
        </section>

        {selectedReservation && (
          <div className="rooms-modal-backdrop" role="presentation">
            <section className="rooms-modal reservations-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-detail-title">
              <button className="rooms-modal-close" type="button" onClick={closeReservationModal} aria-label="Cerrar modal">
                x
              </button>
              <div className="rooms-modal-heading">
                <span>Reserva del cliente user</span>
                <h2 id="reservation-detail-title">{selectedReservation.id}</h2>
                <p>{selectedReservation.guest.name} - {selectedReservation.guest.email}</p>
              </div>

              <div className="rooms-modal-info-grid">
                <div>
                  <span>Telefono</span>
                  <strong>{selectedReservation.guest.phone}</strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>{selectedReservation.total}</strong>
                </div>
                <div>
                  <span>Peticiones</span>
                  <strong>{selectedReservation.guest.requests}</strong>
                </div>
                <div>
                  <span>Huespedes</span>
                  <strong>{selectedReservation.guests}</strong>
                </div>
              </div>

              <form className="rooms-modal-form" onSubmit={handleSubmit}>
                <label>
                  Habitacion
                  <select name="room" value={form.room} onChange={handleInputChange} required>
                    {roomOptions.map((room) => (
                      <option key={room.id} value={room.title}>
                        {room.title}
                        {room.number ? ` - disponible` : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Huespedes
                  <select name="guests" value={form.guests} onChange={handleInputChange} required>
                    {guestOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Entrada
                  <input name="checkIn" type="date" value={form.checkIn} onChange={handleInputChange} required />
                </label>
                <label>
                  Salida
                  <input name="checkOut" type="date" value={form.checkOut} onChange={handleInputChange} required />
                </label>
                <label>
                  Estado
                  <select name="status" value={form.status} onChange={handleInputChange}>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </label>
                <button type="submit">Guardar cambios</button>
              </form>

              <button className="rooms-modal-danger" type="button" onClick={cancelReservation}>
                Cancelar reserva
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default ReservasAdmin;
