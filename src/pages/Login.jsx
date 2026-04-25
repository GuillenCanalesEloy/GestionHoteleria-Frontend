import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Icon({ type }) {
  const icons = {
    mail: (
      <path d="M4.8 5h14.4A2.8 2.8 0 0 1 22 7.8v8.4a2.8 2.8 0 0 1-2.8 2.8H4.8A2.8 2.8 0 0 1 2 16.2V7.8A2.8 2.8 0 0 1 4.8 5Zm.1 2 7.1 5 7.1-5H4.9Zm15.1 1.7-7.4 5.2a1 1 0 0 1-1.2 0L4 8.7v7.5c0 .4.4.8.8.8h14.4c.4 0 .8-.4.8-.8V8.7Z" />
    ),
    lock: (
      <path d="M7 10V7.8a5 5 0 0 1 10 0V10h.5A2.5 2.5 0 0 1 20 12.5v5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-5A2.5 2.5 0 0 1 6.5 10H7Zm2 0h6V7.8a3 3 0 0 0-6 0V10Zm3 3.2a1 1 0 0 0-1 1v1.6a1 1 0 1 0 2 0v-1.6a1 1 0 0 0-1-1Z" />
    ),
    eye: (
      <path d="M12 5c5.1 0 8.4 4.4 9.3 5.8.3.4.3.9 0 1.3C20.4 13.5 17.1 18 12 18s-8.4-4.5-9.3-5.9a1.2 1.2 0 0 1 0-1.3C3.6 9.4 6.9 5 12 5Zm0 2c-3.7 0-6.3 3-7.2 4.5C5.7 13 8.3 16 12 16s6.3-3 7.2-4.5C18.3 10 15.7 7 12 7Zm0 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    ),
    eyeOff: (
      <path d="m4.3 3.3 16.4 16.4-1.4 1.4-3-3A10.2 10.2 0 0 1 12 19c-5.1 0-8.4-4.5-9.3-5.9a1.2 1.2 0 0 1 0-1.3 15 15 0 0 1 3.1-3.5L2.9 5l1.4-1.7Zm3 6.4a12.8 12.8 0 0 0-2.5 2.8C5.7 14 8.3 17 12 17c1 0 2-.2 2.8-.6l-2-2a3 3 0 0 1-3.7-3.7L7.3 9.7ZM12 5c5.1 0 8.4 4.4 9.3 5.8.3.4.3.9 0 1.3a14.5 14.5 0 0 1-2.4 2.9l-1.4-1.4a11.8 11.8 0 0 0 1.7-2.1C18.3 10 15.7 7 12 7c-.7 0-1.3.1-1.9.3L8.5 5.7A9.8 9.8 0 0 1 12 5Z" />
    ),
  };

  return (
    <svg aria-hidden="true" className="ui-icon" viewBox="0 0 24 24">
      {icons[type]}
    </svg>
  );
}

function Header() {
  return (
    <header className="site-header login-site-header">
      <Link className="brand" to="/">
        LUXESTAY
      </Link>
      <nav className="main-nav" aria-label="Navegacion principal">
        <Link to="/">Home</Link>
        <Link to="/habitaciones">Rooms</Link>
        <Link to="/mis-reservas">My Bookings</Link>
      </nav>
      <div className="header-actions">
        <Link className="ghost-link active" to="/login">
          Sign In
        </Link>
        <Link className="book-link" to="/reservar">
          Book Now
        </Link>
      </div>
    </header>
  );
}

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Aqui ira la llamada al backend cuando este listo.
      console.log('Login con:', email, password);
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Header />

      <main className="login-main">
        <section className="login-hero" aria-label="Acceso de huespedes">
          <div className="login-hero-content">
            <p className="section-kicker">Portal de Huespedes</p>
            <h1>Accede a tu experiencia LuxeStay</h1>
            <p>
              Consulta tus reservas, administra tus datos y prepara cada detalle
              de tu proxima estadia.
            </p>
          </div>
        </section>

        <section className="login-panel-section">
          <div className="login-panel">
            <div className="login-title">
              <p className="section-kicker">Bienvenido</p>
              <h2>Inicia sesion</h2>
              <p>Ingresa con tu correo para continuar con tus reservas.</p>
            </div>

            {error && <p className="login-error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="email">Correo electronico</label>
                <div className="login-control">
                  <Icon type="mail" />
                  <input
                    id="email"
                    type="email"
                    placeholder="tuemail@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <div className="login-field-header">
                  <label htmlFor="password">Contrasena</label>
                  <Link to="/recuperar-contrasena">Olvide mi contrasena</Link>
                </div>
                <div className="login-control password-wrapper">
                  <Icon type="lock" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                  >
                    <Icon type={showPassword ? 'eyeOff' : 'eye'} />
                  </button>
                </div>
              </div>

              <div className="login-remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Mantener sesion iniciada</label>
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <p className="login-support">
              Aun no tienes cuenta? <Link to="/registro">Crear cuenta</Link>
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer login-footer">
        <div className="footer-bottom login-footer-bottom">
          <span>(c) 2026 LuxeStay Hospitality Group. All rights reserved.</span>
          <Link to="/soporte">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}

export default Login;
