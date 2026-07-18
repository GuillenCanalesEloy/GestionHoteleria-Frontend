import { useLocation, useNavigate } from "react-router-dom";

function DetallesDeHabitacion({ room, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!room) {
    return null;
  }

  const handleReserve = () => {
    const clientSession = localStorage.getItem("luxestay.clientSession");

    const mappedRoom = {
      ...room,
      image: room.imagenUrl || room.image,
      price: room.precioPorNoche ?? room.price,
      title: room.nombre || `Habitación ${room.tipo} #${room.numero}`,
      tag: room.tipo,
      description: room.descripcion || room.description,
    };

    if (clientSession) {
      onClose();
      navigate("/reservar", { state: { room: mappedRoom } });
      return;
    }

    onClose();
    navigate("/login", {
      state: {
        backgroundLocation: location,
        returnTo: "/reservar",
        returnState: { room: mappedRoom },
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
          aria-label="Cerrar detalle de habitación"
        >
          x
        </button>

        <div className="room-detail-image">
          <img
            src={room.imagenUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900"}
            alt={`Habitación ${room.tipo} ${room.numero}`}
          />
          <span>{room.tipo}</span>
        </div>

        <div className="room-detail-content">
          <p className="section-kicker">Detalle de habitación</p>
          <h2 id="room-detail-title">Habitación {room.tipo} #{room.numero}</h2>
          <p>{room.descripcion}</p>

          <div className="room-detail-features">
            <span>👤 {room.capacidad} persona{room.capacidad === 1 ? "" : "s"}</span>
            <span>📏 Piso {room.piso}</span>
            <span>🏷️ {room.tipo}</span>
          </div>

          <div className="room-detail-price">
            <div>
              <small>Precio por noche</small>
              <strong>${room.precioPorNoche}</strong>
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
