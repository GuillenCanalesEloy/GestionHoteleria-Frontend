import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Reportes = () => {
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

  // Datos para la tabla de rendimiento
  const performanceData = [
    {
      month: "Junio 2024",
      revenue: "$242,500",
      occupancy: "95.2%",
      revpar: "$326.10",
      status: "Peak",
    },
    {
      month: "Mayo 2024",
      revenue: "$221,800",
      occupancy: "88.4%",
      revpar: "$315.40",
      status: "Above Avg",
    },
    {
      month: "Abril 2024",
      revenue: "$198,400",
      occupancy: "74.1%",
      revpar: "$308.20",
      status: "Neutral",
    },
    {
      month: "Marzo 2024",
      revenue: "$212,000",
      occupancy: "82.5%",
      revpar: "$312.00",
      status: "Above Avg",
    },
  ];

  return (
    <div className="admin-shell">
      {/* Sidebar  */}
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

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <input
            type="search"
            placeholder="Buscar reportes, fechas o métricas..."
          />
          <div className="flex items-center gap-4">
            <button className="bg-[#041627] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                file_download
              </span>
              Exportar PDF
            </button>
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
          </div>
        </header>

        <section className="admin-heading">
          <p className="section-kicker">Analytics Insights</p>
          <h1>Análisis de Rendimiento</h1>
        </section>

        {/* Resumen de Métricas (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12.4%
              </span>
              <span className="material-symbols-outlined text-slate-400">
                payments
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              INGRESOS TOTALES
            </p>
            <strong className="text-2xl font-bold text-slate-900">
              $1,284,500
            </strong>
          </article>

          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +4.2%
              </span>
              <span className="material-symbols-outlined text-slate-400">
                bed
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              OCUPACIÓN MEDIA
            </p>
            <strong className="text-2xl font-bold text-slate-900">84.2%</strong>
          </article>

          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                -0.8%
              </span>
              <span className="material-symbols-outlined text-slate-400">
                avg_pace
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              TARIFA DIARIA (ADR)
            </p>
            <strong className="text-2xl font-bold text-slate-900">
              $342.10
            </strong>
          </article>

          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                4.8/5.0
              </span>
              <span className="material-symbols-outlined text-slate-400">
                star
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              SATISFACCIÓN
            </p>
            <strong className="text-2xl font-bold text-slate-900">
              96% Positivo
            </strong>
          </article>
        </div>

        {/* Gráfico Comparativo (Simulado con CSS igual al Dashboard) */}
        <article className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Ocupación vs Ingresos
              </h3>
              <p className="text-sm text-slate-500">
                Análisis comparativo primer semestre 2024
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#041627] rounded-full"></div>
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Ingresos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Ocupación
                </span>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between px-4 border-b border-slate-100">
            {[45, 55, 75, 68, 85, 92].map((height, i) => (
              <div
                key={i}
                className="flex gap-1 items-end h-full group relative cursor-pointer"
              >
                <div
                  className="w-8 bg-[#041627] rounded-t-sm transition-all group-hover:opacity-80"
                  style={{ height: `${height}%` }}
                ></div>
                <div
                  className="w-8 bg-amber-500 rounded-t-sm transition-all group-hover:opacity-80"
                  style={{ height: `${height - 10}%` }}
                ></div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                  {["ENE", "FEB", "MAR", "ABR", "MAY", "JUN"][i]}
                </span>
              </div>
            ))}
          </div>
        </article>

        {/* Tabla de Rendimiento Mensual */}
        <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Rendimiento Mensual Detallado
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">
                  Mes
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Ingresos
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Ocupación
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">
                  RevPAR
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {performanceData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{item.month}</td>
                  <td className="p-4 text-right text-slate-600">
                    {item.revenue}
                  </td>
                  <td className="p-4 text-right text-slate-600">
                    {item.occupancy}
                  </td>
                  <td className="p-4 text-right text-slate-600">
                    {item.revpar}
                  </td>
                  <td className="p-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === "Peak"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </main>
    </div>
  );
};

export default Reportes;
