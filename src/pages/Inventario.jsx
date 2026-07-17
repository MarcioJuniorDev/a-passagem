import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import './Geral.css'

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

  async function alterarDescricao(item, novaDescricao) {
    const { error } = await supabase
      .from("inventario")
      .update({
        descricao: novaDescricao,
      })
      .eq("id", item.id);

    if (error) {
      console.error(error);
      return;
    }

    carregarItens();
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

    // Não permite valores negativos
    if (novaQuantidade < 0) return;

    const { error } = await supabase
      .from("inventario")
      .update({
        quantidade: novaQuantidade,
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

    // Verifica se o item já existe
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
        quantidade: itemExistente.quantidade + quantidade,
      };

      // Atualiza a descrição somente se foi informada
      if (descricao.trim() !== "") {
        dadosAtualizados.descricao = descricao.trim();
      }

      const { error: erroUpdate } = await supabase
        .from("inventario")
        .update(dadosAtualizados)
        .eq("id", itemExistente.id);

      if (erroUpdate) {
        console.error(erroUpdate);
        return;
      }
    } else {
      const { error: erroInsert } = await supabase
        .from("inventario")
        .insert({
          nome: nomeLimpo,
          quantidade,
          descricao: descricao.trim(),
        });

      if (erroInsert) {
        console.error(erroInsert);
        return;
      }
    }

    setNome("");
    setQuantidade(1);
    setDescricao("");

    carregarItens();
  }

  useEffect(() => {
    carregarItens();
  }, []);

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

  return (
    <>
      <header>
        <h1 className="titulo">Inventário</h1>
      </header>

      <div className="painel">
        <div className="formulario">
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

        <div className="listaItens">
          {itens.map((item) => (
            <div
              key={item.id}
              className="itemInventario"
            >
              <div style={{ flex: 1 }}>
                <h3>{item.nome}</h3>

                {descricoesAbertas.has(item.id) && (
                  <textarea
                    className="descricaoItem"
                    defaultValue={item.descricao ?? ""}
                    ref={(el) => {
                      if (el) {
                        el.style.height = "auto";
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onBlur={(e) =>
                      alterarDescricao(item, e.target.value)
                    }
                  />
                )}

                <p>Quantidade: {item.quantidade}</p>

                <div className="controlesQuantidade">
                  <button
                    onClick={() => alterarQuantidade(item, -1)}
                  >
                    -1
                  </button>

                  <button
                    onClick={() => alterarQuantidade(item, 1)}
                  >
                    +1
                  </button>
                </div>
              </div>

              <div className="acoesItem">
                <button
                  className="btnInterativo"
                  onClick={() => alternarDescricao(item.id)}
                >
                  {descricoesAbertas.has(item.id)
                    ? "Ocultar descrição"
                    : "Mostrar descrição"}
                </button>

                <button
                  className="btnInterativo"
                  onClick={() => removerItem(item.id)}
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
        onClick={() => navigate("/")}
      >
        Voltar
      </button>
    </>
  );
}