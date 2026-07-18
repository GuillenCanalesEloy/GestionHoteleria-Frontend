import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { dashboardApi } from "../services/hotelApi.js";

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

  const [stats, setStats] = useState([
    { label: "Ingresos totales", value: "$0", note: "Histórico", noteColor: "#4caf50" },
    { label: "Reservas activas", value: "0", note: "Confirmadas", noteColor: "#4caf50" },
    { label: "Ocupación", value: "0%", note: "Actual", noteColor: "#f59e0b" },
    { label: "Reservas pendientes", value: "0", note: "Revisión", noteColor: "#f59e0b" },
  ]);

  const [reservasRecientes, setReservasRecientes] = useState([]);

  const [tasks, setTasks] = useState([
    { title: "Habitaciones disponibles", room: "—", detail: "Listas para check-in" },
    { title: "En mantenimiento", room: "—", detail: "Requieren atención" },
    { title: "Clientes registrados", room: "—", detail: "Usuarios en total" },
  ]);

  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [weeklyAvg, setWeeklyAvg] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      const [resumenResult, reservasResult, ingresosResult] =
        await Promise.allSettled([
          dashboardApi.getResumen(),
          dashboardApi.getReservas({ page: 0, size: 5 }),
          dashboardApi.getIngresos({}),
        ]);

      if (!isMounted) return;

      if (resumenResult.status === "fulfilled") {
        const r = resumenResult.value.data || {};
        const total = r.totalHabitaciones || 0;
        const ocupadas = r.habitacionesOcupadas || 0;
        const ocupacionPct = total > 0 ? Math.round((ocupadas / total) * 100) : 0;

        setStats([
          {
            label: "Ingresos totales",
            value: `$${Number(r.ingresosHistoricos ?? 0).toLocaleString("en-US")}`,
            note: "Histórico",
            noteColor: "#4caf50",
          },
          {
            label: "Reservas activas",
            value: String(r.reservasConfirmadas ?? 0),
            note: "Confirmadas",
            noteColor: "#4caf50",
          },
          {
            label: "Ocupación",
            value: `${ocupacionPct}%`,
            note: "Actual",
            noteColor: "#f59e0b",
          },
          {
            label: "Reservas pendientes",
            value: String(r.reservasPendientes ?? 0),
            note: "Revisión",
            noteColor: "#f59e0b",
          },
        ]);

        setTasks([
          {
            title: "Habitaciones disponibles",
            room: `${r.habitacionesDisponibles ?? 0} de ${total}`,
            detail: "Listas para check-in",
          },
          {
            title: "En mantenimiento",
            room: `${r.habitacionesMantenimiento ?? 0} habitación(es)`,
            detail: "Requieren atención",
          },
          {
            title: "Clientes registrados",
            room: `${r.totalClientes ?? 0} clientes`,
            detail: `${r.totalUsuarios ?? 0} usuarios en total`,
          },
        ]);
      }

      if (reservasResult.status === "fulfilled") {
        const data = reservasResult.value.data;
        const reservas = data?.content ?? (Array.isArray(data) ? data : []);
        if (reservas.length) {
          setReservasRecientes(
            reservas.slice(0, 5).map((rv) => ({
              id: rv.id,
              nombre: rv.usuarioNombre || "Cliente",
              habitacion: rv.habitacionNumero || rv.habitacionId || "-",
              fechas: `${rv.fechaEntrada || ""} – ${rv.fechaSalida || ""}`,
              estado: rv.estado || "Pendiente",
              total: rv.precioTotal != null ? `$${Number(rv.precioTotal).toLocaleString("en-US")}` : "—",
            })),
          );
        }
      }

      if (ingresosResult.status === "fulfilled") {
        const ing = ingresosResult.value.data || {};
        const total = Number(ing.ingresosTotales ?? 0);
        setWeeklyTotal(total);
        setWeeklyAvg(0);
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

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
          <input type="search" placeholder="Buscar reservas, habitaciones o huespedes..." />
          <div className="admin-profile-menu">
            <button type="button" onClick={() => setProfileOpen((o) => !o)}>
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

        <section className="admin-stats-grid" aria-label="Estadisticas administrativas">
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
              {reservasRecientes.length === 0 ? (
                <p style={{ padding: "1rem", color: "#888" }}>Cargando reservas...</p>
              ) : (
                reservasRecientes.map((r) => (
                  <div className="admin-booking-row" key={r.id}>
                    <span>{r.nombre}</span>
                    <span>{r.habitacion}</span>
                    <span>{r.fechas}</span>
                    <span
                      className={
                        r.estado === "CONFIRMADA" || r.estado === "Confirmada"
                          ? "confirmed"
                          : "pending"
                      }
                    >
                      {r.estado}
                    </span>
                    <strong>{r.total}</strong>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="admin-revenue-card">
            <h2>Resumen de ingresos</h2>
            <p>Histórico acumulado</p>
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
              <span>Total histórico</span>
              <strong>${weeklyTotal.toLocaleString("en-US")}</strong>
            </div>
            <div className="admin-revenue-summary" style={{ marginTop: "0.25rem" }}>
              <span>Promedio por reserva</span>
              <strong>${weeklyAvg.toLocaleString("en-US")}</strong>
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
