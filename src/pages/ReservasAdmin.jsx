import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const initialReservations = [
  {
    id: "RES-94021",
    guest: "Julianne Deville",
    room: "Suite 402",
    checkIn: "2026-04-26",
    checkOut: "2026-04-29",
    guests: 2,
    status: "confirmado",
  },
  {
    id: "RES-94025",
    guest: "Robert Harrison",
    room: "Doble 305",
    checkIn: "2026-04-25",
    checkOut: "2026-04-27",
    guests: 2,
    status: "confirmado",
  },
  {
    id: "RES-94030",
    guest: "Elena Sokolova",
    room: "Suite 405",
    checkIn: "2026-04-28",
    checkOut: "2026-05-02",
    guests: 3,
    status: "no-confirmado",
  },
  {
    id: "RES-94033",
    guest: "Michael Wu",
    room: "Individual 101",
    checkIn: "2026-04-27",
    checkOut: "2026-04-28",
    guests: 1,
    status: "no-confirmado",
  },
];

const emptyReservationForm = {
  guest: "",
  room: "",
  checkIn: "",
  checkOut: "",
  guests: "1",
  status: "confirmado",
};

const statusLabels = {
  confirmado: "Confirmado",
  "no-confirmado": "No confirmado",
};

function ReservasAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [reservations, setReservations] = useState(initialReservations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyReservationForm);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const searchText = `${reservation.id} ${reservation.guest} ${reservation.room}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "todos" || reservation.status === statusFilter;

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
      { total: 0, confirmado: 0, "no-confirmado": 0 },
    );
  }, [reservations]);

  const isEditing = editingId !== null;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyReservationForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const reservationData = {
      id: isEditing ? editingId : `RES-${Date.now().toString().slice(-5)}`,
      guest: form.guest.trim(),
      room: form.room.trim(),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: Number(form.guests),
      status: form.status,
    };

    if (isEditing) {
      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === editingId ? reservationData : reservation,
        ),
      );
    } else {
      setReservations((currentReservations) => [reservationData, ...currentReservations]);
    }

    resetForm();
  };

  const handleEdit = (reservation) => {
    setEditingId(reservation.id);
    setForm({
      guest: reservation.guest,
      room: reservation.room,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guests: String(reservation.guests),
      status: reservation.status,
    });
  };

  const updateReservationStatus = (reservationId, status) => {
    setReservations((currentReservations) =>
      currentReservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status } : reservation,
      ),
    );
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
          <Link
            className={location.pathname === "/admin/dashboard" ? "active" : ""}
            to="/admin/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className={
              location.pathname === "/admin/habitaciones" ? "active" : ""
            }
            to="/admin/habitaciones"
          >
            Habitaciones
          </Link>
          <button type="button">Clientes</button>
          <Link
            className={location.pathname === "/admin/reservas" ? "active" : ""}
            to="/admin/reservas"
          >
            Reservas
          </Link>
          <Link
            className={location.pathname === "/admin/pagos" ? "active" : ""}
            to="/admin/pagos"
          >
            Pagos
          </Link>
          <Link
            className={location.pathname === "/admin/reportes" ? "active" : ""}
            to="/admin/reportes"
          >
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
            <p>Crea, edita y controla si cada reserva esta confirmada o no confirmada.</p>
          </div>
          <a className="rooms-admin-primary" href="#reservation-form">
            + Nueva reserva
          </a>
        </section>

        <section className="rooms-admin-stats" aria-label="Resumen de reservas">
          <article>
            <span>Total</span>
            <strong>{totals.total}</strong>
            <small>Reservas registradas</small>
          </article>
          <article>
            <span>Confirmadas</span>
            <strong>{totals.confirmado}</strong>
            <small>Reservas validadas</small>
          </article>
          <article>
            <span>No confirmadas</span>
            <strong>{totals["no-confirmado"]}</strong>
            <small>Pendientes de validar</small>
          </article>
          <article>
            <span>Gestionadas</span>
            <strong>{totals.confirmado + totals["no-confirmado"]}</strong>
            <small>En seguimiento</small>
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
              <option value="confirmado">Confirmado</option>
              <option value="no-confirmado">No confirmado</option>
            </select>
          </label>
          <button type="button" onClick={handleResetFilters}>
            Limpiar filtros
          </button>
        </section>

        <section className="reservations-admin-layout">
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
                  <span>{reservation.guest}</span>
                  <span>{reservation.room}</span>
                  <span>{reservation.checkIn}</span>
                  <span>{reservation.checkOut}</span>
                  <span className={`reservation-status ${reservation.status}`}>
                    {statusLabels[reservation.status]}
                  </span>
                  <div className="rooms-admin-actions reservations-admin-actions">
                    <button type="button" onClick={() => handleEdit(reservation)}>
                      Editar
                    </button>
                    {reservation.status === "no-confirmado" && (
                      <button type="button" onClick={() => updateReservationStatus(reservation.id, "confirmado")}>
                        Confirmar
                      </button>
                    )}
                    {reservation.status === "confirmado" && (
                      <button type="button" onClick={() => updateReservationStatus(reservation.id, "no-confirmado")}>
                        No confirmar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{filteredReservations.length}</strong> de{" "}
              <strong>{reservations.length}</strong> reservas
            </footer>
          </article>

          <article className="rooms-admin-form-card" id="reservation-form">
            <div>
              <span>{isEditing ? "Editar reserva" : "Nueva reserva"}</span>
              <h2>{isEditing ? editingId : "Registrar reserva"}</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Huesped
                <input name="guest" value={form.guest} onChange={handleInputChange} required placeholder="Nombre completo" />
              </label>
              <label>
                Habitacion
                <input name="room" value={form.room} onChange={handleInputChange} required placeholder="Suite 402" />
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
                Huespedes
                <input name="guests" type="number" min="1" value={form.guests} onChange={handleInputChange} required />
              </label>
              <label>
                Estado
                <select name="status" value={form.status} onChange={handleInputChange}>
                  <option value="confirmado">Confirmado</option>
                  <option value="no-confirmado">No confirmado</option>
                </select>
              </label>

              <div className="rooms-admin-form-actions">
                <button type="submit">{isEditing ? "Guardar cambios" : "Crear reserva"}</button>
                {isEditing && (
                  <button type="button" onClick={resetForm}>
                    Cancelar edicion
                  </button>
                )}
              </div>
            </form>
          </article>
        </section>
      </main>
    </div>
  );
}

export default ReservasAdmin;
