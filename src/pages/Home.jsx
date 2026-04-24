import { useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import hotelApi from '../services/hotelApi';

const offers = [
  {
    title: 'Paquete Bienestar Royal',
    badge: '-25% OFF',
    image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
    description:
      'Disfruta 3 noches con acceso ilimitado a nuestro spa de clase mundial y masajes exclusivos.',
    action: 'Reservar Ahora',
  },
  {
    title: 'Experiencia Culinaria',
    badge: 'GOURMET',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    description:
      'Cena de 7 tiempos con maridaje incluido en nuestro restaurante de autor.',
    action: 'Descubrir Menu',
  },
  {
    title: 'Escapada de Lujo',
    badge: 'ESCAPE ROMANTICO',
    image:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80',
    description:
      'La combinacion perfecta de privacidad, vistas panoramicas y una suite nupcial disponible.',
    action: 'Ver detalles',
  },
];

const rooms = [
  {
    title: 'Suite Presidencial Royal',
    price: '$1,200',
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1100&q=80',
    description: 'Vistas panoramicas a la ciudad, terraza privada y mayordomo 24h.',
  },
  {
    title: 'Habitacion Deluxe Ejecutiva',
    price: '$450',
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1100&q=80',
    description: 'Equilibrio perfecto entre trabajo y relajacion con diseno minimalista.',
  },
];

const stats = [
  { value: '15+', label: 'Destinos Luxe' },
  { value: '500+', label: 'Habitaciones Premium' },
  { value: '4.9/5', label: 'Valoracion Huespedes' },
  { value: '24/7', label: 'Servicio Concierge' },
];

const today = new Date().toISOString().slice(0, 10);

export function Icon({ type }) {
  const icons = {
    location: (
      <path d="M12 2.5c-3.2 0-5.8 2.4-5.8 5.6 0 4.1 5.1 9.1 5.3 9.3.3.3.7.3 1 0 .2-.2 5.3-5.2 5.3-9.3 0-3.2-2.6-5.6-5.8-5.6Zm0 7.6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
    ),
    calendar: (
      <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1.2A2.8 2.8 0 0 1 22 6.8v10.4a2.8 2.8 0 0 1-2.8 2.8H4.8A2.8 2.8 0 0 1 2 17.2V6.8A2.8 2.8 0 0 1 4.8 4H6V3a1 1 0 0 1 1-1Zm13 7H4v8.2c0 .4.4.8.8.8h14.4c.4 0 .8-.4.8-.8V9ZM6 11h3v3H6v-3Zm5 0h3v3h-3v-3Zm5 0h2v3h-2v-3Z" />
    ),
    user: (
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.1 0-7.5 2.1-7.5 4.8 0 .7.6 1.2 1.3 1.2h12.4c.7 0 1.3-.5 1.3-1.2 0-2.7-3.4-4.8-7.5-4.8Z" />
    ),
    search: (
      <path d="m20.3 18.9-4-4a7.3 7.3 0 1 0-1.4 1.4l4 4a1 1 0 0 0 1.4-1.4ZM5.5 10.5a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" />
    ),
    send: <path d="M3 4.8 21 12 3 19.2V14l10-2-10-2V4.8Z" />,
  };

  return (
    <svg aria-hidden="true" className="ui-icon" viewBox="0 0 24 24">
      {icons[type]}
    </svg>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">
        LUXESTAY
      </Link>
      <nav className="main-nav" aria-label="Navegacion principal">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/nosotros">Nosotros</NavLink>
        <NavLink to="/habitaciones">Rooms</NavLink>
        <NavLink to="/mis-reservas">My Bookings</NavLink>
      </nav>
      <div className="header-actions">
        <Link className="ghost-link" to="/login">
          Sign In
        </Link>
        <Link className="book-link" to="/reservar">
          Book Now
        </Link>
      </div>
    </header>
  );
}

function SearchBar() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      destino: '',
      fecha: '',
      huespedes: '2 Adultos',
    },
  });

  const onSubmit = async (data) => {
    try {
      await hotelApi.get('/habitaciones', { params: data });
    } catch {
      // El backend aun no esta conectado; el formulario queda listo para integrarlo.
    }

    Swal.fire({
      title: 'Busqueda preparada',
      text: `Destino: ${data.destino || 'sin definir'} | Fecha: ${
        data.fecha || 'sin definir'
      } | Huespedes: ${data.huespedes}`,
      icon: 'success',
      confirmButtonColor: '#8a6416',
    });
  };

  return (
    <form className="search-panel" onSubmit={handleSubmit(onSubmit)}>
      <label className="search-field">
        <span>Destino</span>
        <div className="field-control">
          <Icon type="location" />
          <input
            type="text"
            placeholder="A donde vas?"
            {...register('destino', { required: 'Ingresa un destino' })}
          />
        </div>
        {errors.destino && <small>{errors.destino.message}</small>}
      </label>

      <label className="search-field">
        <span>Check-in / Out</span>
        <div className="field-control">
          <Icon type="calendar" />
          <input type="date" min={today} {...register('fecha')} />
        </div>
      </label>

      <label className="search-field">
        <span>Huespedes</span>
        <div className="field-control">
          <Icon type="user" />
          <select {...register('huespedes')}>
            <option>1 Adulto</option>
            <option>2 Adultos</option>
            <option>2 Adultos, 1 Nino</option>
            <option>Familia 4 Personas</option>
          </select>
        </div>
      </label>

      <button className="search-button" type="submit">
        <Icon type="search" />
        <span>Buscar</span>
      </button>
    </form>
  );
}

