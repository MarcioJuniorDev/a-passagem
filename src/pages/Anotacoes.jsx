import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Geral.css";

export default function Anotacoes() {
  const navigate = useNavigate();

  const [anotacoes, setAnotacoes] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarAnotacoes();
  }, []);

  async function carregarAnotacoes() {
    const { data, error } = await supabase
      .from("anotacoes")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setAnotacoes(data);
  }

  async function salvarAnotacao() {
    if (!titulo.trim()) return;

    if (editandoId) {
      const { error } = await supabase
        .from("anotacoes")
        .update({
          titulo: titulo.trim(),
          conteudo: conteudo.trim(),
        })
        .eq("id", editandoId);

      if (error) {
        console.error(error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("anotacoes")
        .insert({
          titulo: titulo.trim(),
          conteudo: conteudo.trim(),
        });

      if (error) {
        console.error(error);
        return;
      }
    }

    limparFormulario();
    carregarAnotacoes();
  }

  async function removerAnotacao(id) {
    const { error } = await supabase
      .from("anotacoes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    if (editandoId === id) {
      limparFormulario();
    }

    carregarAnotacoes();
  }

  function editarAnotacao(anotacao) {
    setEditandoId(anotacao.id);
    setTitulo(anotacao.titulo);
    setConteudo(anotacao.conteudo);
  }

  function limparFormulario() {
    setTitulo("");
    setConteudo("");
    setEditandoId(null);
  }

  return (
    <>
      <header>
        <h1 className="titulo">Anotações</h1>
      </header>

      <div className="painel">

        <div className="formularioColuna">

          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <textarea
            rows={8}
            placeholder="Digite sua anotação..."
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />

          <button onClick={salvarAnotacao}>
            {editandoId ? "Atualizar" : "Salvar"}
          </button>

          {editandoId && (
            <button
              className="btnInterativo"
              onClick={limparFormulario}
            >
              Cancelar edição
            </button>
          )}

        </div>

        <div className="listaAnotacoes">

          {anotacoes.map((anotacao) => (

            <div
              key={anotacao.id}
              className="cardAnotacao"
            >

              <div className="conteudoAnotacao">

                <h3>
                  {anotacao.titulo}
                </h3>


                <p>
                  {anotacao.conteudo}
                </p>

              </div>


              <div className="botoesAnotacao">

                <button
                  className="btnInterativo"
                  onClick={() => editarAnotacao(anotacao)}
                >
                  Editar
                </button>


                <button
                  className="btnInterativo"
                  onClick={() => removerAnotacao(anotacao.id)}
                >
                  Excluir
                </button>

              </div>

            </div>

          ))}

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