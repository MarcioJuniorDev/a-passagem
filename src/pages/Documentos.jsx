import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Geral.css";

export default function Documentos() {
    const navigate = useNavigate();

    const [documentos, setDocumentos] = useState([]);
    const [arquivo, setArquivo] = useState(null);
    const [titulo, setTitulo] = useState("");

    useEffect(() => {
        carregarDocumentos();
    }, []);

    async function carregarDocumentos() {
        const { data, error } = await supabase
            .from("documentos")
            .select("*")
            .order("criado_em", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setDocumentos(data);
    }

    async function enviarArquivo() {
        if (!arquivo) return;

        if (!titulo.trim()) {
            alert("Informe um título.");
            return;
        }

        const nomeArquivo = `${Date.now()}-${arquivo.name}`;

        const { error: erroUpload } = await supabase.storage
            .from("documentos")
            .upload(nomeArquivo, arquivo);

        if (erroUpload) {
            console.error(erroUpload);
            return;
        }

        const { data } = supabase.storage
            .from("documentos")
            .getPublicUrl(nomeArquivo);

        const { error } = await supabase
            .from("documentos")
            .insert({
                titulo: titulo.trim(),
                nome: arquivo.name,
                url: data.publicUrl,
            });

        if (error) {
            console.error(error);
            return;
        }

        setArquivo(null);
        setTitulo("");
        document.getElementById("arquivo").value = "";

        carregarDocumentos();
    }

    async function removerDocumento(doc) {
        const nomeArquivo = doc.url.split("/").pop();

        await supabase.storage
            .from("documentos")
            .remove([nomeArquivo]);

        await supabase
            .from("documentos")
            .delete()
            .eq("id", doc.id);

        carregarDocumentos();
    }

    return (
        <>
            <header>
                <h1 className="titulo">Documentos</h1>
            </header>

            <div className="painel">

                <div className="formularioColuna">


                    <input
                        type="text"
                        placeholder="Título do documento"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                    <input
                        id="arquivo"
                        type="file"
                        onChange={(e) => setArquivo(e.target.files[0])}
                    />

                    <button onClick={enviarArquivo}>
                        Enviar arquivo
                    </button>

                </div>

                <div className="listaItens">
                    {documentos.map((doc) => (
                        <div
                            key={doc.id}
                            className="itemInventario"
                        >
                            <div>
                                <h3>{doc.titulo}</h3>
                                <p>{doc.nome}</p>

                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Abrir documento
                                </a>
                            </div>

                            <button
                                className="btnInterativo"
                                onClick={() => removerDocumento(doc)}
                            >
                                Excluir
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    className="btnNav"
                    onClick={() => navigate("/")}
                >
                    Voltar
                </button>

            </div>
        </>
    );
}