import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Header } from "./Home.jsx";
import {
  getAreaReservations,
  getReservationStart,
  reservationStatusLabels,
  saveAreaReservations,
} from "../services/commonAreasStorage.js";
import { listarMisReservas } from "../services/reservasService.js";

const fallbackRoomImage =
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900";

function getClientSession() {
  try {
    const clientSession = localStorage.getItem("luxestay.clientSession");
    return clientSession ? JSON.parse(clientSession) : null;
  } catch {
    return null;
  }
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2)}`;
}

function formatBackendReservation(reservation) {
  return {
    id: `habitacion-${reservation.id}`,
    rawId: reservation.id,
    type: "habitacion",
    title: `Habitacion ${reservation.habitacionNumero}`,
    image: fallbackRoomImage,
    stage: reservation.estado,
    originalStatus: reservation.estado,
    status: reservation.estado,
    dates: `${reservation.fechaEntrada} - ${reservation.fechaSalida}`,
    checkIn: reservation.fechaEntrada,
    checkOut: reservation.fechaSalida,
    room: `Habitacion ${reservation.habitacionNumero}`,
    guests: `${reservation.cantidadHuespedes} huesped${
      reservation.cantidadHuespedes === 1 ? "" : "es"
    }`,
    total: formatCurrency(reservation.precioTotal),
    sortDate: new Date(reservation.fechaEntrada || reservation.createdAt || Date.now()).getTime(),
    guest: {
      name: reservation.usuarioNombre || "Cliente",
      email: reservation.usuarioEmail || "Sin correo",
      phone: "No registrado",
      requests: "Sin peticiones especiales registradas.",
    },
  };
}

function MisReservas() {
  const location = useLocation();
  const [expandedReservation, setExpandedReservation] = useState(null);
  const session = getClientSession();
  const hasValidToken = Boolean(session?.token);
  const [areaReservations, setAreaReservations] = useState(() => getAreaReservations());
  const [roomReservations, setRoomReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [reservationsError, setReservationsError] = useState("");

  useEffect(() => {
    if (!hasValidToken) {
      return;
    }

    let isMounted = true;

    async function loadReservations() {
      setLoadingReservations(true);
      setReservationsError("");

      try {
        const response = await listarMisReservas();
        const content = Array.isArray(response.data?.content) ? response.data.content : [];

        if (isMounted) {
          setRoomReservations(content.map(formatBackendReservation));
        }
      } catch (error) {
        if (isMounted) {
          setReservationsError(
            error.response?.data?.message ||
              "No se pudieron cargar tus reservas. Intenta nuevamente.",
          );
          setRoomReservations([]);
        }
      } finally {
        if (isMounted) {
          setLoadingReservations(false);
        }
      }
    }

    loadReservations();

    return () => {
      isMounted = false;
    };
  }, [hasValidToken]);

  const reservations = useMemo(() => {
    const currentAreaReservations = areaReservations
      .filter((reservation) => reservation.username === session?.username)
      .map((reservation) => ({
        ...reservation,
        stage: reservationStatusLabels[reservation.status],
        originalStatus: reservation.status,
        status: reservationStatusLabels[reservation.status],
        sortDate: getReservationStart(reservation),
      }));

    return [...roomReservations, ...currentAreaReservations].sort(
      (first, second) => second.sortDate - first.sortDate,
    );
  }, [areaReservations, roomReservations, session]);

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

  const toggleReservation = (title) => {
    setExpandedReservation((current) => (current === title ? null : title));
  };

  const cancelAreaReservation = (reservationId) => {
    const nextReservations = areaReservations.map((reservation) =>
      reservation.id === reservationId
        ? { ...reservation, status: "cancelada", stage: "Reserva cancelada" }
        : reservation,
    );
    setAreaReservations(nextReservations);
    saveAreaReservations(nextReservations);
  };

  return (
    <div className="home-page bookings-page">
      <Header />

      <main className="bookings-main">
        <section className="bookings-heading">
          <p className="section-kicker">Mis reservas</p>
          <h1>Gestiona tus estadias</h1>
          <p>
            Revisa tus proximas reservas, confirma los datos de tu habitacion y
            mantente al tanto del estado de cada estadia.
          </p>
        </section>

        <section className="bookings-panel">
          <div className="bookings-toolbar">
            <div>
              <h2>Reservas registradas</h2>
              <p>{reservations.length} reservas vinculadas a tu cuenta.</p>
            </div>
            <Link className="book-link" to="/habitaciones">
              Nueva reserva
            </Link>
          </div>

          <div className="booking-list">
            {loadingReservations && (
              <div className="booking-empty-state">
                <h3>Cargando reservas...</h3>
                <p>Estamos consultando tus reservas registradas.</p>
              </div>
            )}

            {reservationsError && (
              <div className="booking-empty-state">
                <h3>No se pudieron cargar tus reservas</h3>
                <p>{reservationsError}</p>
              </div>
            )}

            {!loadingReservations && !reservationsError && reservations.length === 0 && (
              <div className="booking-empty-state">
                <h3>Aun no tienes reservas guardadas</h3>
                <p>Elige una habitacion o area comun y completa una reserva para verla aqui.</p>
                <Link className="book-link" to="/areas-comunes">
                  Ver areas comunes
                </Link>
              </div>
            )}

            {!loadingReservations && !reservationsError && reservations.map((reservation) => (
              <article className="booking-card" key={reservation.id}>
                <img src={reservation.image} alt={reservation.title} />

                <div className="booking-info">
                  <span>{reservation.stage}</span>
                  <h3>{reservation.title}</h3>
                  <p>{reservation.dates}</p>
                  <p>{reservation.guests}</p>
                </div>

                <div className="booking-summary">
                  <span>{reservation.status}</span>
                  <strong>{reservation.total}</strong>
                  <button
                    type="button"
                    onClick={() => toggleReservation(reservation.id)}
                  >
                    {expandedReservation === reservation.id ? "Ocultar" : "Ver reserva"}
                  </button>
                  {reservation.type === "area-comun" &&
                    ["pendiente", "confirmada"].includes(reservation.originalStatus) && (
                      <button
                        className="booking-cancel-button"
                        type="button"
                        onClick={() => cancelAreaReservation(reservation.id)}
                      >
                        Cancelar
                      </button>
                    )}
                </div>

                {expandedReservation === reservation.id && (
                  <div className="booking-guest-detail">
                    <h4>
                      {reservation.type === "area-comun"
                        ? "Informacion de la reserva"
                        : "Informacion del huesped"}
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
                      <span>Telefono</span>
                      <strong>{reservation.guest.phone}</strong>
                    </div>
                    <div className="wide">
                      <span>Peticiones especiales</span>
                      <strong>{reservation.guest.requests}</strong>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MisReservas;
