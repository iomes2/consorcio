import React, { Suspense } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";

// Importações dinâmicas dos microfrontends
const RemoteConsorcioList = React.lazy(
  () => import("consorcioApp/ConsorcioList")
);
const RemoteConsorcioCreate = React.lazy(
  () => import("consorcioApp/ConsorcioCreate")
);
const RemoteConsorcioEdit = React.lazy(
  () => import("consorcioApp/ConsorcioEdit")
);

const RemoteCotaList = React.lazy(() => import("cotasApp/CotaList"));
const RemoteCotaCreate = React.lazy(() => import("cotasApp/CotaCreate"));
const RemoteCotaEdit = React.lazy(() => import("cotasApp/CotaEdit"));

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center">
          <span>Olá, {user?.nome || "Usuário"}!</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Sair
          </button>
        </div>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Consórcios</h2>
          <p className="mb-4">Gerencie os consórcios existentes e adicione novos.</p>
          <div className="flex">
            <Link
              to="/consorcios"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Ver Consórcios
            </Link>
            <Link
              to="/consorcios/create"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Adicionar Consórcio
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Cotas</h2>
          <p className="mb-4">Gerencie as cotas dos consórcios.</p>
          <div className="flex">
            <Link
              to="/cotas"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Ver Cotas
            </Link>
            <Link
              to="/cotas/create"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Adicionar Cota
            </Link>
          </div>
        </div>
      </main>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/consorcios" element={<RemoteConsorcioList />} />
          <Route
            path="/consorcios/create"
            element={<RemoteConsorcioCreate />}
          />
          <Route
            path="/consorcios/edit/:id"
            element={<RemoteConsorcioEdit />}
          />
          <Route path="/cotas" element={<RemoteCotaList />} />
          <Route path="/cotas/create" element={<RemoteCotaCreate />} />
          <Route path="/cotas/edit/:id" element={<RemoteCotaEdit />} />
          <Route path="/" element={<></>} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default Dashboard;