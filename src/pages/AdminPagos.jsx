import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getClientReservations } from "../services/clientReservationsStorage.js";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function parseMoney(value) {
  const number = Number(String(value || "0").replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value) {
  return `$${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) {
    return "Fecha no registrada";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizePayment(reservation) {
  const guestName = reservation.guest?.name || "user";
  const paymentMethod =
    reservation.payment?.method ||
    (reservation.paymentMethod === "paypal" ? "PayPal" : "Tarjeta");
  const cardLast4 = reservation.payment?.cardLast4;
  const methodLabel =
    paymentMethod === "PayPal"
      ? "PayPal"
      : `Tarjeta${cardLast4 ? ` **** ${cardLast4}` : ""}`;

  return {
    id: reservation.payment?.transactionId || `TRX-${reservation.id || Date.now()}`,
    reservationId: reservation.id || "RES-USER",
    guest: guestName,
    initials: getInitials(guestName),
    date: formatDate(reservation.payment?.paidAt || reservation.paidAt || reservation.createdAt),
    rawDate: reservation.payment?.paidAt || reservation.paidAt || reservation.createdAt || "",
    method: methodLabel,
    methodFilter: paymentMethod,
    amount: parseMoney(reservation.total),
    status: "Pagado",
    room: reservation.room || reservation.title || "Habitacion",
    stay: reservation.dates || "Fechas por confirmar",
  };
}

function AdminPagos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("todos");

  const payments = useMemo(
    () => getClientReservations().map(normalizePayment),
    [],
  );

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchableText =
        `${payment.id} ${payment.reservationId} ${payment.guest} ${payment.room} ${payment.method}`.toLowerCase();
      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesMethod =
        filterMethod === "todos" || payment.methodFilter === filterMethod;

      return matchesSearch && matchesMethod;
    });
  }, [payments, search, filterMethod]);

  const totals = useMemo(() => {
    return payments.reduce(
      (accumulator, payment) => {
        accumulator.amount += payment.amount;
        accumulator.count += 1;
        return accumulator;
      },
      { amount: 0, count: 0 },
    );
  }, [payments]);

  return (
    <div className="admin-shell admin-payments-shell">
      <aside className="admin-sidebar">
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
          <span>Executive Manager</span>
        </div>
      </aside>

      <main className="admin-main admin-payments-main">
        <header className="admin-topbar admin-payments-topbar">
          <input
            type="search"
            placeholder="Buscar pago, reserva o habitacion..."
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

        <section className="rooms-admin-heading admin-payments-heading">
          <div>
            <p className="section-kicker">Finance ledger - user</p>
            <h1>Pagos del cliente user</h1>
            <p>
              Visualiza los pagos realizados por las reservas confirmadas desde
              el modulo de cliente.
            </p>
          </div>
        </section>

        <section className="admin-payments-metrics" aria-label="Resumen de pagos">
          <article>
            <span>Total pagado</span>
            <strong>{formatMoney(totals.amount)}</strong>
            <small>Ingresos del usuario user</small>
          </article>
          <article>
            <span>Pagos registrados</span>
            <strong>{totals.count}</strong>
            <small>Reservas pagadas</small>
          </article>
          <article>
            <span>Estado</span>
            <strong>{totals.count ? "Pagado" : "Sin pagos"}</strong>
            <small>Seguimiento administrativo</small>
          </article>
        </section>

        <section className="admin-payments-filter" aria-label="Filtros de pagos">
          <label>
            <span>Metodo</span>
            <select value={filterMethod} onChange={(event) => setFilterMethod(event.target.value)}>
              <option value="todos">Todos los metodos</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="PayPal">PayPal</option>
            </select>
          </label>
          <button type="button" onClick={() => setSearch("")}>
            Limpiar busqueda
          </button>
        </section>

        <section className="admin-payments-table-card">
          <div className="admin-payments-table-header">
            <span>ID transaccion</span>
            <span>Cliente</span>
            <span>Reserva</span>
            <span>Metodo</span>
            <span>Monto</span>
            <span>Estado</span>
          </div>

          <div className="rooms-admin-table-body">
            {filteredPayments.map((payment) => (
              <div className="admin-payments-row" key={payment.id}>
                <strong>{payment.id}</strong>
                <div className="admin-payments-user">
                  <span>{payment.initials}</span>
                  <div>
                    <strong>{payment.guest}</strong>
                    <small>Cliente user</small>
                  </div>
                </div>
                <div>
                  <strong>{payment.reservationId}</strong>
                  <small>
                    {payment.room} - {payment.stay}
                  </small>
                </div>
                <span>{payment.method}</span>
                <strong>{formatMoney(payment.amount)}</strong>
                <span className="admin-payment-status">{payment.status}</span>
              </div>
            ))}

            {!filteredPayments.length && (
              <div className="admin-payments-empty">
                <h2>No hay pagos registrados</h2>
                <p>
                  Cuando el usuario complete una reserva y realice el pago, la
                  transaccion aparecera en este panel.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPagos;
