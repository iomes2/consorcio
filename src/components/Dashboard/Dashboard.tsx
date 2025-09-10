import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { gql, useQuery, useMutation } from "@apollo/client";

import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";
import EntitySection from "./EntitySection";

// GraphQL Queries
const GET_CONSORCIOS = gql`
  query GetConsorcios {
    consorcios {
      id
      nome
      valor
    }
  }
`;

const GET_COTAS = gql`
  query GetCotas {
    cotas {
      id
      nome
      consorcio {
        id
        nome
      }
    }
  }
`;

// GraphQL Mutations
const ADD_CONSORCIO = gql`
  mutation CreateConsorcio($consorcioInput: ConsorcioInput!) {
    createConsorcio(consorcioInput: $consorcioInput) {
      id
      nome
      valor
    }
  }
`;

const ADD_COTA = gql`
  mutation CreateCota($cotaInput: CotaInput!) {
    createCota(cotaInput: $cotaInput) {
      id
      nome
    }
  }
`;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // --- Fetching Data ---
  const { data: consorciosData, loading: consorciosLoading, error: consorciosError } = useQuery(GET_CONSORCIOS);
  const { data: cotasData, loading: cotasLoading, error: cotasError } = useQuery(GET_COTAS);

  // --- Mutations ---
  const [addConsorcio] = useMutation(ADD_CONSORCIO, {
    refetchQueries: [{ query: GET_CONSORCIOS }],
  });
  const [addCota] = useMutation(ADD_COTA, {
    refetchQueries: [{ query: GET_COTAS }],
  });

  // --- Local State ---
  const [searchTermConsorcio, setSearchTermConsorcio] = useState("");
  const [searchTermCota, setSearchTermCota] = useState("");
  const [novoConsorcio, setNovoConsorcio] = useState({ nome: "", valor: "" });
  const [novaCota, setNovaCota] = useState({ nome: "", consorcioId: "" });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // --- Form Handlers ---
  const handleAddConsorcio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convertendo valor para Float, se necessário pela API
      await addConsorcio({ variables: { consorcioInput: {
        ...novoConsorcio,
        valor: parseFloat(novoConsorcio.valor.replace(/[^0-9,-]+/g,"").replace(",", ".")) || 0
      } } });
      setNovoConsorcio({ nome: "", valor: "" });
    } catch (err) {
      console.error("Erro ao adicionar consórcio:", err);
    }
  };

  const handleAddCota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCota.consorcioId) {
      alert("Por favor, selecione um consórcio.");
      return;
    }
    try {
      await addCota({ variables: { cotaInput: { nome: novaCota.nome, consorcioId: parseInt(novaCota.consorcioId) } } });
      setNovaCota({ nome: "", consorcioId: "" });
    } catch (err) {
      console.error("Erro ao adicionar cota:", err);
    }
  };
  
  // --- Filtering Logic ---
  const filteredConsorcios = consorciosData?.consorcios.filter((c: any) =>
    c.nome.toLowerCase().includes(searchTermConsorcio.toLowerCase())
  ) || [];
  
  const filteredCotas = cotasData?.cotas.filter((c: any) =>
    c.nome.toLowerCase().includes(searchTermCota.toLowerCase())
  ) || [];

  // --- Render Logic ---
  const backgroundStyle = {
    backgroundImage: "url('/topaz_bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  if (consorciosLoading || cotasLoading) {
    return <div className="flex justify-center items-center min-h-screen text-white" style={backgroundStyle}>Carregando...</div>;
  }

  if (consorciosError || cotasError) {
    console.error("GraphQL Error:", consorciosError || cotasError);
    return <div className="flex justify-center items-center min-h-screen text-white" style={backgroundStyle}>Erro ao carregar dados. Verifique o console.</div>;
  }

  // --- JSX Forms ---
  const formConsorcio = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Novo Consórcio</h3>
      <form onSubmit={handleAddConsorcio} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="consorcio-nome" className="block text-sm font-medium text-white/80">Nome</label>
          <input id="consorcio-nome" type="text" placeholder="Nome do Consórcio" required className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoConsorcio.nome} onChange={(e) => setNovoConsorcio({...novoConsorcio, nome: e.target.value})} />
        </div>
        <div className="flex-grow">
          <label htmlFor="consorcio-valor" className="block text-sm font-medium text-white/80">Valor do Bem</label>
          <input id="consorcio-valor" type="text" placeholder="R$ 100.000,00" required className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoConsorcio.valor} onChange={(e) => setNovoConsorcio({...novoConsorcio, valor: e.target.value})} />
        </div>
        <button type="submit" className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all self-end">Adicionar</button>
      </form>
    </>
  );
  
  const formCota = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Nova Cota</h3>
      <form onSubmit={handleAddCota} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="cota-nome" className="block text-sm font-medium text-white/80">Nome/Número</label>
          <input id="cota-nome" type="text" placeholder="Nome ou Nº da cota" required className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novaCota.nome} onChange={(e) => setNovaCota({...novaCota, nome: e.target.value})} />
        </div>
        <div className="flex-grow">
          <label htmlFor="cota-consorcio" className="block text-sm font-medium text-white/80">Consórcio</label>
          <select 
            id="cota-consorcio" 
            required 
            className="w-full p-2 bg-black/30 border border-white/20 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            value={novaCota.consorcioId} 
            onChange={(e) => setNovaCota({...novaCota, consorcioId: e.target.value})}
          >
            <option value="" disabled>Selecione um consórcio</option>
            {consorciosData?.consorcios.map((consorcio: any) => (
              <option key={consorcio.id} value={consorcio.id} className="bg-gray-800 text-white">
                {consorcio.nome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all self-end">Adicionar</button>
      </form>
    </>
  );

  return (
    <div className="p-8 min-h-screen text-white" style={backgroundStyle}>
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">Olá, {user?.nome || "Usuário"}!</span>
          <button
            onClick={handleLogout}
            className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EntitySection
          title="Consórcios"
          items={filteredConsorcios}
          searchTerm={searchTermConsorcio}
          onSearchChange={setSearchTermConsorcio}
          searchPlaceholder="Pesquisar consórcio..."
          renderItem={(item: any) => (
            <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
              <span>{item.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}</span>
              <button className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
            </li>
          )}
          form={formConsorcio}
        />

        <EntitySection
          title="Cotas"
          items={filteredCotas}
          searchTerm={searchTermCota}
          onSearchChange={setSearchTermCota}
          searchPlaceholder="Pesquisar cota..."
          renderItem={(item: any) => (
            <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
              <span>{item.nome} ({item.consorcio?.nome || 'Consórcio não encontrado'})</span>
              <button className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
            </li>
          )}
          form={formCota}
        />
      </main>
    </div>
  );
};

export default Dashboard;
