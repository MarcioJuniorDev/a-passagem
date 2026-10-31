import "./Geral.css";
import { useState } from "react";

export default function Autenticacao() {

    function fnEnviar()
    {

    }

    return (
        <>
            <div id="inputAutenticacao">
                <input type="text" placeholder="insira o usuário"/>
            </div>

            <div id="enviar">
                <button>Enviar</button>
            </div>
        </>
    );
}