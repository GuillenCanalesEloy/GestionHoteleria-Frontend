import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getClientReservations,
  saveClientReservations,
} from "../services/clientReservationsStorage.js";

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
              Nombre
              <input name="name" value={form.name} onChange={onChange} required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={onChange} required />
            </label>
            <label>
              Telefono
              <input name="phone" value={form.phone} onChange={onChange} required />
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
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saveNotice, setSaveNotice] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timeout);
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

  const client = useMemo(() => {
    const latestReservation = reservations[0];
    const latestGuest = latestReservation?.guest;

    return {
      ...profile,
      name: profile.name || latestGuest?.name || "user",
      email: profile.email || latestGuest?.email || defaultProfile.email,
      phone: profile.phone || latestGuest?.phone || defaultProfile.phone,
      bookings: reservations.length,
      latestStay: latestReservation?.dates || "Sin estadias registradas",
    };
  }, [profile, reservations]);

  const clients = useMemo(() => [client], [client]);
  const selectedClient = selectedClientId === client.id ? client : null;

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
    setSaveNotice("");
  };

  const openDrawer = (currentClient) => {
    setSelectedClientId(currentClient.id);
    setDrawerTab("datos");
    setDrawerForm({
      id: currentClient.id,
      name: currentClient.name,
      email: currentClient.email,
      phone: currentClient.phone,
      city: currentClient.city,
      notes: currentClient.notes,
    });
  };

  const handleDrawerSave = (event) => {
    event.preventDefault();
    const nextProfile = {
      ...profile,
      name: drawerForm.name.trim(),
      email: drawerForm.email.trim(),
      phone: drawerForm.phone.trim(),
      city: drawerForm.city.trim(),
      notes: drawerForm.notes.trim(),
    };
    const currentReservations = getClientReservations();
    const nextReservations = currentReservations.map((reservation) => ({
      ...reservation,
      guest: {
        ...reservation.guest,
        name: nextProfile.name,
        email: nextProfile.email,
        phone: nextProfile.phone,
      },
    }));

    setProfile(nextProfile);
    saveStoredProfile(nextProfile);
    saveClientReservations(nextReservations);
    setRefreshKey((currentKey) => currentKey + 1);
    setDrawerForm(nextProfile);
    setSaveNotice("Cambios guardados");
    setSelectedClientId(null);
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
            <button type="button">Exportar CSV</button>
          </div>
        </section>

        <section className="clients-metrics" aria-label="Resumen de clientes">
          <MetricCard
            label="Total clientes"
            value="1"
            description="Cuenta de prueba user"
            change="+0%"
            tone="slate"
          />
          <MetricCard
            label="Reservas totales"
            value={client.bookings}
            description="Guardadas por user"
            change="+100%"
            tone="blue"
          />
          <MetricCard
            label="Ultima estadia"
            value={client.latestStay}
            description="Segun ultima reserva"
            change="Actual"
            tone="gold"
          />
          <MetricCard
            label="Cliente"
            value={client.name}
            description={client.email}
            change="user"
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
              <strong>{clients.length}</strong> cliente
              <span>Ordenado por {sortLabels[sortConfig.key]}</span>
            </footer>
          </article>
        </section>

        <ClientDrawer
          activeTab={drawerTab}
          client={selectedClient}
          form={drawerForm}
          onChange={handleDrawerInputChange}
          onClose={() => setSelectedClientId(null)}
          onSave={handleDrawerSave}
          onTabChange={setDrawerTab}
          reservations={reservations}
          saveNotice={saveNotice}
        />
      </main>
    </div>
  );
}

export default ClienteAdmin;
