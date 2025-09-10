import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gql, useQuery, useMutation } from '@apollo/client';
import { logout } from '../../features/auth/authSlice';
import { RootState } from '../../app/store';
import EntitySection from './EntitySection';
import EditModal from './EditModal';

// QUERIES
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
      consorcio
    }
  }
`;

// MUTATIONS
const CREATE_CONSORCIO = gql`
  mutation CreateConsorcio($consorcioInput: ConsorcioInput!) {
    createConsorcio(consorcioInput: $consorcioInput) { id }
  }
`;

const CREATE_COTA = gql`
  mutation CreateCota($cotaInput: CotaInput!) {
    createCota(cotaInput: $cotaInput) { id }
  }
`;

const UPDATE_CONSORCIO = gql`
  mutation UpdateConsorcio($updateConsorcioInput: ConsorcioUpdateInput!) {
    updateConsorcio(updateConsorcioInput: $updateConsorcioInput) {
      id
      nome
      valor
    }
  }
`;

const UPDATE_COTA = gql`
  mutation UpdateCota($updateCotaInput: CotaUpdateInput!) {
    updateCota(updateCotaInput: $updateCotaInput) {
      id
      nome
      consorcio
    }
  }
`;

const DELETE_CONSORCIO = gql`
  mutation DeleteConsorcio($id: ID!) {
    deleteConsorcio(id: $id)
  }
`;

const DELETE_COTA = gql`
  mutation DeleteCota($id: ID!) {
    deleteCota(id: $id)
  }
