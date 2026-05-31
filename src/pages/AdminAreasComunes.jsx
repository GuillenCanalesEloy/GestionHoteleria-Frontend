import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  areaStatusLabels,
  getAreaReservations,
  getCommonAreas,
  normalizeCommonArea,
  reservationStatusLabels,
  saveAreaReservations,
  saveCommonAreas,
} from "../services/commonAreasStorage.js";

const emptyAreaForm = {
  name: "",
  badge: "",
  status: "disponible",
  capacity: "1",
  pricePerHour: "",
  schedule: "08:00 - 22:00",
  image: "",
  description: "",
};

function AdminAreasComunes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [areas, setAreas] = useState(() => getCommonAreas());
  const [reservations, setReservations] = useState(() => getAreaReservations());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyAreaForm);

  useEffect(() => {
    if (!localStorage.getItem("luxestay.adminSession")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const totals = useMemo(() => {
    return areas.reduce(
      (accumulator, area) => {
        accumulator.total += 1;
        accumulator[area.status] += 1;
        return accumulator;
      },
      { total: 0, disponible: 0, ocupada: 0, mantenimiento: 0 },
    );
  }, [areas]);

  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      const matchesSearch = `${area.name} ${area.description}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "todos" || area.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [areas, search, statusFilter]);

  const orderedReservations = useMemo(() => {
    return [...reservations].sort(
      (first, second) =>
        new Date(`${second.date}T${second.startTime}`).getTime() -
        new Date(`${first.date}T${first.startTime}`).getTime(),
    );
  }, [reservations]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const persistAreas = (nextAreas) => {
    setAreas(nextAreas);
    saveCommonAreas(nextAreas);
  };

  const persistReservations = (nextReservations) => {
    setReservations(nextReservations);
    saveAreaReservations(nextReservations);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyAreaForm);
  };

  const editArea = (area) => {
    setEditingId(area.id);
    setForm({
      name: area.name,
      badge: area.badge,
      status: area.status,
      capacity: String(area.capacity),
      pricePerHour: String(area.pricePerHour),
      schedule: area.schedule,
      image: area.image,
      description: area.description,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedArea = normalizeCommonArea({
      ...form,
      id: editingId || `area-${Date.now()}`,
    });

    const nextAreas = editingId
      ? areas.map((area) => (area.id === editingId ? normalizedArea : area))
      : [normalizedArea, ...areas];

    persistAreas(nextAreas);
    resetForm();
  };

  const deleteArea = (areaId) => {
    persistAreas(areas.filter((area) => area.id !== areaId));
  };

  const updateAreaStatus = (areaId, status) => {
    persistAreas(areas.map((area) => (area.id === areaId ? { ...area, status } : area)));
  };

  const updateReservationStatus = (reservationId, status) => {
    persistReservations(
      reservations.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, status, stage: reservationStatusLabels[status] }
          : reservation,
      ),
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("luxestay.adminSession");
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-shell rooms-admin-shell">
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
            Areas comunes
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

      <main className="admin-main rooms-admin-main">
        <header className="admin-topbar rooms-admin-topbar">
          <input
            type="search"
            placeholder="Buscar areas comunes o reservas..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="admin-profile-menu">
            <button type="button" onClick={() => setProfileOpen((open) => !open)}>
              Admin Profile
            </button>
            {profileOpen && (
              <div className="admin-profile-dropdown">
                <button type="button" onClick={handleLogout}>
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="rooms-admin-heading">
          <div>
            <h1>Gestion de areas comunes</h1>
            <p>Crea, edita, cambia estado y revisa reservas de instalaciones.</p>
          </div>
        </section>

        <section className="rooms-admin-stats" aria-label="Resumen de areas comunes">
          <article>
            <span>Total</span>
            <strong>{totals.total}</strong>
            <small>Areas registradas</small>
          </article>
          <article>
            <span>Disponibles</span>
            <strong>{totals.disponible}</strong>
            <small>Listas para reservar</small>
          </article>
          <article>
            <span>Ocupadas</span>
            <strong>{totals.ocupada}</strong>
            <small>Con bloqueo activo</small>
          </article>
          <article>
            <span>Mantenimiento</span>
            <strong>{totals.mantenimiento}</strong>
            <small>Fuera de servicio</small>
          </article>
        </section>

        <section className="admin-area-layout">
          <form className="rooms-modal-form admin-area-form" onSubmit={handleSubmit}>
            <h2>{editingId ? "Editar area" : "Nueva area comun"}</h2>
            <label>
              Nombre
              <input name="name" value={form.name} onChange={handleInputChange} required />
            </label>
            <label>
              Etiqueta
              <input name="badge" value={form.badge} onChange={handleInputChange} required />
            </label>
            <label>
              Estado
              <select name="status" value={form.status} onChange={handleInputChange}>
                <option value="disponible">DISPONIBLE</option>
                <option value="ocupada">OCUPADA</option>
                <option value="mantenimiento">MANTENIMIENTO</option>
              </select>
            </label>
            <label>
              Capacidad
              <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleInputChange} required />
            </label>
            <label>
              Precio por hora
              <input name="pricePerHour" type="number" min="1" value={form.pricePerHour} onChange={handleInputChange} required />
            </label>
            <label>
              Horario
              <input name="schedule" value={form.schedule} onChange={handleInputChange} required />
            </label>
            <label className="wide">
              Imagen
              <input name="image" value={form.image} onChange={handleInputChange} placeholder="URL de imagen" />
            </label>
            <label className="wide">
              Descripcion
              <textarea name="description" value={form.description} onChange={handleInputChange} required rows="3" />
            </label>
            <button type="submit">{editingId ? "Guardar cambios" : "Crear area"}</button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancelar edicion
              </button>
            )}
          </form>

          <section>
            <div className="rooms-admin-toolbar reservations-admin-toolbar">
              <label>
                <span>Estado</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="todos">Todos los estados</option>
                  <option value="disponible">DISPONIBLE</option>
                  <option value="ocupada">OCUPADA</option>
                  <option value="mantenimiento">MANTENIMIENTO</option>
                </select>
              </label>
            </div>

            <article className="rooms-admin-table-card">
              <div className="rooms-admin-table-header common-areas-admin-header">
                <span>Area</span>
                <span>Estado</span>
                <span>Capacidad</span>
                <span>Precio/hora</span>
                <span>Acciones</span>
              </div>
              <div className="rooms-admin-table-body">
                {filteredAreas.map((area) => (
                  <div className="rooms-admin-row common-areas-admin-row" key={area.id}>
                    <strong>{area.name}</strong>
                    <span className={`rooms-status ${area.status}`}>{areaStatusLabels[area.status]}</span>
                    <span>{area.capacity} personas</span>
                    <span>${area.pricePerHour.toFixed(2)}</span>
                    <div className="rooms-admin-actions common-area-actions">
                      <button type="button" onClick={() => editArea(area)}>
                        Editar
                      </button>
                      <button type="button" onClick={() => updateAreaStatus(area.id, "disponible")}>
                        Disponible
                      </button>
                      <button type="button" onClick={() => updateAreaStatus(area.id, "ocupada")}>
                        Ocupada
                      </button>
                      <button type="button" onClick={() => updateAreaStatus(area.id, "mantenimiento")}>
                        Mant.
                      </button>
                      <button type="button" onClick={() => deleteArea(area.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </section>

        <section className="reservations-admin-layout reservations-admin-layout-single admin-area-reservations">
          <article className="reservations-admin-table-card">
            <div className="reservations-admin-table-header common-area-reservations-header">
              <span>ID</span>
              <span>Usuario</span>
              <span>Area</span>
              <span>Horario</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>
            <div className="rooms-admin-table-body">
              {orderedReservations.map((reservation) => (
                <div className="reservations-admin-row common-area-reservations-row" key={reservation.id}>
                  <strong>{reservation.id}</strong>
                  <span>{reservation.username}</span>
                  <span>{reservation.title}</span>
                  <span>{reservation.date} {reservation.startTime}-{reservation.endTime}</span>
                  <span className={`reservation-status ${reservation.status}`}>
                    {reservationStatusLabels[reservation.status]}
                  </span>
                  <div className="rooms-admin-actions reservations-admin-actions">
                    <button type="button" onClick={() => updateReservationStatus(reservation.id, "confirmada")}>
                      Aprobar
                    </button>
                    <button type="button" onClick={() => updateReservationStatus(reservation.id, "cancelada")}>
                      Rechazar
                    </button>
                    <button type="button" onClick={() => updateReservationStatus(reservation.id, "finalizada")}>
                      Finalizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{orderedReservations.length}</strong> reservas de areas
            </footer>
          </article>
        </section>
      </main>
    </div>
  );
}

export default AdminAreasComunes;
