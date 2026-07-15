import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { areasComunesApi, reservasAreasComunesApi } from "../services/hotelApi.js";
import {
  areaStatusToBackend,
  mapAreaRequest,
  mapBackendArea,
  mapBackendAreaReservation,
  reservationStatusToBackend,
} from "../services/commonAreasMapper.js";
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [areaModalMode, setAreaModalMode] = useState(null);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("luxestay.adminSession")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminAreas() {
      setLoading(true);
      setMessage("");

      try {
        const [areasResponse, reservationsResponse] = await Promise.all([
          areasComunesApi.getAll(),
          reservasAreasComunesApi.getAll(),
        ]);

        if (!isMounted) {
          return;
        }

        setAreas(areasResponse.data.map(mapBackendArea));
        setReservations(reservationsResponse.data.map(mapBackendAreaReservation));
      } catch {
        if (isMounted) {
          setMessage("No se pudo conectar con el backend. Mostrando datos locales.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAdminAreas();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const selectedArea = useMemo(
    () => areas.find((area) => area.id === selectedAreaId),
    [areas, selectedAreaId],
  );

  const selectedReservation = useMemo(
    () => reservations.find((reservation) => reservation.id === selectedReservationId),
    [reservations, selectedReservationId],
  );

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

  const fillAreaForm = (area) => {
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

  const openCreateAreaModal = () => {
    resetForm();
    setSelectedAreaId(null);
    setAreaModalMode("create");
  };

  const openAreaDetailModal = (area) => {
    resetForm();
    setSelectedAreaId(area.id);
    setAreaModalMode("detail");
  };

  const openAreaEditModal = (area) => {
    setSelectedAreaId(area.id);
    fillAreaForm(area);
    setAreaModalMode("edit");
  };

  const closeAreaModal = () => {
    setAreaModalMode(null);
    setSelectedAreaId(null);
    resetForm();
  };

  const openReservationModal = (reservation) => {
    setSelectedReservationId(reservation.id);
  };

  const closeReservationModal = () => {
    setSelectedReservationId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const wasEditing = Boolean(editingId);
    const normalizedArea = normalizeCommonArea({
      ...form,
      id: editingId || `area-${Date.now()}`,
      image: form.image,
    });
    setMessage("");
    setSaving(true);

    try {
      const payload = mapAreaRequest(normalizedArea);
      const response = editingId
        ? await areasComunesApi.update(editingId, payload)
        : await areasComunesApi.create(payload);
      const savedArea = mapBackendArea(response.data);

      const nextAreas = editingId
        ? areas.map((area) => (area.id === editingId ? savedArea : area))
        : [savedArea, ...areas];

      persistAreas(nextAreas);
      closeAreaModal();
      setMessage(wasEditing ? "Área común actualizada." : "Área común creada.");
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo guardar el área común.");
    } finally {
      setSaving(false);
    }
  };

  const deleteArea = async (areaId) => {
    if (!window.confirm("¿Deseas eliminar esta área común?")) {
      return;
    }

    setMessage("");

    try {
      await areasComunesApi.delete(areaId);
      persistAreas(areas.filter((area) => area.id !== areaId));
      closeAreaModal();
      setMessage("Área común eliminada.");
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo eliminar el área común.");
    }
  };

  const updateAreaStatus = async (areaId, status) => {
    setMessage("");

    try {
      const response = await areasComunesApi.updateEstado(areaId, areaStatusToBackend[status]);
      const updatedArea = mapBackendArea(response.data);
      persistAreas(areas.map((area) => (area.id === areaId ? updatedArea : area)));
      setSelectedAreaId(updatedArea.id);
      setMessage("Estado del área actualizado.");
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo actualizar el estado del área.");
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    setMessage("");

    try {
      const response = await reservasAreasComunesApi.updateEstado(
        reservationId,
        reservationStatusToBackend[status],
      );
      const updatedReservation = mapBackendAreaReservation(response.data);

      persistReservations(
        reservations.map((reservation) =>
          reservation.id === reservationId ? updatedReservation : reservation,
        ),
      );
      setSelectedReservationId(updatedReservation.id);
      setMessage("Estado de reserva actualizado.");
    } catch (error) {
      setMessage(error.response?.data?.message || "No se pudo actualizar la reserva.");
    }
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

      <main className="admin-main rooms-admin-main">
        <header className="admin-topbar rooms-admin-topbar">
          <input
            type="search"
            placeholder="Buscar áreas comunes o reservas..."
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
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="rooms-admin-heading">
          <div>
            <h1>Gestión de áreas comunes</h1>
            <p>Crea, edita, cambia estado y revisa reservas de instalaciones.</p>
            {loading && <p className="area-form-message">Cargando datos desde backend...</p>}
            {message && <p className="area-form-message">{message}</p>}
          </div>
          <button className="rooms-admin-primary" type="button" onClick={openCreateAreaModal}>
            Nueva área
          </button>
        </section>

        <section className="rooms-admin-stats" aria-label="Resumen de áreas comunes">
          <article>
            <span>Total</span>
            <strong>{totals.total}</strong>
            <small>Áreas registradas</small>
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
          <div className="rooms-admin-toolbar admin-area-toolbar">
            <label>
              <span>Estado</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="todos">Todos los estados</option>
                <option value="disponible">DISPONIBLE</option>
                <option value="ocupada">OCUPADA</option>
                <option value="mantenimiento">MANTENIMIENTO</option>
              </select>
            </label>
            <button type="button" onClick={() => setStatusFilter("todos")}>
              Limpiar filtro
            </button>
          </div>

          <article className="rooms-admin-table-card">
            <div className="rooms-admin-table-header common-areas-admin-header">
              <span>Área</span>
              <span>Estado</span>
              <span>Capacidad</span>
              <span>Precio/hora</span>
              <span>Acciones</span>
            </div>
            <div className="rooms-admin-table-body">
              {filteredAreas.map((area) => (
                <div className="rooms-admin-row common-areas-admin-row" key={area.id}>
                  <div className="admin-area-name-cell">
                    <strong>{area.name}</strong>
                    <small>{area.schedule}</small>
                  </div>
                  <span className={`rooms-status ${area.status}`}>{areaStatusLabels[area.status]}</span>
                  <span>{area.capacity} persona{area.capacity === 1 ? "" : "s"}</span>
                  <span>${area.pricePerHour.toFixed(2)}</span>
                  <div className="rooms-admin-actions common-area-actions">
                    <button type="button" onClick={() => openAreaDetailModal(area)}>
                      Ver
                    </button>
                    <button type="button" onClick={() => openAreaEditModal(area)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => deleteArea(area.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {filteredAreas.length === 0 && (
                <p className="admin-area-empty">No hay áreas comunes con ese filtro.</p>
              )}
            </div>
            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{filteredAreas.length}</strong> áreas comunes
            </footer>
          </article>
        </section>

        <section className="rooms-admin-heading admin-area-section-divider">
          <div>
            <h2>Reservas de áreas comunes</h2>
            <p>Gestiona las reservas pendientes, confirmadas o canceladas para las áreas comunes.</p>
          </div>
        </section>

        <section className="reservations-admin-layout reservations-admin-layout-single admin-area-reservations">
          <article className="reservations-admin-table-card">
            <div className="reservations-admin-table-header common-area-reservations-header">
              <span>ID</span>
              <span>Usuario</span>
              <span>Área</span>
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
                  <span>
                    {reservation.date} {reservation.startTime}-{reservation.endTime}
                  </span>
                  <span className={`reservation-status ${reservation.status}`}>
                    {reservationStatusLabels[reservation.status]}
                  </span>
                  <div className="rooms-admin-actions reservations-admin-actions">
                    <button type="button" onClick={() => openReservationModal(reservation)}>
                      Gestionar
                    </button>
                  </div>
                </div>
              ))}
              {orderedReservations.length === 0 && (
                <p className="admin-area-empty">Todavía no hay reservas registradas.</p>
              )}
            </div>
            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{orderedReservations.length}</strong> reservas de áreas
            </footer>
          </article>
        </section>

        {areaModalMode && areaModalMode !== "detail" && (
          <div className="rooms-modal-backdrop" role="presentation" onClick={closeAreaModal}>
            <section
              className="rooms-modal admin-area-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="area-form-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button className="rooms-modal-close" type="button" onClick={closeAreaModal} aria-label="Cerrar">
                x
              </button>
              <div className="rooms-modal-heading">
                <span>{editingId ? "Editar instalación" : "Nueva instalación"}</span>
                <h2 id="area-form-title">{editingId ? "Editar área común" : "Crear área común"}</h2>
                <p>Completa la información operativa que verá el equipo administrativo.</p>
              </div>
              <AreaForm
                disabled={saving}
                form={form}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                submitLabel={saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear área"}
              />
            </section>
          </div>
        )}

        {areaModalMode === "detail" && selectedArea && (
          <div className="rooms-modal-backdrop" role="presentation" onClick={closeAreaModal}>
            <section
              className="rooms-modal rooms-detail-modal admin-area-detail-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="area-detail-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button className="rooms-modal-close" type="button" onClick={closeAreaModal} aria-label="Cerrar">
                x
              </button>
              <div className="rooms-modal-heading">
                <span>{selectedArea.badge}</span>
                <h2 id="area-detail-title">{selectedArea.name}</h2>
                <p>{selectedArea.description}</p>
              </div>
              {selectedArea.image && (
                <div className="rooms-modal-preview">
                  <img src={selectedArea.image} alt={selectedArea.name} />
                  <span className={`rooms-status ${selectedArea.status}`}>
                    {areaStatusLabels[selectedArea.status]}
                  </span>
                </div>
              )}
              <div className="rooms-modal-info-grid">
                <div>
                  <span>Estado</span>
                  <strong>{areaStatusLabels[selectedArea.status]}</strong>
                </div>
                <div>
                  <span>Capacidad</span>
                  <strong>{selectedArea.capacity} persona{selectedArea.capacity === 1 ? "" : "s"}</strong>
                </div>
                <div>
                  <span>Precio por hora</span>
                  <strong>${selectedArea.pricePerHour.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Horario</span>
                  <strong>{selectedArea.schedule}</strong>
                </div>
              </div>
              <div className="rooms-modal-status-actions">
                <button
                  type="button"
                  disabled={selectedArea.status === "disponible"}
                  onClick={() => updateAreaStatus(selectedArea.id, "disponible")}
                >
                  Disponible
                </button>
                <button
                  type="button"
                  disabled={selectedArea.status === "ocupada"}
                  onClick={() => updateAreaStatus(selectedArea.id, "ocupada")}
                >
                  Ocupada
                </button>
                <button
                  type="button"
                  disabled={selectedArea.status === "mantenimiento"}
                  onClick={() => updateAreaStatus(selectedArea.id, "mantenimiento")}
                >
                  Mantenimiento
                </button>
              </div>
              <div className="admin-area-modal-actions">
                <button type="button" onClick={() => openAreaEditModal(selectedArea)}>
                  Editar
                </button>
                <button type="button" onClick={() => deleteArea(selectedArea.id)}>
                  Eliminar
                </button>
              </div>
            </section>
          </div>
        )}

        {selectedReservation && (
          <div className="rooms-modal-backdrop" role="presentation" onClick={closeReservationModal}>
            <section
              className="rooms-modal rooms-detail-modal admin-area-detail-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reservation-detail-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button className="rooms-modal-close" type="button" onClick={closeReservationModal} aria-label="Cerrar">
                x
              </button>
              <div className="rooms-modal-heading">
                <span>Reserva {selectedReservation.id}</span>
                <h2 id="reservation-detail-title">{selectedReservation.title}</h2>
                <p>Revisa los datos y actualiza el estado de la reserva.</p>
              </div>
              <div className="rooms-modal-info-grid">
                <div>
                  <span>Usuario</span>
                  <strong>{selectedReservation.username}</strong>
                </div>
                <div>
                  <span>Estado</span>
                  <strong>{reservationStatusLabels[selectedReservation.status]}</strong>
                </div>
                <div>
                  <span>Fecha</span>
                  <strong>{selectedReservation.date}</strong>
                </div>
                <div>
                  <span>Horario</span>
                  <strong>
                    {selectedReservation.startTime}-{selectedReservation.endTime}
                  </strong>
                </div>
              </div>
              <div className="rooms-modal-status-actions">
                <button
                  type="button"
                  disabled={selectedReservation.status === "confirmada"}
                  onClick={() => updateReservationStatus(selectedReservation.id, "confirmada")}
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  disabled={selectedReservation.status === "cancelada"}
                  onClick={() => updateReservationStatus(selectedReservation.id, "cancelada")}
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  disabled={selectedReservation.status === "finalizada"}
                  onClick={() => updateReservationStatus(selectedReservation.id, "finalizada")}
                >
                  Finalizar
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function AreaForm({ disabled, form, onChange, onSubmit, submitLabel }) {
  return (
    <form className="rooms-modal-form admin-area-form admin-area-modal-form" onSubmit={onSubmit}>
      <label>
        Nombre
        <input name="name" value={form.name} onChange={onChange} required disabled={disabled} />
      </label>
      <label>
        Etiqueta
        <input name="badge" value={form.badge} onChange={onChange} required disabled={disabled} />
      </label>
      <label>
        Estado
        <select name="status" value={form.status} onChange={onChange} disabled={disabled}>
          <option value="disponible">DISPONIBLE</option>
          <option value="ocupada">OCUPADA</option>
          <option value="mantenimiento">MANTENIMIENTO</option>
        </select>
      </label>
      <label>
        Capacidad
        <input
          name="capacity"
          type="number"
          min="1"
          value={form.capacity}
          onChange={onChange}
          required
          disabled={disabled}
        />
      </label>
      <label>
        Precio por hora
        <input
          name="pricePerHour"
          type="number"
          min="1"
          value={form.pricePerHour}
          onChange={onChange}
          required
          disabled={disabled}
        />
      </label>
      <label>
        Horario
        <input name="schedule" value={form.schedule} onChange={onChange} required disabled={disabled} />
      </label>
      <label className="wide">
        Imagen
        <input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="URL de imagen"
          disabled={disabled}
        />
      </label>
      <label className="wide">
        Descripción
        <textarea name="description" value={form.description} onChange={onChange} required rows="3" disabled={disabled} />
      </label>
      <button type="submit" disabled={disabled}>
        {submitLabel}
      </button>
    </form>
  );
}

export default AdminAreasComunes;