`;


const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // Data Fetching
  const { data: consorciosData, loading: consorciosLoading, error: consorciosError } = useQuery(GET_CONSORCIOS);
  const { data: cotasData, loading: cotasLoading, error: cotasError } = useQuery(GET_COTAS);

  // Mutations
  const commonMutationOptions = (entity: string) => ({
    refetchQueries: entity === 'consorcio' ? [{ query: GET_CONSORCIOS }] : [{ query: GET_COTAS }],
    onError: (err: any) => alert(`Erro: ${err.message}`),
  });

  const [createConsorcio, { loading: creatingConsorcio }] = useMutation(CREATE_CONSORCIO, commonMutationOptions('consorcio'));
  const [createCota, { loading: creatingCota }] = useMutation(CREATE_COTA, commonMutationOptions('cota'));
  const [deleteConsorcio] = useMutation(DELETE_CONSORCIO, commonMutationOptions('consorcio'));
  const [deleteCota] = useMutation(DELETE_COTA, commonMutationOptions('cota'));
  const [updateConsorcio, { loading: updatingConsorcio }] = useMutation(UPDATE_CONSORCIO, {
    ...commonMutationOptions('consorcio'),
    onCompleted: () => handleCloseModal(),
  });
  const [updateCota, { loading: updatingCota }] = useMutation(UPDATE_COTA, {
    ...commonMutationOptions('cota'),
    onCompleted: () => handleCloseModal(),
  });

  // State
  const [searchTermConsorcio, setSearchTermConsorcio] = useState('');
  const [searchTermCota, setSearchTermCota] = useState('');
  const [novoConsorcio, setNovoConsorcio] = useState({ nome: '', valor: '' });
  const [novaCota, setNovaCota] = useState({ nome: '', consorcioId: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  const handleAddConsorcio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoConsorcio.nome || !novoConsorcio.valor) return;
    await createConsorcio({ variables: { consorcioInput: novoConsorcio } });
    setNovoConsorcio({ nome: '', valor: '' });
  };

  const handleAddCota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCota.nome || !novaCota.consorcioId) return;
    await createCota({ variables: { cotaInput: { nome: novaCota.nome, consorcioId: parseInt(novaCota.consorcioId) } } });
    setNovaCota({ nome: '', consorcioId: '' });
  };

  const handleDelete = async (id: string, type: 'consorcio' | 'cota') => {
    const confirmation = window.confirm(`Tem certeza que deseja deletar este item?`);
    if (confirmation) {
      if (type === 'consorcio') {
        await deleteConsorcio({ variables: { id } });
      } else {
        await deleteCota({ variables: { id } });
      }
    }
  };
  
  const handleOpenModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, nome, valor, consorcio, __typename, ...rest } = editingItem; 

    if (__typename === 'ConsorcioOutput') {
        await updateConsorcio({ variables: { updateConsorcioInput: { id, nome, valor: valor.toString() } } });
    } else if (__typename === 'CotaOutput') {
        const consorcioId = consorciosData.consorcios.find((c:any) => c.nome === consorcio)?.id;
        if(!consorcioId) {
            alert('ID do consórcio não encontrado!');
            return;
        }
        await updateCota({ variables: { updateCotaInput: { id, nome, consorcioId } } });
    }
  };

  // Filtering
  const filteredConsorcios = consorciosData?.consorcios.filter((c: any) =>
    c.nome.toLowerCase().includes(searchTermConsorcio.toLowerCase())
  ) || [];
  const filteredCotas = cotasData?.cotas.filter((c: any) =>
    c.nome.toLowerCase().includes(searchTermCota.toLowerCase())
  ) || [];

  // Components
  const formConsorcio = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Novo Consórcio</h3>
      <form onSubmit={handleAddConsorcio} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="consorcio-nome" className="block text-sm font-medium text-white/80">Nome</label>
          <input id="consorcio-nome" type="text" placeholder="Nome do Consórcio" className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoConsorcio.nome} onChange={(e) => setNovoConsorcio({ ...novoConsorcio, nome: e.target.value })} />
        </div>
        <div className="flex-grow">
          <label htmlFor="consorcio-valor" className="block text-sm font-medium text-white/80">Valor do Bem</label>
          <input id="consorcio-valor" type="text" placeholder="R$ 0,00" className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novoConsorcio.valor} onChange={(e) => setNovoConsorcio({ ...novoConsorcio, valor: e.target.value })} />
        </div>
        <button type="submit" disabled={creatingConsorcio} className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all self-end disabled:opacity-50">
          {creatingConsorcio ? 'Adicionando...' : 'Adicionar'}
        </button>
      </form>
    </>
  );

  const formCota = (
    <>
      <h3 className="text-xl font-semibold mb-4">Adicionar Nova Cota</h3>
      <form onSubmit={handleAddCota} className="flex items-end space-x-4">
        <div className="flex-grow">
          <label htmlFor="cota-nome" className="block text-sm font-medium text-white/80">Nome/Número</label>
          <input id="cota-nome" type="text" placeholder="Nome ou Nº da cota" className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novaCota.nome} onChange={(e) => setNovaCota({ ...novaCota, nome: e.target.value })} />
        </div>
        <div className="flex-grow">
          <label htmlFor="cota-consorcio" className="block text-sm font-medium text-white/80">Consórcio</label>
          <select id="cota-consorcio" className="w-full p-2.5 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400" value={novaCota.consorcioId} onChange={(e) => setNovaCota({ ...novaCota, consorcioId: e.target.value })}>
            <option value="" disabled className="bg-gray-800">Selecione um Consórcio</option>
            {consorciosData?.consorcios.map((c: any) => <option key={c.id} value={c.id} className="bg-gray-800">{c.nome}</option>)}
          </select>
        </div>
        <button type="submit" disabled={creatingCota} className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all self-end disabled:opacity-50">
          {creatingCota ? 'Adicionando...' : 'Adicionar'}
        </button>
      </form>
    </>
  );

  const renderConsorcioContent = () => {
    if (consorciosLoading) return <p className="text-center text-white/80">Carregando consórcios...</p>;
    if (consorciosError) return <p className="text-center text-red-400">Erro: {consorciosError.message}</p>;
    return (
      <EntitySection
        title="Consórcios"
        items={filteredConsorcios}
        searchTerm={searchTermConsorcio}
        onSearchChange={setSearchTermConsorcio}
        searchPlaceholder="Pesquisar consórcio..."
        renderItem={(item: any) => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
            <span className="truncate" title={`${item.nome} - ${item.valor}`}>{item.nome} - {item.valor}</span>
            <div className="space-x-2 flex-shrink-0">
              <button onClick={() => handleOpenModal(item)} className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
              <button onClick={() => handleDelete(item.id, 'consorcio')} className="bg-red-500/80 text-white py-1 px-3 rounded-md hover:bg-red-600/80 border border-red-400/50 transition-all">Deletar</button>
            </div>
          </li>
        )}
        form={formConsorcio}
      />
    );
  };

  const renderCotaContent = () => {
    if (cotasLoading) return <p className="text-center text-white/80">Carregando cotas...</p>;
    if (cotasError) return <p className="text-center text-red-400">Erro: {cotasError.message}</p>;
    return (
      <EntitySection
        title="Cotas"
        items={filteredCotas}
        searchTerm={searchTermCota}
        onSearchChange={setSearchTermCota}
        searchPlaceholder="Pesquisar cota..."
        renderItem={(item: any) => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-white/10 rounded-md">
            <span className="truncate" title={`${item.nome} (${item.consorcio})`}>{item.nome} ({item.consorcio})</span>
            <div className="space-x-2 flex-shrink-0">
              <button onClick={() => handleOpenModal(item)} className="bg-blue-500/80 text-white py-1 px-3 rounded-md hover:bg-blue-600/80 border border-blue-400/50 transition-all">Editar</button>
              <button onClick={() => handleDelete(item.id, 'cota')} className="bg-red-500/80 text-white py-1 px-3 rounded-md hover:bg-red-600/80 border border-red-400/50 transition-all">Deletar</button>
            </div>
          </li>
        )}
        form={formCota}
      />
    );
  };
  
  const renderEditForm = () => {
    if (!editingItem) return null;

    const isConsorcio = editingItem.__typename === 'ConsorcioOutput';

    return (
        <form onSubmit={handleUpdate} className="space-y-4">
            {isConsorcio ? (
                <>
                    <div>
                        <label className="block text-sm font-medium text-white/80">Nome</label>
                        <input type="text" value={editingItem.nome} onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})} className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80">Valor</label>
                        <input type="text" value={editingItem.valor} onChange={(e) => setEditingItem({...editingItem, valor: e.target.value})} className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" />
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <label className="block text-sm font-medium text-white/80">Nome</label>
                        <input type="text" value={editingItem.nome} onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})} className="w-full p-2 bg-transparent border border-white/20 rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80">Consórcio</label>
                        <select value={consorciosData.consorcios.find((c:any) => c.nome === editingItem.consorcio)?.id || ''} onChange={(e) => setEditingItem({...editingItem, consorcio: consorciosData.consorcios.find((c:any) => c.id === e.target.value)?.nome})} className="w-full p-2.5 bg-transparent border border-white/20 rounded-md mt-1 appearance-none">
                            {consorciosData?.consorcios.map((c: any) => (
                                <option key={c.id} value={c.id} className="bg-gray-800">{c.nome}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}
            <button type="submit" disabled={updatingConsorcio || updatingCota} className="w-full bg-green-500/80 hover:bg-green-600/80 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50">
                {updatingConsorcio || updatingCota ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </form>
    );
  }

  return (
    <div
      className="p-8 min-h-screen text-white"
      style={{
        backgroundImage: "url('/topaz_bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg">Olá, {user?.nome || 'Usuário'}!</span>
          <button
            onClick={handleLogout}
            className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border border-red-400/50 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderConsorcioContent()}
        {renderCotaContent()}
      </main>
      
      <EditModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={`Editar ${editingItem?.__typename.replace('Output', '')}`}>
          {renderEditForm()}
      </EditModal>

    </div>
  );
};

export default Dashboard;
