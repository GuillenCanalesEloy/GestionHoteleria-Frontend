import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Habitaciones from './pages/Habitaciones.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MisReservas from './pages/MisReservas.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Reservas from './pages/Reservas.jsx';
import Pagos from './pages/Pagos.jsx';
import Reportes from './pages/Reportes.jsx';

function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      {/* Este bloque maneja la navegación principal */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/reservar" element={<Reservas />} />
        <Route path="/pago" element={<Pagos />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reportes" element={<Reportes />} />
        {/* Redirección por defecto si la ruta no existe */}
        <Route path="*" element={<Home />} />
      </Routes>

      {/* Lógica para mostrar el Login como modal sobre la página actual si existe backgroundLocation */}
      {backgroundLocation && (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* IMPORTANTE: Aquí solo llamamos a AppRoutes una vez. 
        Antes tenías otro bloque <Routes> aquí arriba que causaba el duplicado.
      */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
