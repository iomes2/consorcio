import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { RootState } from '../../app/store';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Estilo para o NavLink ativo
  const activeLinkStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(96, 165, 250, 0.8)',
  };

  return (
    <div
      className="min-h-screen text-white flex"
      style={{
        backgroundImage: "url('/topaz_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-black/30 backdrop-blur-lg p-6 flex flex-col border-r border-white/10">
        <h1 className="text-3xl font-bold mb-10 text-center">Topaz</h1>
        <nav className="flex flex-col space-y-4">
          <NavLink 
            to="/consorcios" 
            className="px-4 py-3 rounded-lg border border-transparent transition-all hover:bg-white/10"
            style={({ isActive }) => isActive ? activeLinkStyle : {}}
           >
            Consórcios
          </NavLink>
          <NavLink 
            to="/cotas" 
            className="px-4 py-3 rounded-lg border border-transparent transition-all hover:bg-white/10"
            style={({ isActive }) => isActive ? activeLinkStyle : {}}
          >
            Cotas
          </NavLink>
           {/* Adicionar link para Usuários aqui no futuro */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center p-6 bg-black/10 backdrop-blur-sm border-b border-white/10">
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

        {/* Page Content Rendered Here */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
