import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

function Icon({ type }) {
  const icons = {
    close: (
      <path d="M6.3 5 12 10.7 17.7 5 19 6.3 13.3 12 19 17.7 17.7 19 12 13.3 6.3 19 5 17.7 10.7 12 5 6.3 6.3 5Z" />
    ),
    mail: (
      <path d="M4.8 5h14.4A2.8 2.8 0 0 1 22 7.8v8.4a2.8 2.8 0 0 1-2.8 2.8H4.8A2.8 2.8 0 0 1 2 16.2V7.8A2.8 2.8 0 0 1 4.8 5Zm.1 2 7.1 5 7.1-5H4.9Zm15.1 1.7-7.4 5.2a1 1 0 0 1-1.2 0L4 8.7v7.5c0 .4.4.8.8.8h14.4c.4 0 .8-.4.8-.8V8.7Z" />
    ),
    lock: (
      <path d="M7 10V7.8a5 5 0 0 1 10 0V10h.5A2.5 2.5 0 0 1 20 12.5v5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-5A2.5 2.5 0 0 1 6.5 10H7Zm2 0h6V7.8a3 3 0 0 0-6 0V10Zm3 3.2a1 1 0 0 0-1 1v1.6a1 1 0 1 0 2 0v-1.6a1 1 0 0 0-1-1Z" />
    ),
    user: (
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.1 0-7.5 2.1-7.5 4.8 0 .7.6 1.2 1.3 1.2h12.4c.7 0 1.3-.5 1.3-1.2 0-2.7-3.4-4.8-7.5-4.8Z" />
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

function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (apiError) {
      setError(
        apiError.response?.data?.message ||
          'Error al crear la cuenta. El email puede ya estar registrado.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-backdrop" role="presentation">
      <section
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
      >
        <button
          className="login-modal-close"
          type="button"
          onClick={() => navigate('/')}
          aria-label="Cerrar registro"
        >
          <Icon type="close" />
        </button>

        <div className="login-panel">
          <div className="login-title">
            <p className="section-kicker">Nueva cuenta</p>
            <h2 id="register-title">Regístrate gratis</h2>
            <p>
              Crea tu cuenta para reservar habitaciones y gestionar tus estadías.
            </p>
          </div>

          {success ? (
            <p
              style={{
                color: '#4caf50',
                background: '#f0fff4',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                textAlign: 'center',
              }}
            >
              ¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...
            </p>
          ) : (
            <>
              {error && <p className="login-error">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="login-field">
                  <label htmlFor="nombre">Nombre completo</label>
                  <div className="login-control">
                    <Icon type="user" />
                    <input
                      id="nombre"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      maxLength={120}
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="reg-email">Correo electrónico</label>
                  <div className="login-control">
                    <Icon type="mail" />
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={160}
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="reg-password">Contraseña</label>
                  <div className="login-control password-wrapper">
                    <Icon type="lock" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      <Icon type={showPassword ? 'eyeOff' : 'eye'} />
                    </button>
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="confirm-password">Confirmar contraseña</label>
                  <div className="login-control">
                    <Icon type="lock" />
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="login-submit" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>

              <p className="login-support">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login">Inicia sesión aquí</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Register;
