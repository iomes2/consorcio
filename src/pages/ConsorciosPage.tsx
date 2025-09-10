import React, { useState } from 'react';
import EntitySection from '../components/Dashboard/EntitySection';
import EditModal from '../components/Dashboard/EditModal';

// Tipos e Mock Data
interface Consorcio {
  id: number;
  nome: string;
  valor: string;
}

const mockConsorcios: Consorcio[] = [
  { id: 1, nome: "Consórcio de Imóvel", valor: "R$ 300.000,00" },
  { id: 2, nome: "Consórcio de Veículo", valor: "R$ 80.000,00" },
  { id: 3, nome: "Consórcio de Serviço", valor: "R$ 15.000,00" },
];

const ConsorciosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [novoItem, setNovoItem] = useState({ nome: "", valor: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Consorcio | null>(null);

  const filteredItems = mockConsorcios.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers para Adição
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adicionar Consórcio:", novoItem);
    setNovoItem({ nome: "", valor: "" });
  };

  // Handlers para Edição/Exclusão
  const handleOpenEditModal = (item: Consorcio) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    console.log("Atualizar Consórcio:", editingItem);
    handleCloseModal();
  };

  const handleDeleteItem = () => {
    if (!editingItem) return;
    if (window.confirm(`Tem certeza que deseja excluir "${editingItem.nome}"?`)) {
      console.log("Excluir Consórcio ID:", editingItem.id);
      handleCloseModal();
    }
  };

  // JSX do Formulário de Adição
  const formConsorcio = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Novo Consórcio</h3>
      <form onSubmit={handleAddItem} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="consorcio-nome" className="block text-sm font-medium text-white/80">Nome</label>
          <input id="consorcio-nome" type="text" placeholder="Nome do Consórcio" required className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoItem.nome} onChange={(e) => setNovoItem({...novoItem, nome: e.target.value})} />
        </div>
        <div className="flex-grow">
          <label htmlFor="consorcio-valor" className="block text-sm font-medium text-white/80">Valor do Bem</label>
          <input id="consorcio-valor" type="text" placeholder="R$ 100.000,00" required className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoItem.valor} onChange={(e) => setNovoItem({...novoItem, valor: e.target.value})} />
        </div>
        <button type="submit" className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all self-end">Adicionar</button>
      </form>
    </>
  );

  return (
    <>
      <EntitySection
        title="Consórcios"
        items={filteredItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Pesquisar consórcio..."
        renderItem={(item: Consorcio) => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
            <span>{item.nome} - {item.valor}</span>
            <button onClick={() => handleOpenEditModal(item)} className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
          </li>
        )}
        form={formConsorcio}
      />

      <EditModal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar Consórcio">
        {editingItem && (
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-consorcio-nome" className="block text-sm font-medium text-white/80">Nome</label>
              <input id="edit-consorcio-nome" type="text" value={editingItem.nome} onChange={(e) => setEditingItem({ ...editingItem, nome: e.target.value })} className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" />
            </div>
            <div>
              <label htmlFor="edit-consorcio-valor" className="block text-sm font-medium text-white/80">Valor do Bem</label>
              <input id="edit-consorcio-valor" type="text" value={editingItem.valor} onChange={(e) => setEditingItem({ ...editingItem, valor: e.target.value })} className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" />
            </div>
            <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
              <button onClick={handleDeleteItem} className="bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-6 rounded-lg transition-all">Excluir</button>
              <button onClick={handleUpdateItem} className="bg-green-500/80 hover:bg-green-600/80 text-white font-bold py-2 px-6 rounded-lg transition-all">Salvar Alterações</button>
            </div>
          </div>
        )}
      </EditModal>
    </>
  );
};

export default ConsorciosPage;
