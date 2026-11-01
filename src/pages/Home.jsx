import { react } from 'react';
import { useNavigate } from "react-router-dom";
import './Geral.css'
import verificarAutenticacao from "../components/VerificarAutenticacao"

export default function Home() {
  verificarAutenticacao();
  const navigate = useNavigate();
  return (
    <>
      <header>
        <h1 className='titulo'>A Passagem</h1>
      </header>
      <button className='btnNav' onClick={() => navigate("/inventario")}>Inventário</button>
      <button className='btnNav' onClick={() => navigate("/anotacoes")}>Anotações</button>
      <button className='btnNav' onClick={() => navigate("/regras")}>Regras</button>
      <button className='btnNav' onClick={() => navigate("/documentos")}>Documentos</button>
    </>
  )
}