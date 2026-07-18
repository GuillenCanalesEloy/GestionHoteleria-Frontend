import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminHabitaciones from './pages/AdminHabitaciones.jsx';
import Register from './pages/Register.jsx';
import ClienteAdmin from './pages/ClienteAdmin.jsx';
import Habitaciones from './pages/Habitaciones.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MisReservas from './pages/MisReservas.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Reservas from './pages/Reservas.jsx';
import ReservasAdmin from './pages/ReservasAdmin.jsx';
import Pagos from './pages/Pagos.jsx';
import Reportes from './pages/Reportes.jsx';
import AdminPagos from './pages/AdminPagos.jsx';
import AreasComunes from './pages/AreasComunes.jsx';
import AdminAreasComunes from './pages/AdminAreasComunes.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      {/* Este bloque maneja la navegación principal */}
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="/areas-comunes" element={<AreasComunes />} />
        <Route path="/mis-reservas" element={<ProtectedRoute role="CLIENTE"><MisReservas /></ProtectedRoute>} />
        <Route path="/reservar" element={<ProtectedRoute role="CLIENTE"><Reservas /></ProtectedRoute>} />
        <Route path="/pago" element={<ProtectedRoute role="CLIENTE"><Pagos /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/habitaciones" element={<ProtectedRoute role="ADMIN"><AdminHabitaciones /></ProtectedRoute>} />
        <Route path="/admin/areas-comunes" element={<ProtectedRoute role="ADMIN"><AdminAreasComunes /></ProtectedRoute>} />
        <Route path="/admin/clientes" element={<ProtectedRoute role="ADMIN"><ClienteAdmin /></ProtectedRoute>} />
        <Route path="/admin/reservas" element={<ProtectedRoute role="ADMIN"><ReservasAdmin /></ProtectedRoute>} />
        <Route path="/admin/reportes" element={<ProtectedRoute role="ADMIN"><Reportes /></ProtectedRoute>} />
        <Route path="/admin/pagos" element={<ProtectedRoute role="ADMIN"><AdminPagos /></ProtectedRoute>} />
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
