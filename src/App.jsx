import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import Anotacoes from "./pages/Anotacoes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/anotacoes" element={<Anotacoes/>} />
    </Routes>
  );
}

export default App;