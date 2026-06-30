import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Home.jsx";
import { reservasApi } from "../services/hotelApi";
import { getCurrentUser } from "../services/authService.js";

function Reservas() {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;
  const currentUser = useMemo(getCurrentUser, []);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [people, setPeople] = useState("2 Adultos");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!currentUser) {
      // Redirect to login if no user is found, passing the current page as return url
      navigate("/login", { state: { from: location } });
    }
  }, [currentUser, navigate, location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!room?.id) {
      setErrorMessage("Selecciona una habitacion antes de reservar.");
      return;
    }

    if (!currentUser?.id) {
      setErrorMessage("Debes iniciar sesión para poder reservar.");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMessage("La fecha de salida debe ser posterior a la entrada.");
      return;
    }

    try {
      setLoading(true);

      const reservaData = {
        usuarioId: currentUser.id,
        habitacionId: room.id,
        fechaEntrada: checkIn,
        fechaSalida: checkOut,
        cantidadHuespedes: Number(people.match(/\d+/)?.[0] || 1),
      };

      await reservasApi.create(reservaData);

      navigate("/pago", {
        state: {
          room,
          reservation: {
            checkIn,
            checkOut,
            guestName: currentUser.nombre,
            guestEmail: currentUser.email,
            people,
            specialRequests,
          },
        },
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "No se pudo registrar la reserva.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="home-page reserva-page">
        <Header />
        <main className="reserva-main">
          <p>Redirigiendo al login...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page reserva-page">
      <Header />

      <main className="reserva-main">
        <section className="reserva-heading">
          <p className="section-kicker">Reserva</p>
          <h1>Completa tu reserva</h1>
          <p>
            Selecciona tus fechas, indica el número de personas y confirma tu
            solicitud.
          </p>
        </section>

        {errorMessage && <p className="form-error-message">{errorMessage}</p>}

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
              <h2>Información del huésped</h2>
              <div className="reserva-fields-grid">
                <div className="reserva-field">
                  <label>Nombre completo</label>
                  <p>{currentUser.nombre}</p>
                </div>

                <div className="reserva-field">
                  <label>Correo electrónico</label>
                  <p>{currentUser.email}</p>
                </div>

                <div className="reserva-field">
                  <label htmlFor="people">Número de huéspedes</label>
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
                  <label htmlFor="special-requests">
                    Peticiones especiales (opcional)
                  </label>
                  <textarea
                    id="special-requests"
                    placeholder="Indícanos si tienes alguna necesidad específica..."
                    rows="4"
                    value={specialRequests}
                    onChange={(event) => setSpecialRequests(event.target.value)}
                  />
                </div>
              </div>
            </section>

            <button
              className="reserva-confirm-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Confirmar reserva"}
            </button>
          </form>

          <aside className="reserva-summary">
            {room ? (
              <>
                <img
                  src={room.image || room.imagenUrl}
                  alt={room.title}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900";
                  }}
                />
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
                <span>Habitación</span>
                <h2>Selecciona una habitación</h2>
                <p>
                  Puedes volver al catálogo y elegir una habitación para ver su
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