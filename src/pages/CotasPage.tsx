import React, { useState } from 'react';
import EntitySection from '../components/Dashboard/EntitySection';
import EditModal from '../components/Dashboard/EditModal';

// Tipos e Mock Data
interface Cota {
  id: number;
  nome: string;
  consorcio: string;
  consorcioId?: number;
}

interface Consorcio {
    id: number;
    nome: string;
    valor: string;
}

const mockCotas: Cota[] = [
  { id: 1, nome: "Cota #101 - Imóvel", consorcio: "Consórcio de Imóvel", consorcioId: 1 },
  { id: 2, nome: "Cota #205 - Veículo", consorcio: "Consórcio de Veículo", consorcioId: 2 },
];

// Consórcios são necessários para o dropdown
const mockConsorcios: Consorcio[] = [
    { id: 1, nome: "Consórcio de Imóvel", valor: "R$ 300.000,00" },
    { id: 2, nome: "Consórcio de Veículo", valor: "R$ 80.000,00" },
    { id: 3, nome: "Consórcio de Serviço", valor: "R$ 15.000,00" },
  ];

const CotasPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [novoItem, setNovoItem] = useState({ nome: "", consorcioId: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cota | null>(null);

  const filteredItems = mockCotas.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adicionar Cota:", novoItem);
    setNovoItem({ nome: "", consorcioId: "" });
  };

  const handleOpenEditModal = (item: Cota) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    console.log("Atualizar Cota:", editingItem);
    handleCloseModal();
  };

  const handleDeleteItem = () => {
    if (!editingItem) return;
    if (window.confirm(`Tem certeza que deseja excluir "${editingItem.nome}"?`)) {
      console.log("Excluir Cota ID:", editingItem.id);
      handleCloseModal();
    }
  };

  // Formulário de Adição
  const formCota = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Nova Cota</h3>
      <form onSubmit={handleAddItem} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="cota-nome" className="block text-sm font-medium text-white/80">Nome/Número</label>
          <input id="cota-nome" type="text" placeholder="Nome ou Nº da cota" required className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoItem.nome} onChange={(e) => setNovoItem({...novoItem, nome: e.target.value})} />
        </div>
        <div className="flex-grow">
          <label htmlFor="cota-consorcio-select" className="block text-sm font-medium text-white/80">Consórcio</label>
          <select id="cota-consorcio-select" required className="w-full p-2 bg-black/30 border border-white/20 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoItem.consorcioId} onChange={(e) => setNovoItem({...novoItem, consorcioId: e.target.value})}>
            <option value="" disabled>Selecione...</option>
            {mockConsorcios.map(c => <option key={c.id} value={c.id} className="bg-gray-800 text-white">{c.nome}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all self-end">Adicionar</button>
      </form>
    </>
  );

  return (
    <>
      <EntitySection
        title="Cotas"
        items={filteredItems}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Pesquisar cota..."
        renderItem={(item: Cota) => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
            <span>{item.nome} ({item.consorcio})</span>
            <button onClick={() => handleOpenEditModal(item)} className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
          </li>
        )}
        form={formCota}
      />

      <EditModal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar Cota">
        {editingItem && (
            <div className="space-y-4">
                <div>
                    <label htmlFor="edit-cota-nome" className="block text-sm font-medium text-white/80">Nome</label>
                    <input id="edit-cota-nome" type="text" value={editingItem.nome} onChange={(e) => setEditingItem({ ...editingItem, nome: e.target.value })} className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" />
                </div>
                <div>
                    <label htmlFor="edit-cota-consorcio" className="block text-sm font-medium text-white/80">Consórcio</label>
                    <select 
                        id="edit-cota-consorcio" 
                        className="w-full p-2 bg-black/30 border border-white/20 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        value={editingItem.consorcioId}
                        onChange={(e) => setEditingItem({...editingItem, consorcioId: parseInt(e.target.value), consorcio: mockConsorcios.find(c => c.id === parseInt(e.target.value))?.nome || ''})}
                    >
                        {mockConsorcios.map(c => <option key={c.id} value={c.id} className="bg-gray-800 text-white">{c.nome}</option>)}
                    </select>
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

export default CotasPage;
