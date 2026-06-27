import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getClientReservations,
  saveClientReservations,
} from "../services/clientReservationsStorage.js";
import { clientesApi } from "../services/hotelApi.js";

const CLIENT_PROFILE_KEY = "luxestay.clientProfile";

const defaultProfile = {
  id: "LM-USER",
  name: "user",
  email: "user@demo.com",
  phone: "999000000",
  city: "Lima",
  notes: "Cliente de prueba conectado con las reservas realizadas desde la web.",
};

const sortLabels = {
  name: "Cliente",
  bookings: "Reservas",
  latestStay: "Ultima estadia",
};

function getStoredProfile() {
  try {
    const storedProfile = localStorage.getItem(CLIENT_PROFILE_KEY);
    if (!storedProfile) {
      return defaultProfile;
    }

    const parsedProfile = JSON.parse(storedProfile);
    return {
      ...defaultProfile,
      ...parsedProfile,
      id: defaultProfile.id,
    };
  } catch {
    return defaultProfile;
  }
}

function saveStoredProfile(profile) {
  localStorage.setItem(CLIENT_PROFILE_KEY, JSON.stringify(profile));
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatReservationStay(reservation) {
  if (reservation?.dates) {
    return reservation.dates;
  }

  if (reservation?.checkIn && reservation?.checkOut) {
    return `${reservation.checkIn} - ${reservation.checkOut}`;
  }

  return "Sin estadias registradas";
}

function normalizeReservation(reservation) {
  return {
    id: reservation.id || "RES-CLIENTE",
    room: reservation.room || reservation.title || "Habitacion",
    dates: formatReservationStay(reservation),
    guests: reservation.guests || "1 Adulto",
    status: reservation.status || "Confirmada",
    total: reservation.total || "$0.00",
    guest: {
      name: reservation.guest?.name || "user",
      email: reservation.guest?.email || defaultProfile.email,
      phone: reservation.guest?.phone || defaultProfile.phone,
      requests: reservation.guest?.requests || "Sin peticiones especiales.",
    },
  };
}

function getClientReservationMatches(currentClient, reservations) {
  const clientEmail = currentClient?.email?.toLowerCase();
  const clientName = (currentClient?.nombre || currentClient?.name || "").toLowerCase();

  return reservations.filter((reservation) => {
    const guestEmail = reservation.guest?.email?.toLowerCase();
    const guestName = reservation.guest?.name?.toLowerCase();

    return (clientEmail && guestEmail === clientEmail) || (clientName && guestName === clientName);
  });
}

function mapBackendClient(currentClient, reservations, profile) {
  const clientReservations = getClientReservationMatches(currentClient, reservations);
  const latestReservation = clientReservations[0];

  return {
    id: currentClient.id,
    name: currentClient.nombre || "Sin nombre",
    email: currentClient.email || "",
    phone: currentClient.telefono || "",
    city: currentClient.ciudad || "",
    notes: currentClient.notas || "",
    bookings: clientReservations.length,
    latestStay: latestReservation?.dates || "Sin estadias registradas",
    rol: currentClient.rol,
  };
}

function SidebarNav({ location }) {
  return (
    <aside className="admin-sidebar clients-sidebar">
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
        <strong>Admin Profile</strong>
        <span>General manager</span>
      </div>
    </aside>
  );
}

function MetricCard({ label, value, description, change, tone }) {
  return (
    <article className={`client-metric-card ${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
      <em>{change}</em>
    </article>
  );
}

function SkeletonRows() {
  return (
    <div className="clients-skeleton-list" aria-label="Cargando clientes">
      {[1, 2, 3].map((item) => (
        <div className="clients-skeleton-row clients-skeleton-row-user" key={item}>
          <span />
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

function ClientDrawer({
  activeTab,
  client,
  form,
  onChange,
  onClose,
  onDelete,
  onSave,
  onTabChange,
  reservations,
  saveNotice,
}) {
  if (!client) {
    return null;
  }

  return (
    <div className="client-drawer-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="client-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${client.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <button type="button" onClick={onClose} aria-label="Cerrar panel de cliente">
            x
          </button>
          <div className="client-drawer-avatar">{getInitials(client.name)}</div>
          <h2>{client.name}</h2>
          <p>
            {client.id} - {client.email}
          </p>
        </header>

        <nav className="client-drawer-tabs" aria-label="Detalle del cliente">
          {["datos", "reservas", "historial"].map((tab) => (
            <button
              className={activeTab === tab ? "active" : ""}
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "datos" && (
          <form className="client-drawer-form" onSubmit={onSave}>
            <label>
              Nombre Completo
              <input name="nombre" value={form.nombre} onChange={onChange} required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={onChange} required />
            </label>
            <label>
              Rol del Usuario
              <select name="rol" value={form.rol} onChange={onChange}>
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </label>
            <label>
              Telefono
              <input name="phone" value={form.phone} onChange={onChange} />
            </label>
            <label>
              Ciudad
              <input name="city" value={form.city} onChange={onChange} />
            </label>
            <label>
              Notas
              <textarea name="notes" value={form.notes} onChange={onChange} />
            </label>
            <div className="client-drawer-actions">
              <button type="submit">Guardar cambios</button>
              <button type="button" onClick={onDelete}>
                Eliminar usuario
              </button>
              {saveNotice && <span>{saveNotice}</span>}
            </div>
          </form>
        )}

        {activeTab === "reservas" && (
          <div className="client-drawer-panel">
            <div>
              <span>Reservas totales</span>
              <strong>{client.bookings}</strong>
            </div>
            <div>
              <span>Ultima estadia</span>
              <strong>{client.latestStay}</strong>
            </div>
            <div className="client-reservation-list">
              {reservations.length ? (
                reservations.map((reservation) => (
                  <article key={reservation.id}>
                    <strong>{reservation.room}</strong>
                    <span>{reservation.dates}</span>
                    <small>
                      {reservation.guests} - {reservation.status}
                    </small>
                  </article>
                ))
              ) : (
                <p>El usuario aun no tiene reservas registradas.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "historial" && (
          <div className="client-drawer-panel">
            <p>Cliente conectado con la cuenta de prueba user.</p>
            <p>Reservas registradas: {client.bookings}.</p>
            <p>Ultima estadia: {client.latestStay}.</p>
            <p>{client.notes}</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function CreateClientModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "CLIENTE" });
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      await onSave(form);
      setForm({ nombre: "", email: "", password: "", rol: "CLIENTE" }); // Limpiar formulario
    } catch (apiError) {
      setError(apiError.message || "No se pudo crear el cliente.");
    }
  };

  return (
    <div className="client-drawer-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="client-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Crear nuevo cliente"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <button type="button" onClick={onClose} aria-label="Cerrar modal">
            x
          </button>
          <h2>Crear Nuevo Cliente</h2>
          <p>Introduce los datos para registrar un nuevo usuario en el sistema.</p>
        </header>

        <form className="client-drawer-form" onSubmit={handleSubmit}>
          <label>
            Nombre Completo
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Contraseña
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          <label>
            Rol del Usuario
            <select name="rol" value={form.rol} onChange={handleChange}>
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>
          {error && <span className="error-notice">{error}</span>}
          <button type="submit">Crear Cliente</button>
        </form>
      </aside>
    </div>
  );
}

function ClienteAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [search, setSearch] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [minBookings, setMinBookings] = useState("0");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [drawerTab, setDrawerTab] = useState("datos");
  const [drawerForm, setDrawerForm] = useState(defaultProfile);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [saveNotice, setSaveNotice] = useState("");
  const [globalNotice, setGlobalNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchClientes = async () => {
      setLoading(true);

      try {
        const response = await clientesApi.getAll();
        if (isMounted) {
          setClientes(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("No se pudieron cargar los clientes", error);
        if (isMounted) {
          setClientes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClientes();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const refreshReservations = () => setRefreshKey((currentKey) => currentKey + 1);
    window.addEventListener("focus", refreshReservations);
    return () => window.removeEventListener("focus", refreshReservations);
  }, []);

  useEffect(() => {
    if (!selectedClientId) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedClientId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedClientId]);

  const reservations = useMemo(
    () => getClientReservations().map(normalizeReservation),
    [refreshKey],
  );

  const clients = useMemo(
    () => clientes.map((currentClient) => mapBackendClient(currentClient, reservations, profile)),
    [clientes, reservations, profile],
  );
  const selectedClient = useMemo(
    () => clients.find((currentClient) => currentClient.id === selectedClientId) || null,
    [clients, selectedClientId],
  );
  const selectedReservations = useMemo(
    () => (selectedClient ? getClientReservationMatches(selectedClient, reservations) : []),
    [reservations, selectedClient],
  );
  const totalBookings = useMemo(
    () => clients.reduce((total, currentClient) => total + currentClient.bookings, 0),
    [clients],
  );
  const featuredClient = selectedClient || clients[0] || null;
  const latestStaySummary =
    clients.find((currentClient) => currentClient.latestStay !== "Sin estadias registradas")?.latestStay ||
    "Sin estadias registradas";

  const filteredClients = useMemo(() => {
    const filtered = clients.filter((currentClient) => {
      const searchText =
        `${currentClient.id} ${currentClient.name} ${currentClient.email} ${currentClient.phone}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesBookings = currentClient.bookings >= Number(minBookings || 0);

      return matchesSearch && matchesBookings;
    });

    return filtered.sort((firstClient, secondClient) => {
      const firstValue = firstClient[sortConfig.key];
      const secondValue = secondClient[sortConfig.key];
      const direction = sortConfig.direction === "asc" ? 1 : -1;

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return (firstValue - secondValue) * direction;
      }

      return String(firstValue).localeCompare(String(secondValue)) * direction;
    });
  }, [clients, search, minBookings, sortConfig]);

  const handleDrawerInputChange = (event) => {
    const { name, value } = event.target;
    setDrawerForm((currentForm) => ({ ...currentForm, [name]: value }));
    // Limpiamos el aviso de error al empezar a escribir de nuevo
    setSaveNotice("");
  };

  const openDrawer = (currentClient) => {
    setSelectedClientId(currentClient.id);
    setDrawerTab("datos");
    setSaveNotice(""); // Limpiamos cualquier mensaje de error anterior al abrir
    setDrawerForm({
      id: currentClient.id,
      nombre: currentClient.name,
      email: currentClient.email,
      rol: currentClient.rol,
      phone: currentClient.phone,
      city: currentClient.city,
      notes: currentClient.notes,
    });
  };

  const handleDrawerSave = async (event) => {
    event.preventDefault();

    if (!selectedClient) {
      return;
    }

    try {
      // Preparamos los datos a enviar, solo los que el backend espera para actualizar.
      const updateData = {
        nombre: drawerForm.nombre.trim(),
        email: drawerForm.email.trim(),
        rol: drawerForm.rol,
        telefono: drawerForm.phone.trim(),
        ciudad: drawerForm.city.trim(),
        notas: drawerForm.notes.trim(),
      };

      // Llamamos a la API para actualizar el usuario
      const response = await clientesApi.update(selectedClient.id, updateData);

      setClientes((currentClientes) =>
        currentClientes.map((currentClient) =>
          currentClient.id === selectedClient.id ? response.data : currentClient,
        ),
      );

      // 1. Cierra el panel de edición inmediatamente
      setSelectedClientId(null);
      // 2. Muestra una notificación global de éxito
      setGlobalNotice(`Cliente ${updateData.nombre} actualizado con éxito.`);
      setTimeout(() => setGlobalNotice(""), 4000); // 3. La notificación desaparece sola
    } catch (error) {
      console.error("No se pudo actualizar el cliente", error);
      setSaveNotice("No se pudieron guardar los cambios");
    }
  };

  const handleDrawerDelete = async () => {
    if (!selectedClient) {
      return;
    }

    const shouldDelete = window.confirm(`¿Eliminar a ${selectedClient.name}?`);
    if (!shouldDelete) {
      return;
    }

    try {
      await clientesApi.delete(selectedClient.id);
      setClientes((currentClientes) =>
        currentClientes.filter((currentClient) => currentClient.id !== selectedClient.id),
      );
      setSelectedClientId(null);
      setGlobalNotice(`Usuario ${selectedClient.name} eliminado con éxito.`);
      setTimeout(() => setGlobalNotice(""), 4000);
    } catch (error) {
      console.error("No se pudo eliminar el cliente", error);
      const errorMessage = error.response?.data?.message || "Error al eliminar el usuario.";
      setSaveNotice(errorMessage);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedClientId(null);
    setSaveNotice(""); // Limpiamos el mensaje al cerrar
  };

  const handleSort = (key) => {
    setSortConfig((currentSort) => ({
      key,
      direction:
        currentSort.key === key && currentSort.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleResetFilters = () => {
    setSearch("");
    setMinBookings("0");
  };

  const handleCreateClient = async (newClientData) => {
    try {
      // Asumiendo que tu API devuelve el cliente creado
      const response = await clientesApi.create(newClientData);
      // Añadir el nuevo cliente al estado para actualizar la UI al instante
      setClientes((current) => [...current, response.data]);
      setCreateModalOpen(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      throw new Error(error.response?.data?.message || "El email ya podría estar en uso.");
    }
  };

  return (
    <div className="admin-shell clients-admin-shell">
      <SidebarNav location={location} />

      <main className="admin-main clients-admin-main">
        <header className="admin-topbar clients-admin-topbar">
          <input
            type="search"
            placeholder="Buscar cliente, email o ID..."
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

        {globalNotice && (
          <div className="clients-global-notice" role="alert">
            {globalNotice}
          </div>
        )}

        <section className="rooms-admin-heading clients-hero">
          <div>
            <p className="section-kicker">Directory - user</p>
            <h1>Directorio de clientes</h1>
            <p>
              Consulta la informacion del cliente user, sus reservas acumuladas
              y la fecha de su ultima estadia.
            </p>
          </div>
          <div className="clients-admin-heading-actions">
            <button type="button" className="primary-action" onClick={() => setCreateModalOpen(true)}>
              + Nuevo Cliente
            </button>
            <button type="button">Exportar CSV</button>
          </div>
        </section>

        <section className="clients-metrics" aria-label="Resumen de clientes">
          <MetricCard
            label="Total clientes"
            value={clients.length}
            description="Usuarios cargados desde backend"
            change="+0%"
            tone="slate"
          />
          <MetricCard
            label="Reservas totales"
            value={totalBookings}
            description="Calculadas en el listado"
            change="+100%"
            tone="blue"
          />
          <MetricCard
            label="Ultima estadia"
            value={latestStaySummary}
            description="Segun ultima reserva"
            change="Actual"
            tone="gold"
          />
          <MetricCard
            label="Cliente"
            value={featuredClient?.name || "Sin clientes"}
            description={featuredClient?.email || "Sin correo disponible"}
            change={featuredClient?.rol || "N/A"}
            tone="green"
          />
        </section>

        <section className="clients-filter-card clients-filter-card-user" aria-label="Filtros de clientes">
          <label>
            <span>Buscar</span>
            <input
              type="search"
              placeholder="Nombre, email o ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="clients-advanced-filter">
            <button type="button" onClick={() => setAdvancedOpen((open) => !open)}>
              Filtros avanzados
            </button>
            {advancedOpen && (
              <div className="clients-advanced-menu">
                <label>
                  Reservas minimas
                  <input
                    min="0"
                    type="number"
                    value={minBookings}
                    onChange={(event) => setMinBookings(event.target.value)}
                  />
                </label>
                <button type="button" onClick={handleResetFilters}>
                  Limpiar todo
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="clients-admin-layout">
          <article className="clients-admin-table-card clients-admin-table-card-wide">
            <div className="clients-admin-table-header clients-admin-table-user">
              {[
                ["name", "Cliente"],
                ["email", "Contacto"],
                ["bookings", "Reservas"],
                ["latestStay", "Ultima estadia"],
              ].map(([key, label]) => (
                <button key={key} type="button" onClick={() => handleSort(key)}>
                  {label}
                  {sortConfig.key === key && (
                    <span>{sortConfig.direction === "asc" ? "^" : "v"}</span>
                  )}
                </button>
              ))}
              <span>Acciones</span>
            </div>

            {loading ? (
              <SkeletonRows />
            ) : (
              <div className="rooms-admin-table-body">
                {filteredClients.map((currentClient) => (
                  <div
                    className="clients-admin-row clients-admin-row-user"
                    key={currentClient.id}
                    onDoubleClick={() => openDrawer(currentClient)}
                  >
                    <button
                      className="clients-admin-guest"
                      type="button"
                      onClick={() => openDrawer(currentClient)}
                    >
                      <span>{getInitials(currentClient.name)}</span>
                      <div>
                        <strong>{currentClient.name}</strong>
                        <small>ID: {currentClient.id}</small>
                      </div>
                    </button>
                    <div className="clients-admin-contact">
                      <span>{currentClient.email}</span>
                      <small>{currentClient.phone}</small>
                    </div>
                    <strong>{currentClient.bookings}</strong>
                    <span>{currentClient.latestStay}</span>
                    <div className="rooms-admin-actions clients-row-actions">
                      <button type="button" onClick={() => openDrawer(currentClient)}>
                        Ver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{filteredClients.length}</strong> de{" "}
              <strong>{clients.length}</strong> cliente{clients.length === 1 ? "" : "s"}
              <span>Ordenado por {sortLabels[sortConfig.key]}</span>
            </footer>
          </article>
        </section>

        <ClientDrawer
          activeTab={drawerTab}
          client={selectedClient}
          form={drawerForm}
          onChange={handleDrawerInputChange}
          onClose={handleCloseDrawer}
          onDelete={handleDrawerDelete}
          onSave={handleDrawerSave}
          onTabChange={setDrawerTab}
          reservations={selectedReservations}
          saveNotice={saveNotice}
        />

        <CreateClientModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreateClient}
        />
      </main>
    </div>
  );
}

export default ClienteAdmin;
