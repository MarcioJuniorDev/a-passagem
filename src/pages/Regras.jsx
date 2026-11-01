import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Geral.css";

export default function Regras() {
  const navigate = useNavigate();

  const autenticado = JSON.parse(localStorage.getItem("usuario"));

  const [regras, setRegras] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [imagem, setImagem] = useState(null);

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
    if (autenticado) {
      if (!titulo.trim()) return;

      let urlImagem = null;


      // Upload da imagem
      if (imagem) {

        const nomeArquivo = `${Date.now()}-${imagem.name}`;

        const { error: erroUpload } = await supabase.storage
          .from("imagens-regras")
          .upload(nomeArquivo, imagem);


        if (erroUpload) {
          console.error(erroUpload);
          return;
        }


        const { data } = supabase.storage
          .from("imagens-regras")
          .getPublicUrl(nomeArquivo);


        urlImagem = data.publicUrl;
      }


      const dados = {
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
      };


      if (urlImagem) {
        dados.imagem = urlImagem;
      }


      if (editandoId) {

        const { error } = await supabase
          .from("regras")
          .update(dados)
          .eq("id", editandoId);


        if (error) {
          console.error(error);
          return;
        }

      } else {

        const { error } = await supabase
          .from("regras")
          .insert(dados);


        if (error) {
          console.error(error);
          return;
        }
      }


      limparFormulario();
      setImagem(null);
      carregarRegras();
    }
    else {
      alert("você está no modo espectador. faça login para salvar regras.")
    }
  }

  async function removerRegra(id) {
    if (autenticado) {
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
    else {
      alert("você está no modo espectador. faça login para remover regras.")
    }
  }

  function editarRegra(regra) {
    if (autenticado) {
      setEditandoId(regra.id);
      setTitulo(regra.titulo);
      setConteudo(regra.conteudo);
    }
    else {
      alert("você está no modo espectador. faça login para editar regras.")
    }
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

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagem(e.target.files[0])}
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

                {regra.imagem && (
                  <img
                    src={regra.imagem}
                    alt={regra.titulo}
                    className="imagemRegra"
                  />
                )}

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
          className="btnNavV"
          onClick={() => navigate("/home")}
        >
          Voltar
        </button>
      </div>
    </>
  );
}