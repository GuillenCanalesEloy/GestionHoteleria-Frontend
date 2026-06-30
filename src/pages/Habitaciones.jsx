import { Header } from "./Home.jsx";
import { useEffect, useState } from "react";
import DetallesDeHabitacion from "./DetallesDeHabitacion.jsx";
import { habitacionesApi } from "../services/hotelApi.js";

function Habitaciones() {
  // 2. Estados para los filtros
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [catalogRooms, setCatalogRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await habitacionesApi.getAll({ page: 0, size: 100 });
        setCatalogRooms(response.data.content || []);
      } catch (error) {
        console.error("No se pudieron cargar las habitaciones", error);
        setCatalogRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // 3. Lógica de filtrado (se ejecuta en cada render)
  const availableRooms = catalogRooms.filter((room) => room.estado === "DISPONIBLE");

  const filteredRooms = availableRooms.filter((room) => {
    const matchesPrice = room.precioPorNoche <= maxPrice;
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(room.tipo);
    return matchesPrice && matchesType;
  });

  // 4. Función para manejar los checkboxes
  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };
  const handleReset = () => {
    setMaxPrice(1000);    // Volver al precio máximo
    setSelectedTypes([]); // Desmarcar todos los checkboxes
  };

  return (
    <div className="home-page habitaciones-page">
      <Header />

      <main className="habitaciones-main">
        <section className="habitaciones-heading">
          <p className="section-kicker">Nuestra Selección</p>
          <h1>Explora Habitaciones</h1>
          <p>
            Encuentra suites y habitaciones pensadas para descansar, trabajar y
            disfrutar cada detalle.
          </p>
        </section>

        <section className="habitaciones-layout">
          {/* PANEL DE FILTROS */}
          <aside className="filters-panel" aria-label="Filtros de habitaciones">
            <div className="filter-card">
              <h2>Filtros</h2>

              <div className="filter-group">
                <span>
                  Rango de precio: <strong>${maxPrice}</strong>
                </span>
                <input
                  max="1000"
                  min="100"
                  step="10"
                  type="range"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="range-labels">
                  <small>$100</small>
                  <small>$1000+</small>
                </div>
              </div>

              <div className="filter-group">
                <span>Tipo de habitación</span>
                <div className="check-list">
                  {["INDIVIDUAL", "DOBLE", "SUITE"].map((type) => (
                    <label key={type}>
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="availability-row">
                <span>Reserva inmediata</span>
                <button
                  type="button"
                  className="toggle-btn"
                  aria-label="Reserva inmediata activada"
                />
              </div>

              <button className="filter-button" type="button" onClick={handleReset}>
                Limpiar Filtros
              </button>
            </div>

            <div className="discount-panel">
              <span>15% OFF</span>
              <h3>Descuento para miembros</h3>
              <p>
                Inicia sesión para acceder a beneficios exclusivos en suites
                seleccionadas.
              </p>
            </div>
          </aside>

          {/* CATÁLOGO DE RESULTADOS */}
          <div className="rooms-catalog">
            <div className="catalog-toolbar">
              <div>
                <h2>Habitaciones disponibles</h2>
                <p>
                  Mostrando {filteredRooms.length} estadías para tus fechas.
                </p>
              </div>
            </div>

            <div className="catalog-grid">
              {loading ? <p>Cargando habitaciones...</p> : filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <article className="catalog-card" key={room.id}>
                    <div className="catalog-image">
                      <img
                        src={room.imagenUrl || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900"}
                        alt={`Habitación ${room.tipo} ${room.numero}`}
                      />
                      <span className="room-tag">{room.tipo}</span>
                    </div>

                    <div className="catalog-content">
                      <div className="catalog-title-row">
                        <h3>{room.nombre || `Habitación ${room.tipo} #${room.numero}`}</h3>
                        <span className="rating">⭐ 4.8</span>
                      </div>
                      <div className="room-meta">
                        <span>👤 {room.capacidad} personas</span>
                        <span>📏 Piso {room.piso}</span>
                      </div>
                      <div className="catalog-footer">
                        <div>
                          <small>Por noche</small>
                          <strong>${room.precioPorNoche}</strong>
                        </div>
                        <button
                          type="button"
                          className="btn-detail"
                          onClick={() => setSelectedRoom(room)}
                        >
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div
                  className="no-results"
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "50px",
                  }}
                >
                  <p>
                    No se encontraron habitaciones con esos filtros. Intenta
                    ajustar el precio o el tipo.
                  </p>
                </div>
              )}
            </div>

            {/* Paginación (Opcional por ahora) */}
            <nav className="pagination-row">
              <button type="button" className="active">
                1
              </button>
              <button type="button">2</button>
            </nav>
          </div>
        </section>
      </main>

      <DetallesDeHabitacion
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}

export default Habitaciones;
