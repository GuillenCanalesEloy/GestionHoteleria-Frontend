import { Link } from "react-router-dom";
import { Header } from "./Home.jsx";
import { useState } from "react";

// 1. Datos de las habitaciones con precios como números
const rooms = [
  {
    title: "Presidential Suite",
    tag: "Suite",
    price: 450,
    rating: "4.9",
    guests: "4 Adults",
    size: "85 m2",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Deluxe Classic Room",
    tag: "Deluxe",
    price: 280,
    rating: "4.8",
    guests: "2 Adults",
    size: "42 m2",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Executive City View",
    tag: "Business",
    price: 320,
    rating: "4.7",
    guests: "2 Adults",
    size: "50 m2",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Royal Garden Suite",
    tag: "Suite",
    price: 520,
    rating: "4.9",
    guests: "3 Adults",
    size: "78 m2",
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Deluxe Ocean View",
    tag: "Deluxe",
    price: 360,
    rating: "4.8",
    guests: "2 Adults",
    size: "46 m2",
    image:
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Business Premier Room",
    tag: "Business",
    price: 295,
    rating: "4.6",
    guests: "2 Adults",
    size: "44 m2",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Family Deluxe Room",
    tag: "Deluxe",
    price: 390,
    rating: "4.7",
    guests: "4 Adults",
    size: "58 m2",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Skyline Luxury Suite",
    tag: "Suite",
    price: 680,
    rating: "5.0",
    guests: "4 Adults",
    size: "96 m2",
    image:
      "https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&q=80&w=900",
  },
  {
    title: "Executive Work Studio",
    tag: "Business",
    price: 240,
    rating: "4.5",
    guests: "1 Adult",
    size: "36 m2",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=900",
  },
];

function Habitaciones() {
  // 2. Estados para los filtros
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // 3. Lógica de filtrado (se ejecuta en cada render)
  const filteredRooms = rooms.filter((room) => {
    const matchesPrice = room.price <= maxPrice;
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(room.tag);
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
                  {["Suite", "Deluxe", "Business"].map((type) => (
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
                  Mostrando {filteredRooms.length} estadias para tus fechas.
                </p>
              </div>
            </div>

            <div className="catalog-grid">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <article className="catalog-card" key={room.title}>
                    <div className="catalog-image">
                      <img src={room.image} alt={room.title} />
                      <span className="room-tag">{room.tag}</span>
                    </div>

                    <div className="catalog-content">
                      <div className="catalog-title-row">
                        <h3>{room.title}</h3>
                        <span className="rating">⭐ {room.rating}</span>
                      </div>
                      <div className="room-meta">
                        <span>👤 {room.guests}</span>
                        <span>📏 {room.size}</span>
                      </div>
                      <div className="catalog-footer">
                        <div>
                          <small>Por noche</small>
                          <strong>${room.price}</strong>
                        </div>
                        <Link to="/reservar" className="btn-detail">
                          Ver Detalle
                        </Link>
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
    </div>
  );
}

export default Habitaciones;
