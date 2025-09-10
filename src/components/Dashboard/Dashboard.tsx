import React, { Suspense } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";
import "./Dashboard.css"; // Você pode criar um arquivo CSS para o dashboard

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
  const { user, token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container-dashboard">
      <div className="App-header">
        <div className="section-dashboard">testo</div>
        <div className="options">
          <span>Olá, {user?.nome || "Usuário"}!</span>
          <button
            onClick={handleLogout}
            style={{
              color: "white",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
          <Link
            to="/consorcios"
          >
            Listar Consórcios
          </Link>
          <Link
            to="/consorcios/create"
          >
            Criar Consórcio
          </Link>
          <Link to="/consorcios/edit/1">
            Editar Consórcio (ID 1)
          </Link>
          <Link
            to="/cotas"
          >
            Listar Cotas
          </Link>
          <Link
            to="/cotas/create"
          >
            Criar Cota
          </Link>
          <Link to="/cotas/edit/1">
            Editar Cota (ID 1)
          </Link>
        </div>
      </div>
      <main>
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
            <Route path="/" element={<h2>Bem-vindo ao Dashboard!</h2>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default Dashboard;
