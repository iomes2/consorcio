import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { gql, useQuery, useMutation } from "@apollo/client";
import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";
import EntitySection from "./EntitySection";
import EditModal from "./EditModal";

// --------------------
// GraphQL Definitions
// --------------------
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    consorcios {
      id
      nome
      valorBem
    }
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

const UPDATE_CONSORCIO_MUTATION = gql`
  mutation UpdateConsorcio($id: ID!, $nome: String, $valorBem: String) {
    updateConsorcio(id: $id, nome: $nome, valorBem: $valorBem) {
      id
      nome
      valorBem
    }
  }
`;

const UPDATE_COTA_MUTATION = gql`
  mutation UpdateCota($id: ID!, $nome: String, $consorcioId: ID) {
    updateCota(id: $id, nome: $nome, consorcioId: $consorcioId) {
      id
      nome
      consorcio {
        id
        nome
      }
    }
  }
`;

const DELETE_CONSORCIO_MUTATION = gql`
  mutation DeleteConsorcio($id: ID!) {
    deleteConsorcio(id: $id)
  }
`;

const DELETE_COTA_MUTATION = gql`
  mutation DeleteCota($id: ID!) {
    deleteCota(id: $id)
  }
`;

// --------------------
// Component Types
// --------------------
interface Consorcio {
  id: string;
  nome: string;
  valorBem: string;
}

interface Cota {
  id: string;
  nome: string;
  consorcio: {
    id: string;
    nome: string;
  };
}

type EditableItem = Partial<Consorcio & Cota & { consorcioId: string }>;

// --------------------
// Component
// --------------------
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // Data Fetching
  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_DATA);
  
  // Mutations
  const [updateConsorcio, { loading: updatingConsorcio }] = useMutation(UPDATE_CONSORCIO_MUTATION);
  const [updateCota, { loading: updatingCota }] = useMutation(UPDATE_COTA_MUTATION);
  const [deleteConsorcio] = useMutation(DELETE_CONSORCIO_MUTATION);
  const [deleteCota] = useMutation(DELETE_COTA_MUTATION);

  // Component State
  const [searchTermConsorcio, setSearchTermConsorcio] = useState("");
  const [searchTermCota, setSearchTermCota] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isConsorcio = (item: any): item is Consorcio => item && typeof item.valorBem !== 'undefined';
  const mutationLoading = updatingConsorcio || updatingCota;

  // Data from GraphQL
  const consorcios: Consorcio[] = data?.consorcios || [];
  const cotas: Cota[] = data?.cotas || [];

  // Modal Handlers
  const handleOpenEditModal = (item: Consorcio | Cota) => {
    if ("consorcio" in item && item.consorcio) {
      setEditingItem({ ...item, consorcioId: item.consorcio.id });
    } else {
      setEditingItem(item);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // CRUD Handlers
  const handleUpdateItem = async () => {
    if (!editingItem || !editingItem.id) return;

    const variables = isConsorcio(editingItem)
      ? { id: editingItem.id, nome: editingItem.nome, valorBem: editingItem.valorBem }
      : { id: editingItem.id, nome: editingItem.nome, consorcioId: editingItem.consorcioId };

    const mutation = isConsorcio(editingItem) ? updateConsorcio : updateCota;

    try {
      await mutation({ variables });
      refetch(); // Re-fetch all data to update the UI
      handleCloseModal();
    } catch (e) {
      console.error("Falha ao atualizar o item:", e);
      alert("Ocorreu um erro ao salvar. Verifique o console.");
    }
  };

  const handleDeleteItem = async () => {
    if (!editingItem || !editingItem.id) return;
    if (window.confirm(`Tem certeza que deseja excluir "${editingItem.nome}"?`)) {
      const mutation = isConsorcio(editingItem) ? deleteConsorcio : deleteCota;
      try {
        await mutation({ variables: { id: editingItem.id } });
        refetch(); // Re-fetch all data
        handleCloseModal();
      } catch (e) {
        console.error("Falha ao excluir o item:", e);
        alert("Ocorreu um erro ao excluir. Verifique o console.");
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-white text-2xl">Carregando Dashboard...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-400 text-2xl">Erro ao carregar dados: {error.message}</div>;

  return (
    <div className="p-8 min-h-screen text-white" style={{ backgroundImage: "url('/topaz_bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
       <header className="flex justify-between items-center mb-10">
         <h1 className="text-4xl font-bold">Dashboard</h1>
         <div className="flex items-center space-x-4">
           <span className="text-lg">Olá, {user?.nome || "Usuário"}!</span>
           <button onClick={handleLogout} className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all">Sair</button>
         </div>
       </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EntitySection
          title="Consórcios"
          items={consorcios.filter(c => c.nome.toLowerCase().includes(searchTermConsorcio.toLowerCase()))}
          searchTerm={searchTermConsorcio}
          onSearchChange={setSearchTermConsorcio}
          searchPlaceholder="Pesquisar consórcio..."
          renderItem={(item) => (
            <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
              <span>{item.nome} - {item.valorBem}</span>
              <button onClick={() => handleOpenEditModal(item)} className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
            </li>
          )}
          form={null} // Passando null pois a adição não está implementada
        />
        <EntitySection
          title="Cotas"
          items={cotas.filter(c => c.nome.toLowerCase().includes(searchTermCota.toLowerCase()))}
          searchTerm={searchTermCota}
          onSearchChange={setSearchTermCota}
          searchPlaceholder="Pesquisar cota..."
          renderItem={(item) => (
            <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
              <span>{item.nome} ({item.consorcio.nome})</span>
              <button onClick={() => handleOpenEditModal(item)} className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
            </li>
          )}
          form={null} // Passando null pois a adição não está implementada
        />
      </main>

      <EditModal isOpen={isModalOpen} onClose={handleCloseModal} title={`Editar ${isConsorcio(editingItem) ? 'Consórcio' : 'Cota'}`}>
        {editingItem && (
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-item-name" className="block text-sm font-medium text-white/80">Nome</label>
              <input id="edit-item-name" type="text" value={editingItem.nome || ''} onChange={(e) => setEditingItem({ ...editingItem, nome: e.target.value })} className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" />
            </div>

            {isConsorcio(editingItem) && (
              <div>
                <label htmlFor="edit-consorcio-valor" className="block text-sm font-medium text-white/80">Valor do Bem</label>
                <input id="edit-consorcio-valor" type="text" value={editingItem.valorBem || ''} onChange={(e) => setEditingItem({ ...editingItem, valorBem: e.target.value })} className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" />
              </div>
            )}

            {!isConsorcio(editingItem) && (
              <div>
                <label htmlFor="edit-cota-consorcio" className="block text-sm font-medium text-white/80">Consórcio</label>
                <select id="edit-cota-consorcio" value={editingItem.consorcioId || ''} onChange={(e) => setEditingItem({ ...editingItem, consorcioId: e.target.value })} className="w-full p-2 bg-gray-800 border border-white/20 rounded-md mt-1 text-white">
                  <option value="" disabled>Selecione um consórcio</option>
                  {consorcios.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
              <button onClick={handleDeleteItem} disabled={mutationLoading} className="bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50">Excluir</button>
              <button onClick={handleUpdateItem} disabled={mutationLoading} className="bg-green-500/80 hover:bg-green-600/80 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50">
                {mutationLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        )}
      </EditModal>
    </div>
  );
};

export default Dashboard;
