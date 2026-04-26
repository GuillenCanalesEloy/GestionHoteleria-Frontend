import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const stats = [
  { label: "Ingresos totales", value: "$124,500", note: "+12%" },
  { label: "Reservas activas", value: "42", note: "Este mes" },
  { label: "Ocupacion", value: "85%", note: "Alta demanda" },
  { label: "Pagos pendientes", value: "18", note: "Revision" },
];

const bookings = [
  {
    guest: "Eleanor James",
    room: "Suite 402",
    date: "Oct 12 - 15",
    status: "Confirmada",
    amount: "$1,240",
  },
  {
    guest: "Marcus Holloway",
    room: "Room 108",
    date: "Oct 14 - 16",
    status: "Pendiente",
    amount: "$580",
  },
  {
    guest: "Sarah Miller",
    room: "Penthouse 01",
    date: "Oct 15 - 20",
    status: "Confirmada",
    amount: "$4,500",
  },
];

const tasks = [
  {
    title: "Limpieza programada",
    room: "Penthouse Suite 01",
    detail: "2:00 PM",
  },
  {
    title: "Lista para check-in",
    room: "Deluxe Double 204",
    detail: "Housekeeping finalizado",
  },
  {
    title: "Mantenimiento requerido",
    room: "Standard King 312",
    detail: "Revision de aire acondicionado",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="admin-shell">
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
            className={location.pathname === "/admin/habitaciones" ? "active" : ""}
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
          <button type="button">Pagos</button>
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

      <main className="admin-main">
        <header className="admin-topbar">
          <input
            type="search"
            placeholder="Buscar reservas, habitaciones o huespedes..."
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

        <section className="admin-heading">
          <p className="section-kicker">Dashboard overview</p>
          <h1>Bienvenido, Admin.</h1>
        </section>

        <section
          className="admin-stats-grid"
          aria-label="Estadisticas administrativas"
        >
          {stats.map((stat) => (
            <article className="admin-stat-card" key={stat.label}>
              <span>{stat.note}</span>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="admin-content-grid">
          <article className="admin-table-card">
            <div className="admin-card-heading">
              <h2>Reservas recientes</h2>
              <button type="button">Ver todas</button>
            </div>
            <div className="admin-booking-table">
              {bookings.map((booking) => (
                <div
                  className="admin-booking-row"
                  key={`${booking.guest}-${booking.room}`}
                >
                  <span>{booking.guest}</span>
                  <span>{booking.room}</span>
                  <span>{booking.date}</span>
                  <span
                    className={
                      booking.status === "Confirmada" ? "confirmed" : "pending"
                    }
                  >
                    {booking.status}
                  </span>
                  <strong>{booking.amount}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-revenue-card">
            <h2>Ingresos semanales</h2>
            <p>Rendimiento por dia</p>
            <div className="admin-bars" aria-hidden="true">
              {[42, 58, 86, 72, 66, 82, 54].map((height, index) => (
                <span
                  className={index === 2 || index === 5 ? "highlight" : ""}
                  key={height}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="admin-revenue-summary">
              <span>Promedio diario</span>
              <strong>$16,714</strong>
            </div>
          </article>
        </section>

        <section className="admin-task-grid">
          {tasks.map((task) => (
            <article className="admin-task-card" key={task.title}>
              <span>{task.title}</span>
              <strong>{task.room}</strong>
              <p>{task.detail}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
