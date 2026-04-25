import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Habitaciones from './pages/Habitaciones.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Nosotros from './pages/Nosotros.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
