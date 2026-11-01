import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "./Geral.css";

export default function Inventario() {

  const navigate = useNavigate();

  const [itens, setItens] = useState([]);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState("");

  const [descricoesAbertas, setDescricoesAbertas] = useState(new Set());

  function alternarDescricao(id) {

    setDescricoesAbertas((anterior) => {

      const novo = new Set(anterior);

      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }

      return novo;

    });

  }

  async function carregarItens() {

    const { data, error } = await supabase
      .from("inventario")
      .select("*")
      .order("nome");

    if (error) {

      console.error(error);
      return;

    }
    setItens(data);
  }

  async function alterarQuantidade(item, valor) {

    const novaQuantidade = item.quantidade + valor;

    if (novaQuantidade < 0) return;

    const { error } = await supabase
      .from("inventario")
      .update({

        quantidade: novaQuantidade

      })
      .eq("id", item.id);

    if (error) {

      console.error(error);
      return;
    }
    carregarItens();
  }

  async function alterarDescricao(item, novaDescricao) {

    const { error } = await supabase
      .from("inventario")
      .update({
        descricao: novaDescricao
      })
      .eq("id", item.id);

    if (error) {
      console.error(error);
      return;
    }
    carregarItens();
  }

  async function adicionarItem() {

    if (!nome.trim()) return;

    if (quantidade < 0) {
      alert("A quantidade não pode ser negativa.");
      return;
    }

    const nomeLimpo = nome.trim();

    const { data: itemExistente, error: erroBusca } = await supabase
      .from("inventario")
      .select("*")
      .ilike("nome", nomeLimpo)
      .maybeSingle();

    if (erroBusca) {
      console.error(erroBusca);
      return;
    }

    if (itemExistente) {

      const dadosAtualizados = {
        quantidade:
          itemExistente.quantidade + quantidade
      };

      if (descricao.trim() !== "") {
        dadosAtualizados.descricao =
          descricao.trim();
      }

      const { error } = await supabase
        .from("inventario")
        .update(dadosAtualizados)
        .eq("id", itemExistente.id);

      if (error) {
        console.error(error);
        return;
      }

    } else {
      const { error } = await supabase
        .from("inventario")
        .insert({
          nome: nomeLimpo,
          quantidade,
          descricao: descricao.trim()
        });

      if (error) {
        console.error(error);
        return;
      }
    }

    setNome("");
    setQuantidade(1);
    setDescricao("");
    carregarItens();
  }

  async function removerItem(id) {
    const { error } = await supabase
      .from("inventario")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    carregarItens();
  }

  useEffect(() => {
    carregarItens();
  }, []);

  return (
    <>
      <header>
        <h1 className="titulo">Inventário</h1>
      </header>

      <div className="painel">

        <div className="formularioColuna">
          <input
            placeholder="Nome do item"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <textarea
            className="descricaoItem"
            placeholder="Descrição do item"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <button onClick={adicionarItem}>
            Adicionar
          </button>
        </div>


        <div className="listaCards">

          {itens.map((item) => (

            <div
              key={item.id}
              className="cardInventario"
            >

              <h3>{item.nome}</h3>

              <p>
                Quantidade: {item.quantidade}
              </p>


              {descricoesAbertas.has(item.id) && (

                <textarea
                  className="descricaoCard"
                  defaultValue={item.descricao ?? ""}

                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height =
                        `${el.scrollHeight}px`;
                    }
                  }}

                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height =
                      `${e.target.scrollHeight}px`;
                  }}

                  onBlur={(e) =>
                    alterarDescricao(
                      item,
                      e.target.value
                    )
                  }
                />

              )}


              <div className="acoesCard">

                <button
                  className="btnInterativo"
                  onClick={() =>
                    alternarDescricao(item.id)
                  }
                >
                  {
                    descricoesAbertas.has(item.id)
                      ? "Ocultar descrição"
                      : "Mostrar descrição"
                  }
                </button>


                <div className="controleCard">

                  <button
                    onClick={() =>
                      alterarQuantidade(item, -1)
                    }
                  >
                    -1
                  </button>


                  <button
                    onClick={() =>
                      alterarQuantidade(item, 1)
                    }
                  >
                    +1
                  </button>

                </div>


                <button
                  className="btnInterativo"
                  onClick={() =>
                    removerItem(item.id)
                  }
                >
                  Remover
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>


      <button
        className="btnNavV"
        onClick={() => navigate("/home")}
      >
        Voltar
      </button>

    </>
  );
}