import { Header } from "./Home.jsx";
import { useEffect, useMemo, useState } from "react";
import DetallesDeHabitacion from "./DetallesDeHabitacion.jsx";
import { habitacionesApi } from "../services/hotelApi.js";

function Habitaciones() {
  // 2. Estados para los filtros
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("precio-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [catalogRooms, setCatalogRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const roomsPerPage = 6;

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

  const sortedRooms = useMemo(() => {
    return [...filteredRooms].sort((firstRoom, secondRoom) => {
      const priceDifference = firstRoom.precioPorNoche - secondRoom.precioPorNoche;

      if (sortBy === "precio-desc") {
        return -priceDifference;
      }

      if (sortBy === "capacidad-desc") {
        return secondRoom.capacidad - firstRoom.capacidad;
      }

      return priceDifference;
    });
  }, [filteredRooms, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedRooms.length / roomsPerPage));
  const pageRooms = sortedRooms.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [maxPrice, selectedTypes, sortBy]);

  // 4. Función para manejar los checkboxes
  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };
  const handleReset = () => {
    setMaxPrice(1000);    // Volver al precio máximo
    setSelectedTypes([]); // Desmarcar todos los checkboxes
    setSortBy("precio-asc");
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
                  Mostrando {sortedRooms.length} estadías para tus fechas.
                </p>
              </div>
              <label className="catalog-sort-control">
                <span>Ordenar por</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="capacidad-desc">Mayor capacidad</option>
                </select>
              </label>
            </div>

            <div className="catalog-grid">
              {loading ? <p>Cargando habitaciones...</p> : pageRooms.length > 0 ? (
                pageRooms.map((room) => (
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
                        <span>👤 {room.capacidad} persona{room.capacidad === 1 ? "" : "s"}</span>
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

            <nav className="pagination-row" aria-label="Paginacion de habitaciones">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={page === currentPage ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
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
