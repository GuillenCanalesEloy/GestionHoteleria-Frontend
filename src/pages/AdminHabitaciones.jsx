import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredRooms, normalizeRoom, saveStoredRooms } from '../services/roomsStorage.js';

const emptyRoomForm = {
  number: '',
  type: 'Individual',
  status: 'disponible',
  price: '',
  capacity: '1',
  floor: '',
};

const statusLabels = {
  disponible: 'Disponible',
  ocupada: 'Ocupada',
  mantenimiento: 'Mantenimiento',
};

function AdminHabitaciones() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [rooms, setRooms] = useState(() => getStoredRooms());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRoomForm);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.number.toLowerCase().includes(search.toLowerCase()) ||
        room.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || room.status === statusFilter;
      const matchesType = typeFilter === 'todos' || room.type === typeFilter;

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

  useEffect(() => {
    saveStoredRooms(rooms);
  }, [rooms]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyRoomForm);
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
        currentRooms.map((room) => (room.id === editingId ? { ...room, ...normalizedRoom } : room)),
      );
    } else {
      setRooms((currentRooms) => [normalizedRoom, ...currentRooms]);
    }

    resetForm();
  };

  const handleEdit = (room) => {
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

  const handleDelete = (roomId) => {
    setRooms((currentRooms) => currentRooms.filter((room) => room.id !== roomId));
    if (editingId === roomId) {
      resetForm();
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('todos');
    setTypeFilter('todos');
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
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link className="active" to="/admin/habitaciones">Habitaciones</Link>
          <button type="button">Clientes</button>
          <Link to="/admin/reservas">Reservas</Link>
          <button type="button">Pagos</button>
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
          <input type="search" placeholder="Buscar habitaciones, huespedes o tareas..." />
          <div className="admin-profile-menu">
            <button type="button" onClick={() => setProfileOpen((open) => !open)}>
              Admin Profile
            </button>
            {profileOpen && (
              <div className="admin-profile-dropdown">
                <button type="button" onClick={() => navigate('/')}>
                  Cerrar sesion
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="rooms-admin-heading">
          <div>
            <h1>Gestion de habitaciones</h1>
            <p>Administra el inventario, disponibilidad y estado operativo de cada habitacion.</p>
          </div>
          <a className="rooms-admin-primary" href="#room-form">
            + Nueva habitacion
          </a>
        </section>

        <section className="rooms-admin-stats" aria-label="Resumen de habitaciones">
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

        <section className="rooms-admin-toolbar" aria-label="Filtros de habitaciones">
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
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </label>
          <label>
            <span>Tipo</span>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
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

        <section className="rooms-admin-layout">
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
                  <span className={`rooms-status ${room.status}`}>{statusLabels[room.status]}</span>
                  <span>${room.price.toFixed(2)}</span>
                  <span>{room.capacity} persona{room.capacity === 1 ? '' : 's'}</span>
                  <div className="rooms-admin-actions">
                    <button type="button" onClick={() => handleEdit(room)} aria-label={`Editar habitacion ${room.number}`}>
                      Editar
                    </button>
                    <button type="button" onClick={() => handleDelete(room.id)} aria-label={`Eliminar habitacion ${room.number}`}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{filteredRooms.length}</strong> de <strong>{rooms.length}</strong> habitaciones
            </footer>
          </article>

          <article className="rooms-admin-form-card" id="room-form">
            <div>
              <span>{isEditing ? 'Editar habitacion' : 'Nueva habitacion'}</span>
              <h2>{isEditing ? `Habitacion #${form.number}` : 'Registrar habitacion'}</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Numero
                <input name="number" value={form.number} onChange={handleInputChange} required placeholder="Ej. 408" />
              </label>
              <label>
                Tipo
                <select name="type" value={form.type} onChange={handleInputChange}>
                  <option value="Individual">Individual</option>
                  <option value="Doble">Doble</option>
                  <option value="Suite">Suite</option>
                </select>
              </label>
              <label>
                Estado
                <select name="status" value={form.status} onChange={handleInputChange}>
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </label>
              <label>
                Precio por noche
                <input name="price" type="number" min="1" value={form.price} onChange={handleInputChange} required placeholder="220" />
              </label>
              <label>
                Capacidad
                <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleInputChange} required />
              </label>
              <label>
                Piso
                <input name="floor" type="number" min="1" value={form.floor} onChange={handleInputChange} required placeholder="4" />
              </label>

              <div className="rooms-admin-form-actions">
                <button type="submit">{isEditing ? 'Guardar cambios' : 'Crear habitacion'}</button>
                {isEditing && (
                  <button type="button" onClick={resetForm}>
                    Cancelar
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

export default AdminHabitaciones;
