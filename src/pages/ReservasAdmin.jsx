import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { reservasApi } from "../services/hotelApi.js";

const guestCounts = [1, 2, 3, 4, 6];

const statusLabels = {
  Confirmada: "Confirmada",
  Pendiente: "Pendiente",
  Cancelada: "Cancelada",
};

function formatGuestCount(count) {
  const total = Number(count || 1);
  return `${total} huésped${total === 1 ? "" : "es"}`;
}

function normalizeReservation(reservation) {
  const [fallbackCheckIn = "", fallbackCheckOut = ""] = reservation.dates
    ? reservation.dates.split(" - ")
    : [];

  return {
    ...reservation,
    id: reservation.id || `RES-${Date.now().toString().slice(-6)}`,
    room: reservation.room || reservation.title || "Habitación",
    checkIn: reservation.checkIn || fallbackCheckIn,
    checkOut: reservation.checkOut || fallbackCheckOut,
    guests: reservation.guests || formatGuestCount(1),
    status: reservation.status || "Confirmada",
    guest: {
      name: reservation.guest?.name || "user",
      email: reservation.guest?.email || "user@demo.com",
      phone: reservation.guest?.phone || "Sin teléfono",
      requests: reservation.guest?.requests || "Sin peticiones especiales.",
    },
  };
}

function ReservasAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [form, setForm] = useState({
    room: "",
    checkIn: "",
    checkOut: "",
    guests: formatGuestCount(1),
    status: "Confirmada",
  });

  const selectedReservation = reservations.find(
    (reservation) => reservation.id === selectedReservationId,
  );

  const availableRooms = useMemo(() => [], []);
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
          type: "Habitación actual",
        },
        ...availableRooms,
      ];
    }

    return availableRooms;
  }, [availableRooms, selectedReservation]);

  useEffect(() => {
    reservasApi.getAll().then((response) => {
      const data = response.data?.content || response.data || [];
      const mapped = data.map((r) => normalizeReservation({
        id: `api-${r.id}`,
        numericId: r.id,
        source: "api",
        room: `Habitación ${r.habitacionTipo || ""} #${r.habitacionNumero || ""}`.trim(),
        title: `Habitación ${r.habitacionTipo || ""} #${r.habitacionNumero || ""}`.trim(),
        checkIn: r.fechaEntrada,
        checkOut: r.fechaSalida,
        dates: `${r.fechaEntrada} - ${r.fechaSalida}`,
        guests: formatGuestCount(r.cantidadHuespedes),
        status: r.estado ? r.estado.charAt(0).toUpperCase() + r.estado.slice(1).toLowerCase() : "Pendiente",
        total: r.precioTotal ? `$${r.precioTotal}` : "Pendiente",
        guest: {
          name: r.usuarioNombre || "Cliente",
          email: r.usuarioEmail || "Sin correo",
          phone: "Sin teléfono",
          requests: "Sin peticiones especiales.",
        },
      }));
      setReservations(mapped);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedReservation) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeReservationModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedReservation]);

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
      guests: formatGuestCount(1),
      status: "Confirmada",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const updateStatusLocally = (reservationId, newStatus, newStage) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: newStatus, stage: newStage } : r
      )
    );
  };

  const confirmReservation = (reservationId) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) return;

    updateStatusLocally(reservationId, "Confirmada", "Confirmada");

    if (reservation.numericId) {
      reservasApi.updateEstado(reservation.numericId, "CONFIRMADA").catch(() => {
        updateStatusLocally(reservationId, "Pendiente", "Pendiente");
      });
    }
  };

  const rejectReservation = (reservationId) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (!reservation) return;

    updateStatusLocally(reservationId, "Cancelada", "Cancelada");

    if (reservation.numericId) {
      reservasApi.updateEstado(reservation.numericId, "CANCELADA").catch(() => {
        updateStatusLocally(reservationId, "Pendiente", "Pendiente");
      });
    }
  };

  const cancelReservation = () => {
    const reservation = reservations.find((r) => r.id === selectedReservationId);
    if (!reservation) return;

    updateStatusLocally(selectedReservationId, "Cancelada", "Reserva cancelada");

    if (reservation.numericId) {
      reservasApi.updateEstado(reservation.numericId, "CANCELADA").catch(() => {
        updateStatusLocally(selectedReservationId, "Pendiente", "Pendiente");
      });
    }

    closeReservationModal();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setReservations((prev) =>
      prev.map((reservation) =>
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
              stage: form.status === "Cancelada" ? "Cancelada" : form.status,
            }
          : reservation,
      )
    );

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
          <Link className={location.pathname === "/admin/areas-comunes" ? "active" : ""} to="/admin/areas-comunes">
            Áreas comunes
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
            placeholder="Buscar reserva, habitación o huésped..."
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
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="rooms-admin-heading">
          <div>
            <h1>Gestión de reservas</h1>
            <p>Revisa y gestiona todas las reservas desde la base de datos.</p>
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
              placeholder="ID, huésped o habitación..."
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
              <span>Huésped</span>
              <span>Habitación</span>
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
                    {reservation.status === "Pendiente" && (
                      <>
                        <button
                          className="reservation-confirm-btn"
                          type="button"
                          onClick={() => confirmReservation(reservation.id)}
                        >
                          Confirmar
                        </button>
                        <button
                          className="reservation-reject-btn"
                          type="button"
                          onClick={() => rejectReservation(reservation.id)}
                        >
                          Rechazar
                        </button>
                      </>
                    )}
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
          <div className="rooms-modal-backdrop" role="presentation" onClick={closeReservationModal}>
            <section className="rooms-modal reservations-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-detail-title" onClick={(event) => event.stopPropagation()}>
              <button className="rooms-modal-close" type="button" onClick={closeReservationModal} aria-label="Cerrar modal">
                x
              </button>
              <div className="rooms-modal-heading">
                <span>Reserva del cliente</span>
                <h2 id="reservation-detail-title">{selectedReservation.id}</h2>
                <p>{selectedReservation.guest.name} - {selectedReservation.guest.email}</p>
              </div>

              <div className="rooms-modal-info-grid">
                <div>
                  <span>Teléfono</span>
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
                  Habitación
                  <select name="room" value={form.room} onChange={handleInputChange} required>
                    {!roomOptions.length && (
                      <option value={form.room}>
                        {form.room || "Sin habitaciones disponibles"}
                      </option>
                    )}
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
                    {guestCounts.map((count) => {
                      const option = formatGuestCount(count);
                      return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                      );
                    })}
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
