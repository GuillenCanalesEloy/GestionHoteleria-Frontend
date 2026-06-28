import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { habitacionesApi } from "../services/hotelApi.js";

const emptyRoomForm = {
  number: "",
  type: "Individual",
  status: "disponible",
  price: "",
  capacity: "1",
  floor: "",
};

const statusLabels = {
  disponible: "No ocupado",
  ocupada: "Ocupada",
  mantenimiento: "Mantenimiento",
};

// Mapeo frontend <-> backend
const typeToBackend = { Individual: "INDIVIDUAL", Doble: "DOBLE", Suite: "SUITE" };
const typeToFront  = { INDIVIDUAL: "Individual", DOBLE: "Doble", SUITE: "Suite" };
const statusToBackend = { disponible: "DISPONIBLE", ocupada: "OCUPADA", mantenimiento: "MANTENIMIENTO" };
const statusToFront   = { DISPONIBLE: "disponible", OCUPADA: "ocupada", MANTENIMIENTO: "mantenimiento" };

// Convierte la respuesta del backend al shape que usa el componente
function fromApi(room) {
  return {
    id: room.id,
    number: String(room.numero),
    type: typeToFront[room.tipo] ?? room.tipo,
    status: statusToFront[room.estado] ?? room.estado,
    price: Number(room.precioPorNoche),
    capacity: Number(room.capacidad),
    floor: Number(room.piso),
    title: room.nombre ?? `Habitacion ${room.tipo} ${room.numero}`,
    image: room.imagenUrl ?? "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900",
  };
}

// Convierte el form al body que espera el backend
function toApi(form) {
  return {
    numero: Number(form.number),
    tipo: typeToBackend[form.type] ?? form.type,
    estado: statusToBackend[form.status] ?? form.status,
    precioPorNoche: Number(form.price),
    capacidad: Number(form.capacity),
    piso: Number(form.floor),
  };
}

