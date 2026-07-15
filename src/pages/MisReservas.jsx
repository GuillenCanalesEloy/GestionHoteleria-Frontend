import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Header } from "./Home.jsx";
import { getClientReservations, saveClientReservations } from "../services/clientReservationsStorage.js";
import { reservasApi } from "../services/hotelApi";
import {
  mapBackendAreaReservation,
  reservationStatusToBackend,
} from "../services/commonAreasMapper.js";
import {
  getAreaReservations,
  getReservationStart,
  reservationStatusLabels,
  saveAreaReservations,
} from "../services/commonAreasStorage.js";
import { areasComunesApi, reservasAreasComunesApi } from "../services/hotelApi.js";

const STATUS_INFO = {
  CONFIRMADA: { label: "Confirmada", cls: "status-confirmada" },
  CANCELADA: { label: "Cancelada", cls: "status-cancelada" },
  PENDIENTE: { label: "Pendiente", cls: "status-pendiente" },
  FINALIZADA: { label: "Finalizada", cls: "status-finalizada" },
  Confirmada: { label: "Confirmada", cls: "status-confirmada" },
  Cancelada: { label: "Cancelada", cls: "status-cancelada" },
  confirmada: { label: "Confirmada", cls: "status-confirmada" },
  cancelada: { label: "Cancelada", cls: "status-cancelada" },
  pendiente: { label: "Pendiente", cls: "status-pendiente" },
  finalizada: { label: "Finalizada", cls: "status-finalizada" },
};

function getStatusInfo(status) {
  return STATUS_INFO[status] || { label: status || "Registrada", cls: "status-pendiente" };
}

function safeTotal(total) {
  if (!total || String(total).includes("undefined") || String(total).includes("NaN")) {
    return "Pendiente";
  }
  return total;
}

