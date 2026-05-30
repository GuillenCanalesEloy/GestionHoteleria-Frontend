import { Link } from "react-router-dom";
import { Header } from "./Home.jsx";

const commonAreas = [
  {
    id: "pool-deck",
    name: "Infinity Pool & Sun Deck",
    badge: "Popular",
    status: "Disponible",
    capacity: 24,
    pricePerHour: 60,
    image:
      "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?auto=format&fit=crop&w=1200&q=80",
    description:
      "Piscina panoramica con zona de descanso, tumbonas premium y atencion de bebidas.",
  },
  {
    id: "wellness-spa",
    name: "Wellness & Spa",
    badge: "Relax",
    status: "Disponible",
    capacity: 8,
    pricePerHour: 85,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    description:
      "Cabinas privadas, sauna y ambiente terapeutico para sesiones de bienestar.",
  },
  {
    id: "high-tech-gym",
    name: "High-Tech Gym",
    badge: "24/7",
    status: "Disponible",
    capacity: 16,
    pricePerHour: 25,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    description:
      "Equipamiento moderno, zona cardiovascular y espacio funcional para rutinas guiadas.",
  },
  {
    id: "private-lounge",
    name: "Private Lounge",
    badge: "Premium",
    status: "Disponible",
    capacity: 12,
    pricePerHour: 75,
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1200&q=80",
    description:
      "Lounge reservado con servicio de cafe, proyector y ambiente ejecutivo.",
  },
];

function AreasComunes() {
  return (
    <div className="home-page areas-page">
      <Header />

      <main>
        <section className="areas-hero">
          <div className="areas-hero-content">
            <p className="hero-kicker">Experiencia exclusiva</p>
            <h1>Areas Comunes</h1>
            <p>
              Explora espacios del hotel para relajarte, entrenar, reunirte o
              disfrutar servicios premium durante tu estadia.
            </p>
            <div className="hero-actions">
              <a className="hero-primary" href="#areas-catalogo">
                Ver espacios
              </a>
              <Link className="hero-secondary" to="/mis-reservas">
                Mis reservas
              </Link>
            </div>
          </div>
        </section>

        <section className="areas-main" id="areas-catalogo">
          <div className="section-heading split-heading">
            <div>
              <p className="section-kicker">Instalaciones</p>
              <h2>Nuestros espacios</h2>
              <p>
                Revisa las areas comunes disponibles con capacidad y precio por
                hora para planificar tu visita.
              </p>
            </div>
          </div>

          <section className="areas-grid" aria-label="Listado de areas comunes">
            {commonAreas.map((area) => (
              <article className="area-card" key={area.id}>
                <div className="area-card-image">
                  <img src={area.image} alt={area.name} />
                  <span>{area.badge}</span>
                </div>
                <div className="area-card-content">
                  <div>
                    <h3>{area.name}</h3>
                    <p>{area.description}</p>
                  </div>
                  <div className="area-meta">
                    <span>{area.status}</span>
                    <span>{area.capacity} personas</span>
                    <span>${area.pricePerHour}/hora</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}

export default AreasComunes;
