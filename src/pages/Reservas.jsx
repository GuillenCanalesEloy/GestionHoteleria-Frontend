import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Header } from "./Home.jsx";
import { crearReserva } from "../services/reservasService.js";

function getClientSession() {
  try {
    const storedSession = localStorage.getItem("luxestay.clientSession");
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    return null;
  }
}

function getSessionUserId(session) {
  return session?.usuarioId || session?.userId || session?.id || session?.usuario?.id || null;
}

function getGuestCount(people) {
  const numbers = people.match(/\d+/g)?.map(Number) || [];
  if (numbers.length === 0) {
    return 1;
  }

  return numbers.reduce((total, number) => total + number, 0);
}

function Reservas() {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [people, setPeople] = useState("2 Adultos");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePhoneChange = (event) => {
    setGuestPhone(event.target.value.replace(/\D/g, "").slice(0, 15));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!room?.id) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona una habitacion",
        text: "Debes elegir una habitacion antes de crear la reserva.",
        confirmButtonColor: "#041627",
      });
      return;
    }

    if (!checkOut || checkOut <= checkIn) {
      Swal.fire({
        icon: "warning",
        title: "Fechas invalidas",
        text: "La fecha de salida debe ser posterior a la fecha de entrada.",
        confirmButtonColor: "#041627",
      });
      return;
    }

    const session = getClientSession();
    const usuarioId = getSessionUserId(session);

    if (!session?.token || !usuarioId) {
      navigate("/login", {
        state: {
          backgroundLocation: location,
          returnTo: "/reservar",
          returnState: { room },
        },
      });
      return;
    }

    setSubmitting(true);

    try {
      const reservation = {
        checkIn,
        checkOut,
        guestName,
        guestEmail,
        guestPhone,
        people,
        specialRequests,
      };
      const payload = {
        usuarioId,
        habitacionId: room.id,
        fechaEntrada: checkIn,
        fechaSalida: checkOut,
        cantidadHuespedes: getGuestCount(people),
      };

      const response = await crearReserva(payload);

      navigate("/pago", {
        state: {
          room,
          reservation,
          reservaBackend: response.data,
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se pudo crear la reserva",
        text:
          error.response?.data?.message ||
          "Revisa la disponibilidad y vuelve a intentarlo.",
        confirmButtonColor: "#041627",
      });
    } finally {
      setSubmitting(false);
    }
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
            <section className="reserva-form-section">
              <h2>Fechas de estancia</h2>
              <div className="reserva-fields-grid">
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
              </div>
            </section>

            <section className="reserva-form-section">
              <h2>Informacion del huesped</h2>
              <div className="reserva-fields-grid">
                <div className="reserva-field">
                  <label htmlFor="guest-name">Nombre completo</label>
                  <input
                    id="guest-name"
                    placeholder="Ej. Juan Perez"
                    type="text"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    required
                  />
                </div>

                <div className="reserva-field">
                  <label htmlFor="guest-email">Correo electronico</label>
                  <input
                    id="guest-email"
                    placeholder="juan@ejemplo.com"
                    type="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="reserva-field">
                  <label htmlFor="guest-phone">Telefono de contacto</label>
                  <input
                    id="guest-phone"
                    inputMode="numeric"
                    placeholder="999000000"
                    type="tel"
                    value={guestPhone}
                    onChange={handlePhoneChange}
                    required
                  />
                </div>

                <div className="reserva-field">
                  <label htmlFor="people">Numero de huespedes</label>
                  <select
                    id="people"
                    value={people}
                    onChange={(event) => setPeople(event.target.value)}
                    required
                  >
                    <option>1 Adulto</option>
                    <option>2 Adultos</option>
                    <option>2 Adultos, 1 Nino</option>
                    <option>Familia 4 Personas</option>
                    <option>Grupo 6 Personas</option>
                  </select>
                </div>

                <div className="reserva-field wide">
                  <label htmlFor="special-requests">Peticiones especiales (opcional)</label>
                  <textarea
                    id="special-requests"
                    placeholder="Indicanos si tienes alguna necesidad especifica..."
                    rows="4"
                    value={specialRequests}
                    onChange={(event) => setSpecialRequests(event.target.value)}
                  />
                </div>
              </div>
            </section>

            <button className="reserva-confirm-button" type="submit" disabled={submitting}>
              {submitting ? "Creando reserva..." : "Confirmar reserva"}
            </button>
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
