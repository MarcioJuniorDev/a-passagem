import "./Geral.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Autenticacao() {
    const [nomeUsuario, setNomeUsuario] = useState('');
    const navigate = useNavigate();

    async function fnEnviar() {
        const usuarioCorreto = await fnBuscarUsuario();

        if (!usuarioCorreto) {
            alert("Erro ao buscar usuário.");
            return;
        }

        if (nomeUsuario === usuarioCorreto) {
            await fnSalvarUsuarioLocalmente();
            navigate("/home");
        } else {
            alert("Usuário errado. Insira novamente ou entre apenas como visualizador.");
        }
    }

    async function fnBuscarUsuario() {
        const { data, error } = await supabase
            .from("usuarios")
            .select("nome")
            .eq("id", 1)
            .maybeSingle();

        if (error) {
            console.error(error);
            return null;
        }

        return data?.nome ?? null;
    }

    // armazenamento local dos dados do usuário
    const CHAVE_USUARIO = '@usuario';

    async function fnSalvarUsuarioLocalmente() {
        try {
            localStorage.setItem('usuario', 1);
            console.log("usuario logado")
        } catch (e) {
            console.error('Erro ao salvar usuário:', e);
        }
    }

    return (
        <>
            <div id="inputAutenticacao">
                <input
                    type="text"
                    placeholder="Insira o usuário"
                    value={nomeUsuario}
                    onChange={(e) => setNomeUsuario(e.target.value)}
                />
            </div>

            <div id="enviar">
                <button onClick={fnEnviar}>Enviar</button>
            </div>
        </>
    );
}