function AdminHabitaciones() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRoomForm);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Carga inicial desde la API ──────────────────────────────────────
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await habitacionesApi.getAll({ page: 0, size: 100 });
      const content = response.data.content ?? [];
      setRooms(content.map(fromApi));
    } catch (err) {
      console.error("Error al cargar habitaciones:", err);
      setError("No se pudieron cargar las habitaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  // ── Filtros y totales ───────────────────────────────────────────────
  const filteredRooms = useMemo(() => rooms.filter((room) => {
    const matchesSearch =
      room.number.toLowerCase().includes(search.toLowerCase()) ||
      room.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "todos" || room.status === statusFilter;
    const matchesType   = typeFilter   === "todos" || room.type   === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }), [rooms, search, statusFilter, typeFilter]);

  const totals = useMemo(() => rooms.reduce(
    (acc, room) => { acc.total += 1; acc[room.status] = (acc[room.status] ?? 0) + 1; return acc; },
    { total: 0, disponible: 0, ocupada: 0, mantenimiento: 0 },
  ), [rooms]);

  const isEditing = editingId !== null;
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // ── Escape key ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!createModalOpen && !selectedRoom) return;
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      createModalOpen ? closeCreateModal() : closeRoomModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [createModalOpen, selectedRoom]);

  // ── Helpers de form ─────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => { setEditingId(null); setForm(emptyRoomForm); };

  const openCreateModal = () => { resetForm(); setCreateModalOpen(true); };
  const closeCreateModal = () => { setCreateModalOpen(false); resetForm(); };

  const openRoomModal = (room) => {
    setSelectedRoomId(room.id);
    setEditingId(room.id);
    setForm({
      number: room.number,
      type: room.type,
      status: room.status,
      price: String(room.price),
      capacity: String(room.capacity),
      floor: String(room.floor),
    });
  };

  const closeRoomModal = () => { setSelectedRoomId(null); resetForm(); };

  // ── Crear / Editar ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        const response = await habitacionesApi.update(editingId, toApi(form));
        const updated = fromApi(response.data);
        setRooms((current) => current.map((r) => r.id === editingId ? updated : r));
        // Refresca el form con los datos confirmados por el backend
        setForm({
          number: updated.number,
          type: updated.type,
          status: updated.status,
          price: String(updated.price),
          capacity: String(updated.capacity),
          floor: String(updated.floor),
        });
      } else {
        const response = await habitacionesApi.create(toApi(form));
        const created = fromApi(response.data);
        setRooms((current) => [created, ...current]);
        closeCreateModal();
      }
    } catch (err) {
      console.error("Error al guardar habitacion:", err);
      alert("Error al guardar. Revisa los datos e intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar ────────────────────────────────────────────────────────
  const handleDelete = async (roomId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta habitacion?")) return;
    try {
      await habitacionesApi.delete(roomId);
      setRooms((current) => current.filter((r) => r.id !== roomId));
      closeRoomModal();
    } catch (err) {
      console.error("Error al eliminar habitacion:", err);
      alert("No se pudo eliminar la habitacion.");
    }
  };

  // ── Cambiar estado ──────────────────────────────────────────────────
  const updateRoomStatus = async (roomId, status) => {
    try {
      const response = await habitacionesApi.patch(roomId, {
        estado: statusToBackend[status],
      });
      const updated = fromApi(response.data);
      setRooms((current) => current.map((r) => r.id === roomId ? updated : r));
      closeRoomModal();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado.");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("todos");
    setTypeFilter("todos");
  };

  // ── Render ──────────────────────────────────────────────────────────
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
          <Link className={location.pathname === "/admin/dashboard" ? "active" : ""} to="/admin/dashboard">Dashboard</Link>
          <Link className={location.pathname === "/admin/habitaciones" ? "active" : ""} to="/admin/habitaciones">Habitaciones</Link>
          <Link className={location.pathname === "/admin/areas-comunes" ? "active" : ""} to="/admin/areas-comunes">Areas comunes</Link>
          <Link className={location.pathname === "/admin/clientes" ? "active" : ""} to="/admin/clientes">Clientes</Link>
          <Link className={location.pathname === "/admin/reservas" ? "active" : ""} to="/admin/reservas">Reservas</Link>
          <Link className={location.pathname === "/admin/pagos" ? "active" : ""} to="/admin/pagos">Pagos</Link>
          <Link className={location.pathname === "/admin/reportes" ? "active" : ""} to="/admin/reportes">Reportes</Link>
        </nav>
        <div className="admin-user">
          <strong>Admin Profile</strong>
          <span>General manager</span>
        </div>
      </aside>

      <main className="admin-main rooms-admin-main">
        <header className="admin-topbar rooms-admin-topbar">
          <input type="search" placeholder="Buscar habitaciones, huespedes o tareas..." />
          <div className="admin-profile-menu">
            <button type="button" onClick={() => setProfileOpen((o) => !o)}>Admin Profile</button>
            {profileOpen && (
              <div className="admin-profile-dropdown">
                <button type="button" onClick={() => navigate("/")}>Cerrar sesion</button>
              </div>
            )}
          </div>
        </header>

        <section className="rooms-admin-heading">
          <div>
            <h1>Gestion de habitaciones</h1>
            <p>Administra el inventario, disponibilidad y estado operativo de cada habitacion.</p>
          </div>
          <button className="rooms-admin-primary" type="button" onClick={openCreateModal}>
            + Nueva habitacion
          </button>
        </section>

        <section className="rooms-admin-stats" aria-label="Resumen de habitaciones">
          <article><span>Total</span><strong>{totals.total}</strong><small>Habitaciones registradas</small></article>
          <article><span>No ocupado</span><strong>{totals.disponible}</strong><small>Listas para reservar</small></article>
          <article><span>Ocupada</span><strong>{totals.ocupada}</strong><small>Con huesped activo</small></article>
          <article><span>Mantenimiento</span><strong>{totals.mantenimiento}</strong><small>Fuera de servicio</small></article>
        </section>

        <section className="rooms-admin-toolbar" aria-label="Filtros de habitaciones">
          <label>
            <span>Buscar</span>
            <input type="search" placeholder="Numero o tipo de habitacion..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <label>
            <span>Estado</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="todos">Todos los estados</option>
              <option value="disponible">No ocupado</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </label>
          <label>
            <span>Tipo</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="todos">Todos los tipos</option>
              <option value="Individual">Individual</option>
              <option value="Doble">Doble</option>
              <option value="Suite">Suite</option>
            </select>
          </label>
          <button type="button" onClick={handleResetFilters}>Limpiar filtros</button>
        </section>

        <section className="rooms-admin-layout rooms-admin-layout-single">
          <article className="rooms-admin-table-card">
            <div className="rooms-admin-table-header">
              <span>Habitacion</span>
              <span>Tipo</span>
              <span>Estado</span>
              <span>Precio por noche</span>
              <span>Capacidad</span>
              <span>Acciones</span>
            </div>
            <div className="rooms-admin-table-body">
              {loading && <p style={{ padding: "20px" }}>Cargando habitaciones...</p>}
              {error   && <p style={{ padding: "20px", color: "red" }}>{error}</p>}
              {!loading && !error && filteredRooms.map((room) => (
                <div className="rooms-admin-row" key={room.id}>
                  <strong>#{room.number}</strong>
                  <span>{room.type}</span>
                  <span className={`rooms-status ${room.status}`}>{statusLabels[room.status]}</span>
                  <span>${Number(room.price || 0).toFixed(2)}</span>
                  <span>{room.capacity} persona{room.capacity === 1 ? "" : "s"}</span>
                  <div className="rooms-admin-actions">
                    <button type="button" onClick={() => openRoomModal(room)}>Ver</button>
                  </div>
                </div>
              ))}
            </div>
            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{filteredRooms.length}</strong> de <strong>{rooms.length}</strong> habitaciones
            </footer>
          </article>
        </section>

        {/* Modal: Crear habitacion */}
        {createModalOpen && (
          <div className="rooms-modal-backdrop" role="presentation" onClick={closeCreateModal}>
            <section className="rooms-modal" role="dialog" aria-modal="true" aria-labelledby="create-room-title" onClick={(e) => e.stopPropagation()}>
              <button className="rooms-modal-close" type="button" onClick={closeCreateModal} aria-label="Cerrar modal">x</button>
              <div className="rooms-modal-heading">
                <span>Nueva habitacion</span>
                <h2 id="create-room-title">Registrar habitacion</h2>
              </div>
              <RoomForm form={form} onChange={handleInputChange} onSubmit={handleSubmit} submitLabel={saving ? "Guardando..." : "Crear habitacion"} disabled={saving} />
            </section>
          </div>
        )}

        {/* Modal: Detalle / Editar habitacion */}
        {selectedRoom && (
          <div className="rooms-modal-backdrop" role="presentation" onClick={closeRoomModal}>
            <section className="rooms-modal rooms-detail-modal" role="dialog" aria-modal="true" aria-labelledby="room-detail-title" onClick={(e) => e.stopPropagation()}>
              <button className="rooms-modal-close" type="button" onClick={closeRoomModal} aria-label="Cerrar modal">x</button>
              <div className="rooms-modal-heading">
                <span>Detalle de habitacion</span>
                <h2 id="room-detail-title">Habitacion #{selectedRoom.number}</h2>
              </div>
              <div className="rooms-modal-info-grid">
                <div><span>Tipo</span><strong>{selectedRoom.type}</strong></div>
                <div><span>Precio por noche</span><strong>${selectedRoom.price.toFixed(2)}</strong></div>
                <div><span>Capacidad</span><strong>{selectedRoom.capacity} persona{selectedRoom.capacity === 1 ? "" : "s"}</strong></div>
                <div><span>Piso</span><strong>{selectedRoom.floor}</strong></div>
                <div>
                  <span>Estado actual</span>
                  <strong className={`rooms-status ${selectedRoom.status}`}>{statusLabels[selectedRoom.status]}</strong>
                </div>
              </div>
              <div className="rooms-modal-status-actions">
                <button type="button" onClick={() => updateRoomStatus(selectedRoom.id, "ocupada")} disabled={selectedRoom.status === "ocupada"}>Marcar ocupada</button>
                <button type="button" onClick={() => updateRoomStatus(selectedRoom.id, "disponible")} disabled={selectedRoom.status === "disponible"}>Marcar desocupada</button>
                <button type="button" onClick={() => updateRoomStatus(selectedRoom.id, "mantenimiento")} disabled={selectedRoom.status === "mantenimiento"}>Marcar mantenimiento</button>
              </div>
              <RoomForm form={form} onChange={handleInputChange} onSubmit={handleSubmit} submitLabel={saving ? "Guardando..." : "Guardar cambios"} disabled={saving} />
              <button className="rooms-modal-danger" type="button" onClick={() => handleDelete(selectedRoom.id)}>
                Eliminar habitacion
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function RoomForm({ form, onChange, onSubmit, submitLabel, disabled }) {
  return (
    <form className="rooms-modal-form" onSubmit={onSubmit}>
      <label>Numero<input name="number" value={form.number} onChange={onChange} required placeholder="Ej. 408" /></label>
      <label>Tipo
        <select name="type" value={form.type} onChange={onChange}>
          <option value="Individual">Individual</option>
          <option value="Doble">Doble</option>
          <option value="Suite">Suite</option>
        </select>
      </label>
      <label>Estado
        <select name="status" value={form.status} onChange={onChange}>
          <option value="disponible">No ocupado</option>
          <option value="ocupada">Ocupada</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </label>
      <label>Precio por noche<input name="price" type="number" min="1" value={form.price} onChange={onChange} required placeholder="220" /></label>
      <label>Capacidad<input name="capacity" type="number" min="1" value={form.capacity} onChange={onChange} required /></label>
      <label>Piso<input name="floor" type="number" min="1" value={form.floor} onChange={onChange} required placeholder="4" /></label>
      <button type="submit" disabled={disabled}>{submitLabel}</button>
    </form>
  );
}

export default AdminHabitaciones;