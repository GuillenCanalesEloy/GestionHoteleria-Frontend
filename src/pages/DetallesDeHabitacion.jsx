import { Link } from "react-router-dom";

function DetallesDeHabitacion({ room, onClose }) {
  if (!room) {
    return null;
  }

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
            <Link className="book-link" to="/reservar" state={{ room }}>
              Reservar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DetallesDeHabitacion;
