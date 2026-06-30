import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("luxestay.adminSession")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("luxestay.adminSession");
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  const stats = [
    { label: "Ingresos totales", value: "$284,500", note: "Histórico", noteColor: "#4caf50" },
    { label: "Reservas activas", value: "12", note: "Confirmadas", noteColor: "#4caf50" },
    { label: "Ocupación", value: "78%", note: "Media demanda", noteColor: "#f59e0b" },
    { label: "Reservas pendientes", value: "4", note: "Revisión", noteColor: "#f59e0b" },
  ];

  const reservasRecientes = [
    { id: 1, nombre: "Carlos Mendoza", habitacion: "101", fechas: "01 jul – 05 jul", estado: "Confirmada", total: "$420" },
    { id: 2, nombre: "Ana García", habitacion: "204", fechas: "02 jul – 04 jul", estado: "Pendiente", total: "$280" },
    { id: 3, nombre: "Luis Torres", habitacion: "312", fechas: "03 jul – 07 jul", estado: "Confirmada", total: "$560" },
  ];

  const tasks = [
    { title: "Habitaciones disponibles", room: "8 de 20", detail: "Listas para check-in" },
    { title: "En mantenimiento", room: "2 habitación(es)", detail: "Requieren atención" },
    { title: "Clientes registrados", room: "45 clientes", detail: "48 usuarios en total" },
  ];

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
          {[
            ["/admin/dashboard", "Dashboard"],
            ["/admin/habitaciones", "Habitaciones"],
            ["/admin/areas-comunes", "Áreas comunes"],
            ["/admin/clientes", "Clientes"],
            ["/admin/reservas", "Reservas"],
            ["/admin/pagos", "Pagos"],
            ["/admin/reportes", "Reportes"],
          ].map(([path, label]) => (
            <Link
              key={path}
              className={location.pathname === path ? "active" : ""}
              to={path}
            >
              {label}
            </Link>
          ))}
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
                <button type="button" onClick={handleLogout}>
                  Cerrar sesión
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
              <span style={{ color: stat.noteColor }}>{stat.note}</span>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        <section className="admin-content-grid">
          <article className="admin-table-card">
            <div className="admin-card-heading">
              <h2>Reservas recientes</h2>
              <Link to="/admin/reservas">Ver todas</Link>
            </div>
            <div className="admin-booking-table">
              {reservasRecientes.map((r) => (
                <div className="admin-booking-row" key={r.id}>
                  <span>{r.nombre}</span>
                  <span>{r.habitacion}</span>
                  <span>{r.fechas}</span>
                  <span className={r.estado === "Confirmada" ? "confirmed" : "pending"}>
                    {r.estado}
                  </span>
                  <strong>{r.total}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-revenue-card">
            <h2>Ingresos semanales</h2>
            <p>Últimos 7 días</p>
            <div className="admin-bars" aria-hidden="true">
              {[42, 58, 86, 72, 66, 82, 54].map((height, index) => (
                <span
                  className={index === 2 || index === 5 ? "highlight" : ""}
                  key={index}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="admin-revenue-summary">
              <span>Total semanal</span>
              <strong>$12,400</strong>
            </div>
            <div className="admin-revenue-summary" style={{ marginTop: "0.25rem" }}>
              <span>Promedio diario</span>
              <strong>$1,771</strong>
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
