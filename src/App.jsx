import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Inventario from "./pages/Inventario";
import Anotacoes from "./pages/Anotacoes";
import Regras from "./pages/Regras";
import Documentos from "./pages/Documentos";
import Autenticacao from "./pages/Autenticacao";
import VerificarAutenticacao from "./components/VerificarAutenticacao";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Autenticacao />} />
      <Route element={<VerificarAutenticacao />}>
        <Route path="/home" element={<Home />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/anotacoes" element={<Anotacoes />} />
        <Route path="/regras" element={<Regras />} />
        <Route path="/documentos" element={<Documentos />} />
      </Route>
    </Routes>
  );
}

export default App;