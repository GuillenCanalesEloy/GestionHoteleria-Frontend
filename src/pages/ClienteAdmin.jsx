import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const initialClients = [
  {
    id: "LM-9021",
    name: "Eleanor Henderson",
    email: "e.henderson@example.com",
    phone: "+1 (555) 012-3456",
    bookings: 12,
    status: "vip",
    latestStay: "Oct 12 - Oct 15, 2023",
    city: "London",
    spend: 8420,
    notes: "Prefiere check-in temprano y habitacion en piso alto.",
  },
  {
    id: "LM-8842",
    name: "Julian Vance",
    email: "julian.v@techcorp.com",
    phone: "+44 20 7946 0123",
    bookings: 4,
    status: "activo",
    latestStay: "Nov 02 - Nov 05, 2023",
    city: "Manchester",
    spend: 2860,
    notes: "Viajes corporativos frecuentes.",
  },
  {
    id: "LM-9055",
    name: "Sofia Castillo",
    email: "sofia.castillo@global.net",
    phone: "+34 912 34 56 78",
    bookings: 28,
    status: "vip",
    latestStay: "En hotel - salida manana",
    city: "Madrid",
    spend: 16840,
    notes: "Cliente de alto valor, solicita amenities premium.",
  },
  {
    id: "LM-9102",
    name: "Amara Okafor",
    email: "amara.okafor@agency.com",
    phone: "+234 803 123 4567",
    bookings: 2,
    status: "activo",
    latestStay: "Primera estadia - Oct 05",
    city: "Lagos",
    spend: 980,
    notes: "Interesada en promociones familiares.",
  },
  {
    id: "LM-9218",
    name: "Mateo Rivas",
    email: "mateo.rivas@example.com",
    phone: "+51 955 019 221",
    bookings: 0,
    status: "inactivo",
    latestStay: "Sin estadias recientes",
    city: "Lima",
    spend: 0,
    notes: "Registro pendiente de confirmacion.",
  },
];

const emptyClientForm = {
  name: "",
  email: "",
  phone: "",
  bookings: "0",
  status: "activo",
  latestStay: "",
  city: "",
  spend: "0",
  notes: "",
};

const statusLabels = {
  vip: "VIP",
  activo: "Activo",
  inactivo: "Inactivo",
};

