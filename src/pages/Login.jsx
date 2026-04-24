import { useState } from 'react';
import './Login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Aquí irá la llamada al backend cuando esté listo
      console.log('Login con:', email, password);
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" />

      <main className="login-wrapper">

        {/* LADO IZQUIERDO */}
        <section className="login-left">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtUMR7hVqR6aU9AU5rpei0EmfpV_vlJW1aMLVh4fZvc2cddKeLF7AS_6A1vx76VkzRUuQ36YGb0gcdEHkCg6zPtWHKr3-6C9tGeqfbolHZZsx1my9yMRmTG3gYmoZFBY4r9KRuUWoZyx1zYmQLkD5XOUUqMxzbdo4FWNuStSNx50xsKiP647PFdLgJSRSzAwm63IUZ4O1NANzdBpwPVahq2YASm-vg77hiaTBLXqEgjEgDoFfAd7Ta9pF7vAiXzfIyCRMZQseqW9eh"
            alt="Luxury Hotel Lobby"
          />
          <div className="login-left-overlay" />
          <div className="login-left-content">
            <div>
              <h1>Welcome back to Excellence</h1>
              <p>Manage your premium properties with the sophistication they deserve.</p>
            </div>
            <div className="login-left-footer">
              <div className="line" />
              <span>LuxeManage Systems</span>
            </div>
          </div>
        </section>

        {/* LADO DERECHO */}
        <section className="login-right">
          <div className="login-form-container">

            {/* Logo */}
            <div className="login-logo">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span className="brand">LuxeManage</span>
            </div>

            {/* Título */}
            <div className="login-title">
              <h2>Elevate Your Presence</h2>
              <p>Secure access to your management dashboard</p>
            </div>

            {/* Tabs */}
            <div className="login-tabs">
              <button
                className={activeTab === 'signin' ? 'active' : ''}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button
                className={activeTab === 'register' ? 'active' : ''}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>

            {/* Social */}
            <div className="login-social">
              <button type="button">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnoE6J9emjDzuL-8ndYU6D3B_9ArnhIEIBhOknyFDPCOe3yWQ7UpQcItWbycyAkDGlKfOh7YwZ_PlNori8ZApo3LeyJxrkat5_FlQnX4mKfk9o0gSpKcjkl5sjjQDmGqL34ZvPouDQPO7uonxMuo3A1R9SoN7QmfvCBCPXh6vPCF-YiC4sTT6bvn1o_EO032WowntWggndWImr6vPOvDK8rXmqGV42yuulzO2ax8mlA5tLkNfpRKpAVi-lHOZ515uB-jUsjRfIR-1B" alt="Google" />
                Google
              </button>
              <button type="button">
                <span className="material-symbols-outlined" style={{fontSize:'20px'}}>ios</span>
                Apple
              </button>
            </div>

            {/* Divider */}
            <div className="login-divider">
              <span>or continue with email</span>
            </div>

            {/* Error */}
            {error && <p className="login-error">{error}</p>}

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="manager@luxemanage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field">
                <div className="login-field-header">
                  <label htmlFor="password">Password</label>
                  <a href="#">Forgot password?</a>
                </div>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="login-remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me for 30 days</label>
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Cargando...' : 'Sign In'}
              </button>
            </form>

            <p className="login-support">
              Need assistance? <a href="#">Contact Support</a>
            </p>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="login-footer-inner">
          <span>© 2024 LuxeManage Systems</span>
          <div className="login-footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Login;