import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Geral.css";

export default function Regras() {
  const navigate = useNavigate();

  const [regras, setRegras] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarRegras();
  }, []);

  async function carregarRegras() {
    const { data, error } = await supabase
      .from("regras")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setRegras(data);
  }

  async function salvarRegras() {
    if (!titulo.trim()) return;

    if (editandoId) {
      const { error } = await supabase
        .from("regras")
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
        .from("regras")
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
    carregarRegras();
  }

  async function removerRegra(id) {
    const { error } = await supabase
      .from("regras")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    if (editandoId === id) {
      limparFormulario();
    }

    carregarRegras();
  }

  function editarRegra(regra) {
    setEditandoId(regra.id);
    setTitulo(regra.titulo);
    setConteudo(regra.conteudo);
  }

  function limparFormulario() {
    setTitulo("");
    setConteudo("");
    setEditandoId(null);
  }

  return (
    <>
      <header>
        <h1 className="titulo">Regras Adicionais</h1>
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
            placeholder="Digite sua regra..."
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />

          <button onClick={salvarRegras}>
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

        <div className="listaItens">
          {regras.map((regra) => (
            <div
              key={regra.id}
              className="itemInventario"
            >
              <div style={{ flex: 1 }}>
                <h3>{regra.titulo}</h3>

                <p style={{ whiteSpace: "pre-wrap" }}>
                  {regra.conteudo}
                </p>
              </div>

              <div className="botoesAnotacao">
                <button
                  className="btnInterativo"
                  onClick={() => editarRegra(regra)}
                >
                  Editar
                </button>

                <button
                  className="btnInterativo"
                  onClick={() => removerRegra(regra.id)}
                >
                  Excluir
                </button>
              </div>
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