function OfferCard({ offer }) {
  return (
    <article className="offer-card">
      <div className="offer-image">
        <img src={offer.image} alt={offer.title} />
        <span>{offer.badge}</span>
      </div>
      <div className="offer-content">
        <h3>{offer.title}</h3>
        <p>{offer.description}</p>
        <Link to="/reservar">{offer.action} &rarr;</Link>
      </div>
    </article>
  );
}

function RoomCard({ room }) {
  return (
    <article className="room-card">
      <img src={room.image} alt={room.title} />
      <div className="room-overlay" />
      <div className="room-info">
        <span>Best Seller</span>
        <h3>{room.title}</h3>
        <p>{room.description}</p>
      </div>
      <div className="room-price">
        <strong>{room.price}</strong>
        <span>por noche</span>
      </div>
    </article>
  );
}

function Home() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="home-page">
      <Header />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>LuxeStay - Tu Refugio de Lujo</h1>
            <p>
              Experimenta la excelencia en cada detalle. Descubre el confort
              elevado al arte en nuestras exclusivas propiedades.
            </p>
            <SearchBar />
          </div>
        </section>

        <section className="section-block offers-section" id="ofertas">
          <div className="section-heading split-heading">
            <div>
              <p className="section-kicker">Ofertas de Temporada</p>
              <h2>Promociones Exclusivas</h2>
            </div>
            <Link to="/habitaciones">Ver todas las ofertas</Link>
          </div>
          <div className="offers-grid">
            {offers.map((offer) => (
              <OfferCard key={offer.title} offer={offer} />
            ))}
          </div>
        </section>

        <section className="rooms-section" id="habitaciones">
          <div className="section-heading centered">
            <p className="section-kicker">Nuestra Seleccion</p>
            <h2>Habitaciones Destacadas</h2>
            <p>
              Disenadas para el maximo confort, cada una de nuestras suites
              cuenta una historia de elegancia y sofisticacion.
            </p>
          </div>

          <div className="rooms-grid">
            {rooms.map((room) => (
              <RoomCard key={room.title} room={room} />
            ))}
          </div>

          <Link className="rooms-cta" to="/habitaciones">
            Explorar Todas las Habitaciones
          </Link>
        </section>

        <section className="stats-strip" aria-label="Indicadores del hotel">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <h2>LUXESTAY</h2>
            <p>
              Redefiniendo la hospitalidad de lujo con experiencias
              personalizadas y destinos inolvidables en todo el mundo.
            </p>
            <div className="social-row" aria-label="Redes sociales">
              <span>IG</span>
              <span>FB</span>
              <span>@</span>
            </div>
          </div>
          <div>
            <h3>Navegacion</h3>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/habitaciones">Habitaciones</Link>
            <Link to="/servicios">Servicios</Link>
            <Link to="/contacto">Contacto</Link>
          </div>
          <div>
            <h3>Legales</h3>
            <Link to="/terminos">Terms of Service</Link>
            <Link to="/privacidad">Privacy Policy</Link>
            <Link to="/cookies">Politica de Cookies</Link>
          </div>
          <div>
            <h3>Newsletter</h3>
            <p>Recibe ofertas exclusivas y novedades.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Tu email" aria-label="Tu email" />
              <button type="button" aria-label="Enviar email">
                <Icon type="send" />
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} LuxeStay Hospitality Group. All rights reserved.</span>
          <Link to="/soporte">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
