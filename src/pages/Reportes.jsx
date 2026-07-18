import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { dashboardApi } from "../services/hotelApi.js";

function getMonthRange(monthsAgo) {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - monthsAgo);
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
  const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const name = d.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const shortName = d.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
  return { firstDay, lastDay, daysInMonth, name, shortName };
}

function statusFromOcupacion(pct) {
  if (pct >= 90) return "Peak";
  if (pct >= 75) return "Above Avg";
  return "Neutral";
}

const Reportes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const [metrics, setMetrics] = useState({
    ingresosTotales: 0,
    ocupacionMedia: 0,
    adr: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    let isMounted = true;

    async function loadReportesData() {
      const months = [0, 1, 2, 3, 4, 5].map(getMonthRange);

      const [resumenResult, ...monthResults] = await Promise.allSettled([
        dashboardApi.getResumen(),
        ...months.flatMap((m) => [
          dashboardApi.getIngresos({ fechaDesde: m.firstDay, fechaHasta: m.lastDay }),
          dashboardApi.getOcupacion({ fechaEntrada: m.firstDay, fechaSalida: m.lastDay }),
        ]),
      ]);

      if (!isMounted) return;

      const totalHabitaciones =
        resumenResult.status === "fulfilled"
          ? resumenResult.value.data?.totalHabitaciones || 1
          : 1;

      const ingresosHistoricos =
        resumenResult.status === "fulfilled"
          ? Number(resumenResult.value.data?.ingresosHistoricos ?? 0)
          : 0;

      const parsed = months.map((m, i) => {
        const ingResult = monthResults[i * 2];
        const ocResult = monthResults[i * 2 + 1];

        const ingresos =
          ingResult.status === "fulfilled"
            ? Number(ingResult.value.data?.ingresosTotales ?? 0)
            : 0;
        const ocupacionPct =
          ocResult.status === "fulfilled"
            ? Number(ocResult.value.data?.porcentajeOcupacion ?? 0)
            : 0;

        const revpar =
          totalHabitaciones > 0 && m.daysInMonth > 0
            ? (ingresos / (totalHabitaciones * m.daysInMonth)).toFixed(2)
            : "0.00";

        return {
          month: m.name.charAt(0).toUpperCase() + m.name.slice(1),
          shortName: m.shortName,
          revenue: `$${ingresos.toLocaleString("en-US")}`,
          revenueNum: ingresos,
          occupancy: `${ocupacionPct.toFixed(1)}%`,
          occupancyNum: ocupacionPct,
          revpar: `$${revpar}`,
          status: statusFromOcupacion(ocupacionPct),
        };
      });

      const table = parsed;
      const chart = [...parsed].reverse();

      const maxRev = Math.max(...chart.map((m) => m.revenueNum), 1);
      const chartWithHeights = chart.map((m) => ({
        ...m,
        revHeight: Math.max(5, Math.round((m.revenueNum / maxRev) * 90)),
        occHeight: Math.max(5, Math.round(m.occupancyNum)),
      }));

      const ocupMediaArr = table.map((m) => m.occupancyNum);
      const ocupMedia =
        ocupMediaArr.length > 0
          ? (ocupMediaArr.reduce((a, b) => a + b, 0) / ocupMediaArr.length).toFixed(1)
          : 0;

      const totalIngresos = table.reduce((s, m) => s + m.revenueNum, 0);
      const totalDias = months.reduce((s, m) => s + m.daysInMonth, 0);
      const adr =
        totalHabitaciones > 0 && totalDias > 0
          ? (totalIngresos / (totalHabitaciones * totalDias)).toFixed(2)
          : "0.00";

      if (isMounted) {
        setMetrics({
          ingresosTotales: ingresosHistoricos,
          ocupacionMedia: ocupMedia,
          adr,
        });
        setMonthlyData(table);
        setChartData(chartWithHeights);
        setLoading(false);
      }
    }

    loadReportesData();
    return () => { isMounted = false; };
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

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
          <span>General manager</span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <input type="search" placeholder="Buscar reportes, fechas o métricas..." />
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportPDF}
              className="bg-[#041627] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">file_download</span>
              Exportar PDF
            </button>
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
          </div>
        </header>

        <section className="admin-heading">
          <p className="section-kicker">Analytics Insights</p>
          <h1>Análisis de Rendimiento</h1>
        </section>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Acumulado
              </span>
              <span className="material-symbols-outlined text-slate-400">payments</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              INGRESOS TOTALES
            </p>
            <strong className="text-2xl font-bold text-slate-900">
              {loading ? "..." : `$${Number(metrics.ingresosTotales).toLocaleString("en-US")}`}
            </strong>
          </article>

          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Acumulado
              </span>
              <span className="material-symbols-outlined text-slate-400">bed</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              OCUPACIÓN MEDIA
            </p>
            <strong className="text-2xl font-bold text-slate-900">
              {loading ? "..." : `${metrics.ocupacionMedia}%`}
            </strong>
          </article>

          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                Promedio
              </span>
              <span className="material-symbols-outlined text-slate-400">avg_pace</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              TARIFA DIARIA (ADR)
            </p>
            <strong className="text-2xl font-bold text-slate-900">
              {loading ? "..." : `$${metrics.adr}`}
            </strong>
          </article>
        </div>

        {/* Gráfico */}
        <article className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ocupación vs Ingresos</h3>
              <p className="text-sm text-slate-500">Histórico</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#041627] rounded-full" />
                <span className="text-xs font-bold text-slate-600 uppercase">Ingresos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-xs font-bold text-slate-600 uppercase">Ocupación</span>
              </div>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between px-4 border-b border-slate-100">
            {loading
              ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex gap-1 items-end h-full">
                    <div className="w-8 bg-slate-200 rounded-t-sm" style={{ height: "30%" }} />
                    <div className="w-8 bg-slate-200 rounded-t-sm" style={{ height: "20%" }} />
                  </div>
                ))
              : chartData.map((m, i) => (
                  <div key={i} className="flex gap-1 items-end h-full group relative cursor-pointer">
                    <div
                      className="w-8 bg-[#041627] rounded-t-sm transition-all group-hover:opacity-80"
                      style={{ height: `${m.revHeight}%` }}
                    />
                    <div
                      className="w-8 bg-amber-500 rounded-t-sm transition-all group-hover:opacity-80"
                      style={{ height: `${m.occHeight}%` }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                      {m.shortName}
                    </span>
                  </div>
                ))}
          </div>
        </article>

        {/* Tabla mensual */}
        <article className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Rendimiento Mensual Detallado</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Mes</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Ingresos</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Ocupación</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">RevPAR</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">Cargando datos...</td>
                </tr>
              ) : monthlyData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">Sin datos disponibles</td>
                </tr>
              ) : (
                monthlyData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{item.month}</td>
                    <td className="p-4 text-right text-slate-600">{item.revenue}</td>
                    <td className="p-4 text-right text-slate-600">{item.occupancy}</td>
                    <td className="p-4 text-right text-slate-600">{item.revpar}</td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          item.status === "Peak"
                            ? "bg-green-50 text-green-700"
                            : item.status === "Above Avg"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </article>
      </main>
    </div>
  );
};

export default Reportes;
