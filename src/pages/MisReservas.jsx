import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "./Home.jsx";

const reservations = [
  {
    title: "Presidential Suite",
    status: "Confirmada",
    stage: "Proxima estadia",
    dates: "12 Dic - 18 Dic, 2026",
    guests: "4 huespedes",
    total: "$4,250.00",
    guest: {
      name: "Juan Perez",
      email: "juan@ejemplo.com",
      phone: "999000000",
      requests: "Habitacion en piso alto y almohadas extra.",
    },
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Deluxe Ocean View",
    status: "Pendiente",
    stage: "En revision",
    dates: "04 Ene - 07 Ene, 2027",
    guests: "2 huespedes",
    total: "$1,080.00",
    guest: {
      name: "Maria Lopez",
      email: "maria@ejemplo.com",
      phone: "988777666",
      requests: "Check-in temprano si hay disponibilidad.",
    },
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=900",
  },
];

function MisReservas() {
  const [expandedReservation, setExpandedReservation] = useState(null);

  const toggleReservation = (title) => {
    setExpandedReservation((current) => (current === title ? null : title));
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
            {reservations.map((reservation) => (
              <article className="booking-card" key={reservation.title}>
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
                    onClick={() => toggleReservation(reservation.title)}
                  >
                    {expandedReservation === reservation.title ? "Ocultar" : "Ver reserva"}
                  </button>
                </div>

                {expandedReservation === reservation.title && (
                  <div className="booking-guest-detail">
                    <h4>Informacion del huesped</h4>
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