function MisReservas() {
  const location = useLocation();
  const [expandedReservation, setExpandedReservation] = useState(null);
  const clientSession = localStorage.getItem("luxestay.clientSession");
  const session = clientSession ? JSON.parse(clientSession) : null;
  const hasValidToken = Boolean(session?.token);
  const [areaReservations, setAreaReservations] = useState(() => getAreaReservations());
  const [areaReservationsError, setAreaReservationsError] = useState("");
  const [apiReservations, setApiReservations] = useState([]);
  const [loadingApiReservations, setLoadingApiReservations] = useState(false);
  const [apiError, setApiError] = useState("");
  const [localReservations, setLocalReservations] = useState(() => getClientReservations());
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!session?.id) return;
    let isMounted = true;

    async function loadAreaReservations() {
      setAreaReservationsError("");
      try {
        const [reservationsRes, areasRes] = await Promise.all([
          reservasAreasComunesApi.getByUsuario(session.id),
          areasComunesApi.getAll(),
        ]);
        if (isMounted) {
          const areasImageMap = Object.fromEntries(
            areasRes.data.map((a) => [a.id, a.imagenUrl])
          );
          setAreaReservations(
            reservationsRes.data.map((r) => ({
              ...mapBackendAreaReservation(r),
              image: areasImageMap[r.areaComunId] || undefined,
            }))
          );
        }
      } catch {
        if (isMounted) {
          setAreaReservationsError("No se pudieron cargar las reservas de áreas comunes.");
        }
      }
    }

    loadAreaReservations();
    return () => { isMounted = false; };
  }, [session?.id]);

  useEffect(() => {
    const clienteId = session?.cliente?.id || session?.usuario?.id || session?.id;
    if (!clienteId) return;

    const loadApiReservations = async () => {
      try {
        setLoadingApiReservations(true);
        setApiError("");
        const response = await reservasApi.getByCliente(clienteId);
        setApiReservations(response.data.content || []);
      } catch {
        setApiError("No se pudieron cargar las reservas del servidor.");
      } finally {
        setLoadingApiReservations(false);
      }
    };

    loadApiReservations();
  }, [session?.cliente?.id, session?.usuario?.id, session?.id]);

  const reservations = useMemo(() => {
    const roomReservations = localReservations
      .filter((reservation) => !session || reservation.guest?.name === session.username)
      .map((reservation) => ({
        ...reservation,
        source: "local",
        originalStatus: reservation.status,
        sortDate: new Date(reservation.checkIn || reservation.createdAt || Date.now()).getTime(),
      }));

    const currentAreaReservations = areaReservations
      .filter((reservation) => {
        if (reservation.usuarioId && session?.id) {
          return Number(reservation.usuarioId) === Number(session.id);
        }
        return reservation.username === session?.username;
      })
      .map((reservation) => ({
        ...reservation,
        source: "area",
        stage: reservationStatusLabels[reservation.status],
        originalStatus: reservation.status,
        status: reservationStatusLabels[reservation.status],
        sortDate: getReservationStart(reservation),
      }));

    const serverReservations = apiReservations.map((reservation) => ({
      id: `api-${reservation.id}`,
      source: "api",
      numericId: reservation.id,
      image: reservation.habitacionImagenUrl || "",
      title: `Habitación ${reservation.habitacionTipo || ""} #${reservation.habitacionNumero || ""}`.trim(),
      dates: `${reservation.fechaEntrada} - ${reservation.fechaSalida}`,
      guests: `${reservation.cantidadHuespedes || 1} huésped${(reservation.cantidadHuespedes || 1) === 1 ? "" : "es"}`,
      stage: reservation.estado || "PENDIENTE",
      status: reservation.estado || "PENDIENTE",
      total: reservation.precioTotal ? `$${reservation.precioTotal}` : "Pendiente",
      originalStatus: reservation.estado,
      sortDate: new Date(reservation.fechaEntrada || reservation.createdAt || Date.now()).getTime(),
      guest: {
        name: reservation.usuarioNombre || session?.username || "Cliente",
        email: reservation.usuarioEmail || session?.email || "Sin correo",
        phone: "Sin teléfono",
        requests: "Sin peticiones especiales",
      },
    }));

    return [...serverReservations, ...roomReservations, ...currentAreaReservations].sort(
      (first, second) => second.sortDate - first.sortDate,
    );
  }, [areaReservations, apiReservations, localReservations, session]);

  if (!hasValidToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          backgroundLocation: location,
          closeTo: "/",
          returnTo: "/mis-reservas",
        }}
      />
    );
  }

  const toggleReservation = (id) => {
    setExpandedReservation((current) => (current === id ? null : id));
  };

  const cancelAreaReservation = async (reservationId) => {
    setAreaReservationsError("");
    try {
      const response = await reservasAreasComunesApi.updateEstado(
        reservationId,
        reservationStatusToBackend.cancelada,
      );
      const updatedReservation = mapBackendAreaReservation(response.data);
      const nextReservations = areaReservations.map((reservation) =>
        reservation.id === reservationId ? updatedReservation : reservation,
      );
      setAreaReservations(nextReservations);
      saveAreaReservations(nextReservations);
    } catch {
      setAreaReservationsError("No se pudo cancelar la reserva de área común.");
    }
  };

  const deleteReservation = async (reservation) => {
    if (!window.confirm("¿Deseas eliminar esta reserva? Esta acción no se puede deshacer.")) return;
    setDeletingId(reservation.id);
    try {
      if (reservation.source === "api") {
        await reservasApi.delete(reservation.numericId);
        setApiReservations((prev) => prev.filter((r) => r.id !== reservation.numericId));
      } else if (reservation.source === "local") {
        const updated = localReservations.filter((r) => r.id !== reservation.id);
        saveClientReservations(updated);
        setLocalReservations(updated);
      } else if (reservation.source === "area") {
        await reservasAreasComunesApi.delete(reservation.id);
        const updated = areaReservations.filter((r) => r.id !== reservation.id);
        setAreaReservations(updated);
        saveAreaReservations(updated);
      }
    } catch {
      alert("No se pudo eliminar la reserva. Inténtalo de nuevo.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="home-page bookings-page">
      <Header />

      <main className="bookings-main">
        <section className="bookings-heading">
          <p className="section-kicker">Mis reservas</p>
          <h1>Gestiona tus estadías</h1>
          <p>
            Revisa tus próximas reservas, confirma los datos de tu habitación y
            mantente al tanto del estado de cada estadía.
          </p>
        </section>

        <section className="bookings-panel">
          <div className="bookings-toolbar">
            <div>
              <h2>Reservas registradas</h2>
              <p>{reservations.length} reservas vinculadas a tu cuenta.</p>
              {areaReservationsError && <p className="area-form-message">{areaReservationsError}</p>}
            </div>
            <Link className="book-link" to="/habitaciones">
              Nueva reserva
            </Link>
          </div>

          {loadingApiReservations && <p>Cargando reservas del servidor...</p>}
          {apiError && <p className="form-error-message">{apiError}</p>}

          <div className="booking-list">
            {reservations.length === 0 && (
              <div className="booking-empty-state">
                <h3>Aún no tienes reservas guardadas</h3>
                <p>Elige una habitación o área común y completa una reserva para verla aquí.</p>
                <Link className="book-link" to="/areas-comunes">
                  Ver áreas comunes
                </Link>
              </div>
            )}

            {reservations.map((reservation) => {
              const statusInfo = getStatusInfo(reservation.status);
              return (
                <article className="booking-card" key={reservation.id}>
                  {reservation.image && (
                    <img
                      src={reservation.image}
                      alt={reservation.title}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}

                  <div className="booking-info">
                    <span className={statusInfo.cls}>{statusInfo.label}</span>
                    <h3>{reservation.title || "Habitación reservada"}</h3>
                    <p>{reservation.dates}</p>
                    <p>{reservation.guests}</p>
                  </div>

                  <div className="booking-summary">
                    <span className={statusInfo.cls}>{statusInfo.label}</span>
                    <strong>{safeTotal(reservation.total)}</strong>
                    <div className="booking-summary-actions">
                      <button
                        type="button"
                        onClick={() => toggleReservation(reservation.id)}
                      >
                        {expandedReservation === reservation.id ? "Ocultar" : "Ver reserva"}
                      </button>
                      <button
                        className="booking-delete-button"
                        type="button"
                        disabled={deletingId === reservation.id}
                        onClick={() => deleteReservation(reservation)}
                      >
                        {deletingId === reservation.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>

                  {expandedReservation === reservation.id && (
                    <div className="booking-guest-detail">
                      <h4>
                        {reservation.type === "area-comun"
                          ? "Información de la reserva"
                          : "Información del huésped"}
                      </h4>
                      <div>
                        <span>Nombre</span>
                        <strong>{reservation.guest.name}</strong>
                      </div>
                      <div>
                        <span>Correo</span>
                        <strong>{reservation.guest.email}</strong>
                      </div>
                      <div>
                        <span>Teléfono</span>
                        <strong>{reservation.guest.phone}</strong>
                      </div>
                      <div className="wide">
                        <span>Peticiones especiales</span>
                        <strong>{reservation.guest.requests}</strong>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MisReservas;
