import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getStoredRooms,
  normalizeRoom,
  saveStoredRooms,
} from "../services/roomsStorage.js";

const emptyRoomForm = {
  number: "",
  type: "Individual",
  status: "disponible",
  price: "",
  capacity: "1",
  floor: "",
};

const statusLabels = {
  disponible: "Disponible",
  ocupada: "Ocupada",
  mantenimiento: "Mantenimiento",
};

function AdminHabitaciones() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [rooms, setRooms] = useState(() => getStoredRooms());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRoomForm);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.number.toLowerCase().includes(search.toLowerCase()) ||
        room.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "todos" || room.status === statusFilter;
      const matchesType = typeFilter === "todos" || room.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, search, statusFilter, typeFilter]);

  const totals = useMemo(() => {
    return rooms.reduce(
      (accumulator, room) => {
        accumulator.total += 1;
        accumulator[room.status] += 1;
        return accumulator;
      },
      { total: 0, disponible: 0, ocupada: 0, mantenimiento: 0 },
    );
  }, [rooms]);

  const isEditing = editingId !== null;
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  useEffect(() => {
    saveStoredRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    if (!createModalOpen && !selectedRoom) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (createModalOpen) {
        closeCreateModal();
        return;
      }

      closeRoomModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [createModalOpen, selectedRoom]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyRoomForm);
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    resetForm();
  };

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

  const closeRoomModal = () => {
    setSelectedRoomId(null);
    resetForm();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedRoom = normalizeRoom({
      id: isEditing ? editingId : Date.now(),
      number: form.number.trim(),
      type: form.type,
      status: form.status,
      price: Number(form.price),
      capacity: Number(form.capacity),
      floor: Number(form.floor),
    });

    if (isEditing) {
      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === editingId ? { ...room, ...normalizedRoom } : room,
        ),
      );
    } else {
      setRooms((currentRooms) => [normalizedRoom, ...currentRooms]);
    }

    if (isEditing) {
      setSelectedRoomId(normalizedRoom.id);
      setEditingId(normalizedRoom.id);
      setForm({
        number: normalizedRoom.number,
        type: normalizedRoom.type,
        status: normalizedRoom.status,
        price: String(normalizedRoom.price),
        capacity: String(normalizedRoom.capacity),
        floor: String(normalizedRoom.floor),
      });
    } else {
      closeCreateModal();
    }
  };

  const handleDelete = (roomId) => {
    setRooms((currentRooms) =>
      currentRooms.filter((room) => room.id !== roomId),
    );
    if (editingId === roomId) {
      resetForm();
    }
    if (selectedRoomId === roomId) {
      setSelectedRoomId(null);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("todos");
    setTypeFilter("todos");
  };

  const updateRoomStatus = (roomId, status) => {
    setRooms((currentRooms) =>
      currentRooms.map((room) => (room.id === roomId ? { ...room, status } : room)),
    );
    closeRoomModal();
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
          <Link
            className={location.pathname === "/admin/clientes" ? "active" : ""}
            to="/admin/clientes"
          >
            Clientes
          </Link>
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
          <strong>Admin Profile</strong>
          <span>General manager</span>
        </div>
      </aside>

      <main className="admin-main rooms-admin-main">
        <header className="admin-topbar rooms-admin-topbar">
          <input
            type="search"
            placeholder="Buscar habitaciones, huespedes o tareas..."
          />
          <div className="admin-profile-menu">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
            >
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
            <h1>Gestion de habitaciones</h1>
            <p>
              Administra el inventario, disponibilidad y estado operativo de
              cada habitacion.
            </p>
          </div>
          <button className="rooms-admin-primary" type="button" onClick={openCreateModal}>
            + Nueva habitacion
          </button>
        </section>

        <section
          className="rooms-admin-stats"
          aria-label="Resumen de habitaciones"
        >
          <article>
            <span>Total</span>
            <strong>{totals.total}</strong>
            <small>Habitaciones registradas</small>
          </article>
          <article>
            <span>Disponible</span>
            <strong>{totals.disponible}</strong>
            <small>Listas para reservar</small>
          </article>
          <article>
            <span>Ocupada</span>
            <strong>{totals.ocupada}</strong>
            <small>Con huesped activo</small>
          </article>
          <article>
            <span>Mantenimiento</span>
            <strong>{totals.mantenimiento}</strong>
            <small>Fuera de servicio</small>
          </article>
        </section>

        <section
          className="rooms-admin-toolbar"
          aria-label="Filtros de habitaciones"
        >
          <label>
            <span>Buscar</span>
            <input
              type="search"
              placeholder="Numero o tipo de habitacion..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label>
            <span>Estado</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </label>
          <label>
            <span>Tipo</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="Individual">Individual</option>
              <option value="Doble">Doble</option>
              <option value="Suite">Suite</option>
            </select>
          </label>
          <button type="button" onClick={handleResetFilters}>
            Limpiar filtros
          </button>
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
              {filteredRooms.map((room) => (
                <div className="rooms-admin-row" key={room.id}>
                  <strong>#{room.number}</strong>
                  <span>{room.type}</span>
                  <span className={`rooms-status ${room.status}`}>
                    {statusLabels[room.status]}
                  </span>
                  <span>${room.price.toFixed(2)}</span>
                  <span>
                    {room.capacity} persona{room.capacity === 1 ? "" : "s"}
                  </span>
                  <div className="rooms-admin-actions">
                    <button
                      type="button"
                      onClick={() => openRoomModal(room)}
                      aria-label={`Ver habitacion ${room.number}`}
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{filteredRooms.length}</strong> de{" "}
              <strong>{rooms.length}</strong> habitaciones
            </footer>
          </article>
        </section>

        {createModalOpen && (
          <div className="rooms-modal-backdrop" role="presentation" onClick={closeCreateModal}>
            <section className="rooms-modal" role="dialog" aria-modal="true" aria-labelledby="create-room-title" onClick={(event) => event.stopPropagation()}>
              <button className="rooms-modal-close" type="button" onClick={closeCreateModal} aria-label="Cerrar modal">
                ×
              </button>
              <div className="rooms-modal-heading">
                <span>Nueva habitacion</span>
                <h2 id="create-room-title">Registrar habitacion</h2>
              </div>
              <RoomForm
                form={form}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                submitLabel="Crear habitacion"
              />
            </section>
          </div>
        )}

        {selectedRoom && (
          <div className="rooms-modal-backdrop" role="presentation" onClick={closeRoomModal}>
            <section className="rooms-modal rooms-detail-modal" role="dialog" aria-modal="true" aria-labelledby="room-detail-title" onClick={(event) => event.stopPropagation()}>
              <button className="rooms-modal-close" type="button" onClick={closeRoomModal} aria-label="Cerrar modal">
                ×
              </button>
              <div className="rooms-modal-preview">
                <img src={selectedRoom.image} alt={selectedRoom.title} />
                <span className={`rooms-status ${selectedRoom.status}`}>
                  {statusLabels[selectedRoom.status]}
                </span>
              </div>
              <div className="rooms-modal-heading">
                <span>Detalle de habitacion</span>
                <h2 id="room-detail-title">Habitacion #{selectedRoom.number}</h2>
                <p>{selectedRoom.title}</p>
              </div>
              <div className="rooms-modal-info-grid">
                <div>
                  <span>Tipo</span>
                  <strong>{selectedRoom.type}</strong>
                </div>
                <div>
                  <span>Precio por noche</span>
                  <strong>${selectedRoom.price.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Capacidad</span>
                  <strong>{selectedRoom.capacity} persona{selectedRoom.capacity === 1 ? "" : "s"}</strong>
                </div>
                <div>
                  <span>Piso</span>
                  <strong>{selectedRoom.floor}</strong>
                </div>
              </div>
              <div className="rooms-modal-status-actions">
                <button
                  type="button"
                  onClick={() => updateRoomStatus(selectedRoom.id, "ocupada")}
                  disabled={selectedRoom.status === "ocupada"}
                >
                  Marcar ocupada
                </button>
                <button
                  type="button"
                  onClick={() => updateRoomStatus(selectedRoom.id, "disponible")}
                  disabled={selectedRoom.status === "disponible"}
                >
                  Marcar desocupada
                </button>
                <button
                  type="button"
                  onClick={() => updateRoomStatus(selectedRoom.id, "mantenimiento")}
                  disabled={selectedRoom.status === "mantenimiento"}
                >
                  Marcar mantenimiento
                </button>
              </div>
              <RoomForm
                form={form}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                submitLabel="Guardar cambios"
              />
              <button
                className="rooms-modal-danger"
                type="button"
                onClick={() => handleDelete(selectedRoom.id)}
              >
                Eliminar habitacion
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function RoomForm({ form, onChange, onSubmit, submitLabel }) {
  return (
    <form className="rooms-modal-form" onSubmit={onSubmit}>
      <label>
        Numero
        <input name="number" value={form.number} onChange={onChange} required placeholder="Ej. 408" />
      </label>
      <label>
        Tipo
        <select name="type" value={form.type} onChange={onChange}>
          <option value="Individual">Individual</option>
          <option value="Doble">Doble</option>
          <option value="Suite">Suite</option>
        </select>
      </label>
      <label>
        Estado
        <select name="status" value={form.status} onChange={onChange}>
          <option value="disponible">Disponible</option>
          <option value="ocupada">Ocupada</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </label>
      <label>
        Precio por noche
        <input name="price" type="number" min="1" value={form.price} onChange={onChange} required placeholder="220" />
      </label>
      <label>
        Capacidad
        <input name="capacity" type="number" min="1" value={form.capacity} onChange={onChange} required />
      </label>
      <label>
        Piso
        <input name="floor" type="number" min="1" value={form.floor} onChange={onChange} required placeholder="4" />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}

export default AdminHabitaciones;
