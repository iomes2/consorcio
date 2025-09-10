import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";
import EntitySection from "./EntitySection"; // Importando o componente reutilizável

// Mock data
const mockConsorcios = [
  { id: 1, nome: "Consórcio de Imóvel", valor: "R$ 300.000,00" },
  { id: 2, nome: "Consórcio de Veículo", valor: "R$ 80.000,00" },
  { id: 3, nome: "Consórcio de Serviço", valor: "R$ 15.000,00" },
];

const mockCotas = [
  { id: 1, nome: "Cota #101 - Imóvel", consorcio: "Consórcio de Imóvel" },
  { id: 2, nome: "Cota #205 - Veículo", consorcio: "Consórcio de Veículo" },
];

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // Estados para a pesquisa
  const [searchTermConsorcio, setSearchTermConsorcio] = useState("");
  const [searchTermCota, setSearchTermCota] = useState("");

  // Estados para os formulários de adição
  const [novoConsorcio, setNovoConsorcio] = useState({ nome: "", valor: "" });
  const [novaCota, setNovaCota] = useState({ nome: "", consorcioId: "" });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Lógica de filtro
  const filteredConsorcios = mockConsorcios.filter((c) =>
    c.nome.toLowerCase().includes(searchTermConsorcio.toLowerCase())
  );
  const filteredCotas = mockCotas.filter((c) =>
    c.nome.toLowerCase().includes(searchTermCota.toLowerCase())
  );

  // Manipuladores de formulário
  const handleAddConsorcio = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adicionando Consórcio:", novoConsorcio);
    setNovoConsorcio({ nome: "", valor: "" });
  };

  const handleAddCota = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adicionando Cota:", novaCota);
    setNovaCota({ nome: "", consorcioId: "" });
  };

  // Formulário de Consórcio como um JSX Element
  const formConsorcio = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Novo Consórcio</h3>
      <form onSubmit={handleAddConsorcio} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="consorcio-nome" className="block text-sm font-medium text-white/80">Nome</label>
          <input id="consorcio-nome" type="text" placeholder="Nome do Consórcio" className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoConsorcio.nome} onChange={(e) => setNovoConsorcio({...novoConsorcio, nome: e.target.value})} />
        </div>
        <div className="flex-grow">
          <label htmlFor="consorcio-valor" className="block text-sm font-medium text-white/80">Valor do Bem</label>
          <input id="consorcio-valor" type="text" placeholder="R$ 0,00" className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoConsorcio.valor} onChange={(e) => setNovoConsorcio({...novoConsorcio, valor: e.target.value})} />
        </div>
        <button type="submit" className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all self-end">Adicionar</button>
      </form>
    </>
  );
  
  // Formulário de Cota como um JSX Element
  const formCota = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Nova Cota</h3>
      <form onSubmit={handleAddCota} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="cota-nome" className="block text-sm font-medium text-white/80">Nome/Número</label>
          <input id="cota-nome" type="text" placeholder="Nome ou Nº da cota" className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novaCota.nome} onChange={(e) => setNovaCota({...novaCota, nome: e.target.value})} />
        </div>
        <div className="flex-grow">
          <label htmlFor="cota-consorcio" className="block text-sm font-medium text-white/80">ID do Consórcio</label>
          <input id="cota-consorcio" type="text" placeholder="ID do Consórcio" className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novaCota.consorcioId} onChange={(e) => setNovaCota({...novaCota, consorcioId: e.target.value})} />
        </div>
        <button type="submit" className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all self-end">Adicionar</button>
      </form>
    </>
  );

  return (
    <div
      className="p-8 min-h-screen text-white"
      style={{
        backgroundImage: "url('/topaz_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
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
          renderItem={(item) => (
            <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
              <span>{item.nome} - {item.valor}</span>
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
          renderItem={(item) => (
            <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
              <span>{item.nome} ({item.consorcio})</span>
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
