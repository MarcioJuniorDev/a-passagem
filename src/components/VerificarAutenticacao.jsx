import { Navigate, Outlet } from "react-router-dom";

export default function VerificarAutenticacao() {
    const autenticado = JSON.parse(localStorage.getItem("usuario"));

    if (!autenticado) {
        alert("Faça login para acessar essa página.");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}