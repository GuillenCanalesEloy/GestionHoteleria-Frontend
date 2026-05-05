import { useLocation, useNavigate } from "react-router-dom";

function DetallesDeHabitacion({ room, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!room) {
    return null;
  }

  const handleReserve = () => {
    const clientSession = localStorage.getItem("luxestay.clientSession");

    if (clientSession) {
      onClose();
      navigate("/reservar", { state: { room } });
      return;
    }

    onClose();
    navigate("/login", {
      state: {
        backgroundLocation: location,
        returnTo: "/reservar",
        returnState: { room },
      },
    });
  };

  return (
    <div className="room-detail-backdrop" role="presentation">
      <section
        className="room-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-detail-title"
      >
        <button
          className="room-detail-close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle de habitacion"
        >
          x
        </button>

        <div className="room-detail-image">
          <img src={room.image} alt={room.title} />
          <span>{room.tag}</span>
        </div>

        <div className="room-detail-content">
          <p className="section-kicker">Detalle de habitacion</p>
          <h2 id="room-detail-title">{room.title}</h2>
          <p>{room.description}</p>

          <div className="room-detail-features">
            {room.features.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>

          <div className="room-detail-price">
            <div>
              <small>Precio por noche</small>
              <strong>${room.price}</strong>
            </div>
            <button className="book-link" type="button" onClick={handleReserve}>
              Reservar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DetallesDeHabitacion;
