import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import Anotacoes from "./pages/Anotacoes";
import Regras from "./pages/Regras";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/anotacoes" element={<Anotacoes/>} />
      <Route path="/regras" element={<Regras/>} />
    </Routes>
  );
}

export default App;