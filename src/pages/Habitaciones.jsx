import { Header } from "./Home.jsx";
import { useEffect, useState } from "react";
import DetallesDeHabitacion from "./DetallesDeHabitacion.jsx";
import { getStoredRooms, ROOMS_STORAGE_KEY } from "../services/roomsStorage.js";

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
    description:
      "Suite amplia con dormitorio principal, cama king, sala privada con sillones, comedor pequeno, bano completo con tina, televisor smart, internet de alta velocidad y vista panoramica.",
    features: ["1 cama king", "Sala con sillones", "Bano con tina", "Smart TV", "Internet"],
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
    description:
      "Habitacion elegante para dos personas con cama queen, escritorio de trabajo, silla ergonomica, bano privado, televisor, minibar e internet incluido.",
    features: ["1 cama queen", "Escritorio", "Bano privado", "Televisor", "Minibar"],
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
    description:
      "Habitacion ejecutiva con cama queen, zona de trabajo, sillon de lectura, bano moderno, televisor smart, internet rapido y vista a la ciudad.",
    features: ["1 cama queen", "Zona de trabajo", "Sillon", "Bano moderno", "Internet"],
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
    description:
      "Suite con vista al jardin, cama king, sofa cama, mesa auxiliar, bano completo, televisor smart, internet y amenidades premium para una estadia tranquila.",
    features: ["1 cama king", "Sofa cama", "Vista al jardin", "Bano completo", "Smart TV"],
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
    description:
      "Habitacion deluxe con vista al mar, cama king, sillas lounge, balcon privado, bano con ducha amplia, televisor, aire acondicionado e internet.",
    features: ["1 cama king", "Balcon", "Sillas lounge", "Bano privado", "Internet"],
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
    description:
      "Habitacion business con cama queen, escritorio ejecutivo, silla ergonomica, bano privado, televisor smart, caja fuerte e internet de alta velocidad.",
    features: ["1 cama queen", "Escritorio ejecutivo", "Caja fuerte", "Bano privado", "Smart TV"],
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
    description:
      "Habitacion familiar con dos camas queen, sofa, mesa de apoyo, bano completo, televisor, internet y espacio comodo para cuatro huespedes.",
    features: ["2 camas queen", "Sofa", "Bano completo", "Televisor", "Internet"],
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
    description:
      "Suite de lujo en piso alto con cama king, sala independiente, sillones, bano con tina, televisor smart, internet premium y vista skyline.",
    features: ["1 cama king", "Sala independiente", "Tina", "Vista skyline", "Internet premium"],
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
    description:
      "Studio ejecutivo compacto con cama full, escritorio, silla de trabajo, bano privado, televisor, cafetera e internet estable para viajes laborales.",
    features: ["1 cama full", "Escritorio", "Cafetera", "Bano privado", "Internet"],
  },
];

function Habitaciones() {
  // 2. Estados para los filtros
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [catalogRooms, setCatalogRooms] = useState(() => getStoredRooms());

  useEffect(() => {
    const refreshRooms = () => setCatalogRooms(getStoredRooms());
    const handleStorageChange = (event) => {
      if (event.key === ROOMS_STORAGE_KEY) {
        refreshRooms();
      }
    };

    window.addEventListener("focus", refreshRooms);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("focus", refreshRooms);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 3. Lógica de filtrado (se ejecuta en cada render)
  const availableRooms = catalogRooms.filter((room) => room.status === "disponible");

  const filteredRooms = availableRooms.filter((room) => {
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
