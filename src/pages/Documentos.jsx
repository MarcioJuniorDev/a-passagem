import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Geral.css";

export default function Documentos() {
    const navigate = useNavigate();

    const [documentos, setDocumentos] = useState([]);
    const [arquivo, setArquivo] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [grupo, setGrupo] = useState("");

    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        carregarDocumentos();
    }, []);

    function abrirImagem(url) {
        window.open(url, "_blank");
    }

    function editarDocumento(doc) {
        setEditandoId(doc.id);
        setTitulo(doc.titulo);
        setGrupo(doc.grupo ?? "");
    }

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

        if (!titulo.trim()) {
            alert("Informe um título.");
            return;
        }


        // EDITAR
        if (editandoId) {

            const { error } = await supabase
                .from("documentos")
                .update({
                    titulo: titulo.trim(),
                    grupo: grupo.trim(),
                })
                .eq("id", editandoId);


            if (error) {
                console.error(error);
                return;
            }


            limparFormulario();
            carregarDocumentos();
            return;
        }


        // NOVO ARQUIVO
        if (!arquivo) return;


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
                grupo: grupo.trim(),
                nome: arquivo.name,
                url: data.publicUrl,
            });


        if (error) {
            console.error(error);
            return;
        }


        limparFormulario();
        carregarDocumentos();
    }

    function limparFormulario() {

        setArquivo(null);
        setTitulo("");
        setGrupo("");
        setEditandoId(null);

        const input = document.getElementById("arquivo");

        if (input) {
            input.value = "";
        }
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

    const documentosAgrupados = documentos.reduce((grupos, doc) => {

        const nomeGrupo = doc.grupo || "Sem grupo";

        if (!grupos[nomeGrupo]) {
            grupos[nomeGrupo] = [];
        }

        grupos[nomeGrupo].push(doc);

        return grupos;

    }, {});

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
                        type="text"
                        placeholder="Grupo do documento"
                        value={grupo}
                        onChange={(e) => setGrupo(e.target.value)}
                    />

                    <input
                        id="arquivo"
                        type="file"
                        onChange={(e) => setArquivo(e.target.files[0])}
                    />

                    <button onClick={enviarArquivo}>
                        {editandoId ? "Atualizar documento" : "Enviar arquivo"}
                    </button>

                </div>

                <div className="listaAnotacoes">
                    {Object.entries(documentosAgrupados).map(
                        ([nomeGrupo, docs]) => (

                            <div
                                key={nomeGrupo}
                                className="grupoDocumentos"
                            >

                                <h2 className="tituloGrupo">
                                    {nomeGrupo}
                                </h2>


                                <div className="listaGrupo">

                                    {docs.map((doc) => (

                                        <div
                                            key={doc.id}
                                            className="cardDocumento"
                                        >

                                            <div>

                                                <h3>
                                                    {doc.titulo}
                                                </h3>


                                                <p>
                                                    {doc.nome}
                                                </p>


                                                {doc.url && (
                                                    <img
                                                        src={doc.url}
                                                        alt={doc.titulo}
                                                        className="imagemRegra"
                                                    />
                                                )}

                                            </div>


                                            <div className="botoesAnotacao">

                                                {doc.url && (
                                                    <button
                                                        className="btnInterativo"
                                                        onClick={() => abrirImagem(doc.url)}
                                                    >
                                                        Abrir
                                                    </button>
                                                )}


                                                <button
                                                    className="btnInterativo"
                                                    onClick={() => editarDocumento(doc)}
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className="btnInterativo"
                                                    onClick={() => removerDocumento(doc)}
                                                >
                                                    Excluir
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        )
                    )}
                </div>

                <button
                    className="btnNavV"
                    onClick={() => navigate("/home")}
                >
                    Voltar
                </button>

            </div>
        </>
    );
}