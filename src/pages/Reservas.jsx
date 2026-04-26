import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "./Home.jsx";

function Reservas() {
  const location = useLocation();
  const room = location.state?.room;
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [people, setPeople] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setConfirmed(true);
  };

  return (
    <div className="home-page reserva-page">
      <Header />

      <main className="reserva-main">
        <section className="reserva-heading">
          <p className="section-kicker">Reserva</p>
          <h1>Completa tu reserva</h1>
          <p>
            Selecciona tus fechas, indica el numero de personas y confirma tu
            solicitud.
          </p>
        </section>

        <section className="reserva-layout">
          <form className="reserva-form" onSubmit={handleSubmit}>
            <div className="reserva-field">
              <label htmlFor="check-in">Fecha de entrada</label>
              <input
                id="check-in"
                min={today}
                type="date"
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
                required
              />
            </div>

            <div className="reserva-field">
              <label htmlFor="check-out">Fecha de salida</label>
              <input
                id="check-out"
                min={checkIn || today}
                type="date"
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
                required
              />
            </div>

            <div className="reserva-field">
              <label htmlFor="people">Numero de personas</label>
              <input
                id="people"
                min="1"
                max="8"
                type="number"
                value={people}
                onChange={(event) => setPeople(event.target.value)}
                required
              />
            </div>

            <button className="reserva-confirm-button" type="submit">
              Confirmar reserva
            </button>

            {confirmed && (
              <p className="reserva-confirmation">
                Reserva preparada para {people} persona(s). Revisa tus datos
                antes del pago final.
              </p>
            )}
          </form>

          <aside className="reserva-summary">
            {room ? (
              <>
                <img src={room.image} alt={room.title} />
                <div>
                  <span>{room.tag}</span>
                  <h2>{room.title}</h2>
                  <p>{room.description}</p>
                  <strong>${room.price}</strong>
                  <small>por noche</small>
                </div>
              </>
            ) : (
              <div className="reserva-empty-room">
                <span>Habitacion</span>
                <h2>Selecciona una habitacion</h2>
                <p>
                  Puedes volver al catalogo y elegir una habitacion para ver su
                  detalle antes de reservar.
                </p>
                <Link className="book-link" to="/habitaciones">
                  Ver habitaciones
                </Link>
              </div>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Reservas;