const sortLabels = {
  name: "Cliente",
  bookings: "Reservas",
  status: "Estado",
  latestStay: "Ultima estadia",
};

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatCurrency(value) {
  return `$${Number(value).toLocaleString("en-US")}`;
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

function ClientStatusBadge({ status }) {
  return (
    <span className={`client-status ${status}`}>{statusLabels[status]}</span>
  );
}

function SkeletonRows() {
  return (
    <div className="clients-skeleton-list" aria-label="Cargando clientes">
      {[1, 2, 3, 4].map((item) => (
        <div className="clients-skeleton-row" key={item}>
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
  client,
  activeTab,
  form,
  onChange,
  onClose,
  onDelete,
  onSave,
  onTabChange,
}) {
  if (!client) {
    return null;
  }

  return (
    <div className="client-drawer-backdrop" role="presentation">
      <aside className="client-drawer" aria-label={`Detalle de ${client.name}`}>
        <header>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de cliente"
          >
            x
          </button>
          <div className="client-drawer-avatar">{getInitials(client.name)}</div>
          <h2>{client.name}</h2>
          <p>
            {client.id} - {client.email}
          </p>
          <ClientStatusBadge status={client.status} />
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
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Telefono
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
              />
            </label>
            <label>
              Ciudad
              <input name="city" value={form.city} onChange={onChange} />
            </label>
            <label>
              Estado
              <select name="status" value={form.status} onChange={onChange}>
                <option value="activo">Activo</option>
                <option value="vip">VIP</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>
            <label>
              Notas
              <textarea name="notes" value={form.notes} onChange={onChange} />
            </label>
            <div className="client-drawer-actions">
              <button type="submit">Guardar cambios</button>
              <button type="button" onClick={() => onDelete(client.id)}>
                Eliminar cliente
              </button>
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
              <span>Gasto historico</span>
              <strong>{formatCurrency(client.spend)}</strong>
            </div>
            <p>Ultima estadia: {client.latestStay}</p>
          </div>
        )}

        {activeTab === "historial" && (
          <div className="client-drawer-panel">
            <p>Perfil creado desde el directorio administrativo.</p>
            <p>Ultima actualizacion realizada desde el panel de clientes.</p>
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
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [minBookings, setMinBookings] = useState("0");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [drawerTab, setDrawerTab] = useState("datos");
  const [drawerForm, setDrawerForm] = useState(emptyClientForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timeout);
  }, []);

  const selectedClient =
    clients.find((client) => client.id === selectedClientId) || null;

  const filteredClients = useMemo(() => {
    const filtered = clients.filter((client) => {
      const searchText =
        `${client.id} ${client.name} ${client.email} ${client.phone}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "todos" || client.status === statusFilter;
      const matchesBookings = client.bookings >= Number(minBookings || 0);

      return matchesSearch && matchesStatus && matchesBookings;
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
  }, [clients, search, statusFilter, minBookings, sortConfig]);

  const totals = useMemo(() => {
    return clients.reduce(
      (accumulator, client) => {
        accumulator.total += 1;
        accumulator[client.status] += 1;
        accumulator.bookings += client.bookings;
        return accumulator;
      },
      { total: 0, vip: 0, activo: 0, inactivo: 0, bookings: 0 },
    );
  }, [clients]);

  const handleDrawerInputChange = (event) => {
    const { name, value } = event.target;
    setDrawerForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const buildClientData = (sourceForm, id) => ({
    id,
    name: sourceForm.name.trim(),
    email: sourceForm.email.trim(),
    phone: sourceForm.phone.trim(),
    bookings: Number(sourceForm.bookings),
    status: sourceForm.status,
    latestStay: sourceForm.latestStay.trim() || "Sin estadias registradas",
    city: sourceForm.city.trim(),
    spend: Number(sourceForm.spend),
    notes: sourceForm.notes.trim(),
  });

  const openDrawer = (client) => {
    setSelectedClientId(client.id);
    setDrawerTab("datos");
    setDrawerForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      bookings: String(client.bookings),
      status: client.status,
      latestStay: client.latestStay,
      city: client.city,
      spend: String(client.spend),
      notes: client.notes,
    });
  };

  const handleDelete = (clientId) => {
    setClients((currentClients) =>
      currentClients.filter((client) => client.id !== clientId),
    );
    if (selectedClientId === clientId) {
      setSelectedClientId(null);
    }
  };

  const handleDrawerSave = (event) => {
    event.preventDefault();
    const clientData = buildClientData(drawerForm, selectedClientId);
    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === selectedClientId ? clientData : client,
      ),
    );
  };

  const handleSort = (key) => {
    setSortConfig((currentSort) => ({
      key,
      direction:
        currentSort.key === key && currentSort.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("todos");
    setMinBookings("0");
  };

  return (
    <div className="admin-shell clients-admin-shell">
      <SidebarNav location={location} />

      <main className="admin-main clients-admin-main">
        <header className="admin-topbar clients-admin-topbar">
          <input
            type="search"
            placeholder="Buscar clientes, email o ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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

        <section className="rooms-admin-heading clients-hero">
          <div>
            <p className="section-kicker">Directory - All guests</p>
            <h1>Directorio de clientes</h1>
            <p>
              Gestiona perfiles, contacto, estado de fidelidad e historial de
              reservas.
            </p>
          </div>
          <div className="clients-admin-heading-actions">
            <button type="button">Exportar CSV</button>
          </div>
        </section>

        <section className="clients-metrics" aria-label="Resumen de clientes">
          <MetricCard
            label="Total clientes"
            value={totals.total}
            description="Clientes registrados"
            change="+8.2%"
            tone="slate"
          />
          <MetricCard
            label="Clientes VIP"
            value={totals.vip}
            description="Alta recurrencia"
            change="+3.1%"
            tone="gold"
          />
          <MetricCard
            label="Clientes activos"
            value={totals.activo}
            description="Listos para reservas"
            change="+5.4%"
            tone="green"
          />
          <MetricCard
            label="Reservas totales"
            value={totals.bookings}
            description="Historial acumulado"
            change="+12.5%"
            tone="blue"
          />
        </section>

        <section
          className="clients-filter-card"
          aria-label="Filtros de clientes"
        >
          <label>
            <span>Buscar</span>
            <input
              type="search"
              placeholder="Nombre, email o ID..."
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
              <option value="todos">Todos</option>
              <option value="vip">VIP</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>
          <div className="clients-advanced-filter">
            <button
              type="button"
              onClick={() => setAdvancedOpen((open) => !open)}
            >
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
            <div className="clients-admin-table-header">
              {[
                ["name", "Cliente"],
                ["email", "Contacto"],
                ["bookings", "Reservas"],
                ["status", "Estado"],
                ["latestStay", "Ultima estadia"],
              ].map(([key, label]) => (
                <button key={key} type="button" onClick={() => handleSort(key)}>
                  {label}
                  {sortConfig.key === key && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </button>
              ))}
              <span>Acciones</span>
            </div>

            {loading ? (
              <SkeletonRows />
            ) : (
              <div className="rooms-admin-table-body">
                {filteredClients.map((client) => (
                  <div
                    className="clients-admin-row"
                    key={client.id}
                    onDoubleClick={() => openDrawer(client)}
                  >
                    <button
                      className="clients-admin-guest"
                      type="button"
                      onClick={() => openDrawer(client)}
                    >
                      <span>{getInitials(client.name)}</span>
                      <div>
                        <strong>{client.name}</strong>
                        <small>ID: {client.id}</small>
                      </div>
                    </button>
                    <div className="clients-admin-contact">
                      <span>{client.email}</span>
                      <small>{client.phone}</small>
                    </div>
                    <strong>{client.bookings}</strong>
                    <ClientStatusBadge status={client.status} />
                    <span>{client.latestStay}</span>
                    <div className="rooms-admin-actions clients-row-actions">
                      <button type="button" onClick={() => openDrawer(client)}>
                        Ver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <footer className="rooms-admin-table-footer">
              Mostrando <strong>{filteredClients.length}</strong> de{" "}
              <strong>{clients.length}</strong> clientes
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
          onDelete={handleDelete}
          onSave={handleDrawerSave}
          onTabChange={setDrawerTab}
        />
      </main>
    </div>
  );
}

export default ClienteAdmin;
