<<<<<<< HEAD
import { BrowserRouter, Route, Routes } from 'react-router-dom';
=======
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
>>>>>>> ad354f07c6aa253ed1b75af4b28923865c9139e0
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
