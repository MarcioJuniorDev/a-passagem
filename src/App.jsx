import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Inventario from "./pages/Inventario";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventario" element={<Inventario />} />
    </Routes>
  );
}

export default App;