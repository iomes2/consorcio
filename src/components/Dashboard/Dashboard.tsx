import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";
import EntitySection from "./EntitySection";
import EditModal from "./EditModal";

// Tipos para os dados mocados
interface Consorcio {
  id: number;
  nome: string;
  valor: string;
}

interface Cota {
  id: number;
  nome: string;
  consorcio: string;
}

// Mock data
const mockConsorcios: Consorcio[] = [
  { id: 1, nome: "Consórcio de Imóvel", valor: "R$ 300.000,00" },
  { id: 2, nome: "Consórcio de Veículo", valor: "R$ 80.000,00" },
  { id: 3, nome: "Consórcio de Serviço", valor: "R$ 15.000,00" },
];

const mockCotas: Cota[] = [
  { id: 1, nome: "Cota #101 - Imóvel", consorcio: "Consórcio de Imóvel" },
  { id: 2, nome: "Cota #205 - Veículo", consorcio: "Consórcio de Veículo" },
];

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // Estados para pesquisa e formulários de adição
  const [searchTermConsorcio, setSearchTermConsorcio] = useState("");
  const [searchTermCota, setSearchTermCota] = useState("");
  const [novoConsorcio, setNovoConsorcio] = useState({ nome: "", valor: "" });
  const [novaCota, setNovaCota] = useState({ nome: "", consorcioId: "" });

  // Estados para o Modal de Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Consorcio | Cota | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Lógica de filtro
  const filteredConsorcios = mockConsorcios.filter((c) =>
    c.nome.toLowerCase().includes(searchTermConsorcio.toLowerCase())
  );
  const filteredCotas = mockCotas.filter((c) =>
    c.nome.toLowerCase().includes(searchTermCota.toLowerCase())
  );

  // Manipuladores de formulário de ADIÇÃO (com console.log)
  const handleAddConsorcio = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados para ADICIONAR Consórcio:", novoConsorcio);
    // Aqui você conectaria sua mutation de criação
    setNovoConsorcio({ nome: "", valor: "" });
  };

  const handleAddCota = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados para ADICIONAR Cota:", novaCota);
    // Aqui você conectaria sua mutation de criação
    setNovaCota({ nome: "", consorcioId: "" });
  };

  // Manipuladores para o modal de EDIÇÃO (com console.log)
  const handleOpenEditModal = (item: Consorcio | Cota) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    console.log("Dados para ATUALIZAR item:", editingItem);
    // Aqui você conectaria sua mutation de atualização
    handleCloseModal();
  };

  const handleDeleteItem = () => {
    if (!editingItem) return;
    if (window.confirm(`Tem certeza que deseja excluir "${editingItem.nome}"?`)) {
      console.log("ID para DELETAR item:", editingItem.id);
      // Aqui você conectaria sua mutation de exclusão
      handleCloseModal();
    }
  };
  
  // Função para saber se o item é um Consórcio
  const isConsorcio = (item: any): item is Consorcio => item && typeof item.valor !== 'undefined';

  // Formulários de Adição
  const formConsorcio = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Novo Consórcio</h3>
      <form onSubmit={handleAddConsorcio} className="flex items-end space-x-4">
        {/* ... campos do form ... */}
      </form>
    </>
  );
  
  const formCota = (
        <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Nova Cota</h3>
      <form onSubmit={handleAddCota} className="flex items-end space-x-4">
        {/* ... campos do form ... */}
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
              <button onClick={() => handleOpenEditModal(item)} className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
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
              <button onClick={() => handleOpenEditModal(item)} className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
            </li>
          )}
          form={formCota}
        />
      </main>

      {/* Modal de Edição */}
      <EditModal isOpen={isModalOpen} onClose={handleCloseModal} title={`Editar ${isConsorcio(editingItem) ? 'Consórcio' : 'Cota'}`}>
        {editingItem && (
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-item-name" className="block text-sm font-medium text-white/80">Nome</label>
              <input 
                id="edit-item-name" 
                type="text" 
                value={editingItem.nome} 
                onChange={(e) => setEditingItem({ ...editingItem, nome: e.target.value })} 
                className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" 
              />
            </div>

            {/* Campo extra se for um Consórcio */}
            {isConsorcio(editingItem) && (
              <div>
                <label htmlFor="edit-consorcio-valor" className="block text-sm font-medium text-white/80">Valor do Bem</label>
                <input 
                  id="edit-consorcio-valor" 
                  type="text" 
                  value={editingItem.valor} 
                  onChange={(e) => setEditingItem({ ...editingItem, valor: e.target.value })} 
                  className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" 
                />
              </div>
            )}

            {/* Campo extra se for uma Cota */}
            {!isConsorcio(editingItem) && (
                 <div>
                 <label htmlFor="edit-cota-consorcio" className="block text-sm font-medium text-white/80">Consórcio</label>
                 <input 
                   id="edit-cota-consorcio" 
                   type="text" 
                   value={(editingItem as Cota).consorcio}
                   // Idealmente, este seria um <select> populado com os consórcios
                   onChange={(e) => setEditingItem({ ...editingItem, consorcio: e.target.value })}
                   className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" 
                 />
               </div>
            )}

            <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
              <button onClick={handleDeleteItem} className="bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-6 rounded-lg transition-all">Excluir</button>
              <button onClick={handleUpdateItem} className="bg-green-500/80 hover:bg-green-600/80 text-white font-bold py-2 px-6 rounded-lg transition-all">Salvar Alterações</button>
            </div>
          </div>
        )}
      </EditModal>

    </div>
  );
};

export default Dashboard;
