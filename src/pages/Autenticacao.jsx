import "./Geral.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Autenticacao() {

    const [nomeUsuario, setNomeUsuario] = useState('');
    const navigate = useNavigate();

    function fnEnviar() {
        if (nomeUsuario === usuarioCorreto) {
            navigate("/home")
        }
        else {
            alert("Usuário errado. Insira novamente ou entre apenas como visualizador.");
        }
    }

    async function buscarUsuarios() {
        const { data, error } = await supabase
            .from("usuarios")
            .select("nome")
            .eq("id", 1);

        if (error) {
            console.error(error);
            return;
        }

        return data;
    }

    return (
        <>
            <div id="inputAutenticacao">
                <input type="text" placeholder="insira o usuário"
                    onChange={(e) => setNomeUsuario(e.target.value)} />
            </div>

            <div id="enviar">
                <button onClick={() => fnEnviar()}>Enviar</button>
            </div>
        </>
    );
}