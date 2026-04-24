import { Link } from 'react-router-dom';
import { Header } from './Home.jsx';

const roomTypes = ['Single Room', 'Double Classic', 'Luxury Suite'];

const rooms = [
  {
    title: 'Presidential Suite',
    tag: 'Suite',
    price: '$450',
    rating: '4.9',
    guests: '4 Adults',
    size: '85 m2',
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=900',
  },
  {
    title: 'Deluxe Classic Room',
    tag: 'Deluxe',
    price: '$280',
    rating: '4.8',
    guests: '2 Adults',
    size: '42 m2',
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=900',
  },
  {
    title: 'Executive City View',
    tag: 'Business',
    price: '$320',
    rating: '4.7',
    guests: '2 Adults',
    size: '50 m2',
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=900',
  },
];

function Habitaciones() {
  return (
    <div className="home-page habitaciones-page">
      <Header />

      <main className="habitaciones-main">
        <section className="habitaciones-heading">
          <p className="section-kicker">Nuestra Seleccion</p>
          <h1>Explora Habitaciones</h1>
          <p>Encuentra suites y habitaciones pensadas para descansar, trabajar y disfrutar cada detalle.</p>
        </section>

        <section className="habitaciones-layout">
          <aside className="filters-panel" aria-label="Filtros de habitaciones">
            <div className="filter-card">
              <h2>Filtros</h2>

              <div className="filter-group">
                <span>Rango de precio</span>
                <input max="1000" min="100" type="range" />
                <div className="range-labels">
                  <small>$100</small>
                  <small>$1000+</small>
                </div>
              </div>

              <div className="filter-group">
                <span>Tipo de habitacion</span>
                <div className="check-list">
                  {roomTypes.map((type) => (
                    <label key={type}>
                      <input type="checkbox" defaultChecked={type === 'Luxury Suite'} />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="availability-row">
                <span>Reserva inmediata</span>
                <button type="button" aria-label="Reserva inmediata activada" />
              </div>

              <button className="filter-button" type="button">
                Aplicar Filtros
              </button>
            </div>

            <div className="discount-panel">
              <span>15% OFF</span>
              <h3>Descuento para miembros</h3>
              <p>Inicia sesion para acceder a beneficios exclusivos en suites seleccionadas.</p>
            </div>
          </aside>

          <div className="rooms-catalog">
            <div className="catalog-toolbar">
              <div>
                <h2>Habitaciones disponibles</h2>
                <p>Mostrando 12 estadias de lujo para tus fechas.</p>
              </div>
              <div className="view-toggle" aria-label="Vista del catalogo">
                <button className="active" type="button" aria-label="Vista de cuadricula">
                  ::
                </button>
                <button type="button" aria-label="Vista de lista">
                  =
                </button>
              </div>
            </div>

            <div className="catalog-grid">
              {rooms.map((room) => (
                <article className="catalog-card" key={room.title}>
                  <div className="catalog-image">
                    <img src={room.image} alt={room.title} />
                    <span>{room.tag}</span>
                    <button type="button" aria-label={`Guardar ${room.title}`}>
                      *
                    </button>
                  </div>

                  <div className="catalog-content">
                    <div className="catalog-title-row">
                      <h3>{room.title}</h3>
                      <span>{room.rating}</span>
                    </div>
                    <div className="room-meta">
                      <span>{room.guests}</span>
                      <span>{room.size}</span>
                    </div>
                    <div className="catalog-footer">
                      <div>
                        <small>Por noche</small>
                        <strong>{room.price}</strong>
                      </div>
                      <Link to="/reservar">Ver Detalle</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <nav className="pagination-row" aria-label="Paginacion de habitaciones">
              <button type="button" aria-label="Pagina anterior">
                &lt;
              </button>
              <button className="active" type="button">
                1
              </button>
              <button type="button">2</button>
              <button type="button" aria-label="Pagina siguiente">
                &gt;
              </button>
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Habitaciones;
