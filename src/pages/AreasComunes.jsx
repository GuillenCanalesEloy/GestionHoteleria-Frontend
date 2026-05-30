import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Home.jsx";
import {
  areaStatusLabels,
  getCommonAreas,
  hasScheduleOverlap,
  saveAreaReservation,
} from "../services/commonAreasStorage.js";

const todayIso = () => new Date().toISOString().slice(0, 10);

function getHoursBetween(startTime, endTime) {
  if (!startTime || !endTime) {
    return 0;
  }

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const start = startHours * 60 + startMinutes;
  const end = endHours * 60 + endMinutes;
  return Math.max((end - start) / 60, 0);
}

function AreasComunes() {
  const location = useLocation();
  const navigate = useNavigate();
  const minDate = useMemo(todayIso, []);
  const [commonAreas] = useState(() => getCommonAreas());
  const [selectedArea, setSelectedArea] = useState(() =>
    getCommonAreas().find((area) => area.status === "disponible") || getCommonAreas()[0],
  );
  const [statusFilter, setStatusFilter] = useState("disponible");
  const [date, setDate] = useState(minDate);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [people, setPeople] = useState("2 personas");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const clientSession = localStorage.getItem("luxestay.clientSession");
  const session = clientSession ? JSON.parse(clientSession) : null;
  const hasValidToken = Boolean(session?.token);
  const visibleAreas = commonAreas.filter(
    (area) => statusFilter === "todos" || area.status === statusFilter,
  );
  const reservedHours = getHoursBetween(startTime, endTime);
  const total = selectedArea ? reservedHours * selectedArea.pricePerHour : 0;
  const isSameDay = date === minDate;
  const nowPlusThirty = new Date(Date.now() + 30 * 60 * 1000);
  const selectedStart = new Date(`${date}T${startTime}`);

  const handleSelectArea = (area) => {
    setSelectedArea(area);
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!hasValidToken) {
      navigate("/login", {
        state: {
          backgroundLocation: location,
          closeTo: "/areas-comunes",
          returnTo: "/areas-comunes",
        },
      });
      return;
    }

    if (!selectedArea || selectedArea.status !== "disponible") {
      setMessage("Selecciona un area disponible para reservar.");
      return;
    }

    if (reservedHours <= 0) {
      setMessage("La hora final debe ser mayor a la hora de inicio.");
      return;
    }

    if (reservedHours > 3) {
      setMessage("La duracion maxima permitida es de 3 horas.");
      return;
    }

    if (isSameDay && selectedStart.getTime() < nowPlusThirty.getTime()) {
      setMessage("Reserva con al menos 30 minutos de anticipacion.");
      return;
    }

    if (
      hasScheduleOverlap({
        areaId: selectedArea.id,
        date,
        startTime,
        endTime,
      })
    ) {
      setMessage("Horario no disponible");
      return;
    }

    saveAreaReservation({
      id: `AREA-${Date.now().toString().slice(-6)}`,
      type: "area-comun",
      areaId: selectedArea.id,
      username: session.username || "user",
      title: selectedArea.name,
      image: selectedArea.image,
      stage: "Reserva de area comun",
      date,
      startTime,
      endTime,
      dates: `${date} / ${startTime} - ${endTime}`,
      guests: people,
      status: "pendiente",
      total: `$${total.toFixed(2)}`,
      room: selectedArea.name,
      duration: reservedHours,
      pricePerHour: selectedArea.pricePerHour,
      guest: {
        name: session.username || "user",
        email: "user@demo.com",
        phone: "Por confirmar",
        requests: notes || "Sin peticiones especiales.",
      },
      createdAt: new Date().toISOString(),
    });

    setMessage(`Reserva registrada: ${reservedHours} horas, ${date} de ${startTime} a ${endTime}, total $${total.toFixed(2)}.`);
    setNotes("");
  };

  return (
    <div className="home-page areas-page">
      <Header />

      <main>
        <section className="areas-hero">
          <div className="areas-hero-content">
            <p className="hero-kicker">Experiencia exclusiva</p>
            <h1>Areas Comunes</h1>
            <p>
              Reserva espacios del hotel para relajarte, entrenar, reunirte o
              disfrutar servicios premium durante tu estadia.
            </p>
            <div className="hero-actions">
              <a className="hero-primary" href="#areas-catalogo">
                Ver espacios
              </a>
              <Link className="hero-secondary" to="/mis-reservas">
                Mis reservas
              </Link>
            </div>
          </div>
        </section>

        <section className="areas-main" id="areas-catalogo">
          <div className="section-heading split-heading">
            <div>
              <p className="section-kicker">Instalaciones</p>
              <h2>Nuestros espacios</h2>
              <p>
                Cada area muestra estado, capacidad y precio por hora. Por este
                avance, los datos se manejan dentro del frontend.
              </p>
            </div>
            <div className="areas-filter">
              {[
                ["disponible", "Disponible"],
                ["todos", "Todos"],
              ].map(([status, label]) => (
                <button
                  className={statusFilter === status ? "active" : ""}
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="areas-layout">
            <section className="areas-grid" aria-label="Listado de areas comunes">
              {visibleAreas.map((area) => (
                <article
                  className={`area-card ${selectedArea?.id === area.id ? "selected" : ""}`}
                  key={area.id}
                >
                  <button type="button" onClick={() => handleSelectArea(area)}>
                    <div className="area-card-image">
                      <img src={area.image} alt={area.name} />
                      <span>{area.badge}</span>
                    </div>
                    <div className="area-card-content">
                      <div>
                        <h3>{area.name}</h3>
                        <p>{area.description}</p>
                      </div>
                      <div className="area-meta">
                        <span>{areaStatusLabels[area.status]}</span>
                        <span>{area.capacity} personas</span>
                        <span>${area.pricePerHour}/hora</span>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </section>

            <aside className="area-booking-panel">
              <div className="area-booking-summary">
                <span>{selectedArea ? areaStatusLabels[selectedArea.status] : ""}</span>
                <h2>{selectedArea?.name}</h2>
                <p>{selectedArea?.description}</p>
                <div className="area-summary-grid">
                  <div>
                    <small>Horario</small>
                    <strong>{selectedArea?.schedule}</strong>
                  </div>
                  <div>
                    <small>Capacidad</small>
                    <strong>{selectedArea?.capacity} personas</strong>
                  </div>
                </div>
              </div>

              <form className="area-reservation-form" onSubmit={handleSubmit}>
                <div className="reserva-field">
                  <label htmlFor="area-date">Fecha</label>
                  <input
                    id="area-date"
                    min={minDate}
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </div>

                <div className="area-time-grid">
                  <div className="reserva-field">
                    <label htmlFor="area-start">Hora inicio</label>
                    <input
                      id="area-start"
                      min={isSameDay ? `${String(nowPlusThirty.getHours()).padStart(2, "0")}:${String(nowPlusThirty.getMinutes()).padStart(2, "0")}` : undefined}
                      type="time"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      required
                    />
                  </div>
                  <div className="reserva-field">
                    <label htmlFor="area-end">Hora fin</label>
                    <input
                      id="area-end"
                      type="time"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="reserva-field">
                  <label htmlFor="area-people">Asistentes</label>
                  <select
                    id="area-people"
                    value={people}
                    onChange={(event) => setPeople(event.target.value)}
                  >
                    <option>1 persona</option>
                    <option>2 personas</option>
                    <option>4 personas</option>
                    <option>8 personas</option>
                    <option>Grupo 12 personas</option>
                  </select>
                </div>

                <div className="reserva-field">
                  <label htmlFor="area-notes">Peticiones especiales</label>
                  <textarea
                    id="area-notes"
                    rows="3"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Indica necesidades de montaje, bebidas o soporte."
                  />
                </div>

                <div className="area-total">
                  <span>{reservedHours || 0} horas</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>

                {message && <p className="area-form-message">{message}</p>}

                {hasValidToken ? (
                  <button
                    className="reserva-confirm-button"
                    type="submit"
                    disabled={selectedArea?.status !== "disponible"}
                  >
                    Reservar area
                  </button>
                ) : (
                  <Link
                    className="reserva-confirm-button area-login-link"
                    to="/login"
                    state={{
                      backgroundLocation: location,
                      closeTo: "/areas-comunes",
                      returnTo: "/areas-comunes",
                    }}
                  >
                    Iniciar sesion para reservar
                  </Link>
                )}
              </form>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AreasComunes;
