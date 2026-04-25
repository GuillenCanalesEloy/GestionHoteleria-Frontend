import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Habitaciones from './pages/Habitaciones.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Nosotros from './pages/Nosotros.jsx';

function AppRoutes() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="*" element={<Home />} />
      </Routes>

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
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
