import { Outlet } from "react-router-dom";

export default function VerificarAutenticacao() {
    const autenticado = JSON.parse(localStorage.getItem("usuario"));

    return (
        <div data-permissao={autenticado ? "admin" : "visualizador"}>
            <Outlet />
        </div>
    );
}