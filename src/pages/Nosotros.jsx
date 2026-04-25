import { Link } from 'react-router-dom';
import { Header } from './Home.jsx';

const pillars = [
  {
    title: 'Hospitalidad personalizada',
    text: 'Acompanamos cada reserva con atencion cercana, recomendaciones utiles y soporte pensado para que el viaje empiece sin fricciones.',
  },
  {
    title: 'Gestion hotelera eficiente',
    text: 'Centralizamos habitaciones, reservas y disponibilidad para que el equipo del hotel pueda trabajar con informacion clara y actualizada.',
  },
  {
    title: 'Experiencias memorables',
    text: 'Conectamos a los huespedes con espacios comodos, servicios confiables y propuestas que elevan cada estadia.',
  },
];

function Nosotros() {
  return (
    <div className="home-page about-page">
      <Header />

      <main>
        <section className="about-hero">
          <div className="about-hero-content">
            <p className="section-kicker">Nosotros</p>
            <h1>Gestionamos estadias con tecnologia, calidez y detalle.</h1>
            <p>
              LuxeStay es una plataforma de gestion hotelera creada para hacer
              mas simple la conexion entre huespedes y hoteles. Nuestro enfoque
              combina una experiencia digital clara con servicios pensados para
              reservar, organizar y disfrutar cada visita.
            </p>
            <Link className="book-link" to="/reservar">
              Reservar Ahora
            </Link>
          </div>
        </section>

        <section className="about-section">
          <div className="about-copy">
            <p className="section-kicker">Que hacemos</p>
            <h2>Facilitamos la reserva y administracion de habitaciones.</h2>
            <p>
              Ayudamos a mostrar habitaciones, promociones y servicios de forma
              ordenada para que los clientes encuentren rapidamente la opcion
              ideal. A la vez, preparamos una base para integrar consultas,
              reservas, pagos y seguimiento de estadias desde un solo lugar.
            </p>
          </div>

          <div className="about-pillars">
            {pillars.map((pillar) => (
              <article className="about-pillar" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Nosotros;
