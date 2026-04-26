import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminPagos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [filterMethod, setFilterMethod] = useState("Todos los Métodos");

  // DATOS DE EJEMPLO
  const transactions = [
    {
      id: "#TRX-88219",
      guest: "Julianne Smith",
      initials: "JS",
      date: "Oct 24, 2023",
      method: "Visa •••• 4242",
      amount: "$1,450.00",
      status: "Paid",
    },
    {
      id: "#TRX-88218",
      guest: "Marcus Kohler",
      initials: "MK",
      date: "Oct 24, 2023",
      method: "PayPal",
      amount: "$890.00",
      status: "Refunded",
    },
    {
      id: "#TRX-88217",
      guest: "Elena Tsvetkova",
      initials: "ET",
      date: "Oct 23, 2023",
      method: "Visa •••• 9901",
      amount: "$2,100.00",
      status: "Paid",
    },
    {
      id: "#TRX-88216",
      guest: "Robert White",
      initials: "RW",
      date: "Oct 23, 2023",
      method: "Mastercard",
      amount: "$455.50",
      status: "Processing",
    },
  ];

  // LÓGICA DE FILTRADO
  const filteredTransactions = transactions.filter((trx) => {
    if (filterMethod === "Todos los Métodos") return true;
    return trx.method.toLowerCase().includes(filterMethod.toLowerCase());
  });

  return (
    <div className="admin-shell">
      {/* SIDEBAR SINCRONIZADO */}
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
          <span>Executive Manager</span>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="flex items-center bg-slate-50 rounded-full px-4 py-2 border border-slate-200 w-96">
            <span className="material-symbols-outlined text-slate-400 text-sm mr-2">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
              placeholder="Buscar transacciones..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-[#041627] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">add</span>
              Nueva Transacción
            </button>
            <div className="admin-profile-menu">
              <button
                type="button"
                className="font-bold text-sm text-slate-700"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                Admin Profile
              </button>
              {profileOpen && (
                <div className="admin-profile-dropdown">
                  <button type="button" onClick={() => navigate("/")}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="admin-heading">
          <p className="section-kicker">Finance Ledger</p>
          <h1>Transacciones Financieras</h1>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta 1 - Ingresos */}
          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[160px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Ingresos Diarios
              </p>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                +12.5%
              </span>
            </div>
            <strong className="text-2xl text-[#041627] font-bold">
              $14,280.50
            </strong>
          </article>

          {/* Tarjeta 2 - Meta */}
          <article className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[160px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Meta Mensual
              </p>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                78%
              </span>
            </div>
            <div>
              <strong className="text-2xl text-[#041627] font-bold">
                $450,000.00
              </strong>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#775a19] h-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
          </article>

          {/* Tarjeta 3 - Balance (CON TU COLOR ORIGINAL #041627) */}
          <article className="bg-[#041627] p-6 rounded-xl shadow-sm h-[160px] flex flex-col justify-between border-none relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Balance Disponible
              </p>
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[#e9c176] text-xl">
                  account_balance
                </span>
              </div>
            </div>
            <div className="relative z-10">
              <strong className="text-2xl text-white font-bold">
                $1,200,000.00
              </strong>
            </div>
            {/* Brillo sutil de fondo para que no sea un bloque plano */}
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
          </article>
        </section>

        {/* TABLA CON FILTRO FUNCIONAL */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <div className="flex gap-3">
              <select
                className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 bg-white outline-none cursor-pointer hover:border-slate-400 transition-colors"
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="Todos los Métodos">Todos los Métodos</option>
                <option value="Visa">Visa</option>
                <option value="PayPal">PayPal</option>
                <option value="Mastercard">Mastercard</option>
              </select>
            </div>
            <button className="text-xs font-bold text-slate-600 flex items-center gap-1 hover:text-slate-900 transition-colors">
              <span className="material-symbols-outlined text-sm">
                download
              </span>{" "}
              Exportar CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    ID Transacción
                  </th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Huésped
                  </th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Fecha
                  </th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Método
                  </th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Monto
                  </th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 text-xs font-mono text-slate-500">
                      {trx.id}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-[#041627]">
                          {trx.initials}
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {trx.guest}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-600">{trx.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="material-symbols-outlined text-sm">
                          {trx.method.includes("Visa") ||
                          trx.method.includes("Mastercard")
                            ? "credit_card"
                            : "account_balance_wallet"}
                        </span>
                        {trx.method}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-900">
                      {trx.amount}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          trx.status === "Paid"
                            ? "bg-green-50 text-green-700"
                            : trx.status === "Refunded"
                              ? "bg-red-50 text-red-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-12 text-center text-slate-400 text-xs italic"
                    >
                      No se encontraron transacciones para el filtro
                      seleccionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPagos;
