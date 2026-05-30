import { useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Header } from "./Home.jsx";
import { getClientReservations } from "../services/clientReservationsStorage.js";
import {
  getAreaReservations,
  getReservationStart,
  reservationStatusLabels,
  saveAreaReservations,
} from "../services/commonAreasStorage.js";

function MisReservas() {
  const location = useLocation();
  const [expandedReservation, setExpandedReservation] = useState(null);
  const clientSession = localStorage.getItem("luxestay.clientSession");
  const session = clientSession ? JSON.parse(clientSession) : null;
  const hasValidToken = Boolean(session?.token);
  const [areaReservations, setAreaReservations] = useState(() => getAreaReservations());
  const reservations = useMemo(() => {
    const roomReservations = getClientReservations()
      .filter((reservation) => !session || reservation.guest?.name === session.username)
      .map((reservation) => ({
        ...reservation,
        originalStatus: reservation.status,
        sortDate: new Date(reservation.checkIn || reservation.createdAt || Date.now()).getTime(),
      }));

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
  }, [areaReservations, session]);

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
            {reservations.length === 0 && (
              <div className="booking-empty-state">
                <h3>Aun no tienes reservas guardadas</h3>
                <p>Elige una habitacion o area comun y completa una reserva para verla aqui.</p>
                <Link className="book-link" to="/areas-comunes">
                  Ver areas comunes
                </Link>
              </div>
            )}

            {reservations.map((reservation) => (
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
