import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/Layout/MainLayout";
import ConsorciosPage from "./pages/ConsorciosPage";
import CotasPage from "./pages/CotasPage";
import React, { Suspense } from "react";
import { useSelector } from "react-redux"; // Importar useSelector
import { RootState } from "./app/store"; // Importar RootState
import Inicio from "./components/Inicio/Inicio"; // Importar o componente Inicio

// Importação dinâmica do componente Login e Register do auth-app
const RemoteLoginApp = React.lazy(() => import("authApp/Login"));
const RemoteRegisterApp = React.lazy(() => import("authApp/Register")); // Adicionar importação dinâmica para Register

function App() {
  const { token } = useSelector((state: RootState) => state.auth); // Obter o token do estado

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<div>Carregando Login...</div>}>
            <RemoteLoginApp />
          </Suspense>
        }
      />
      {/* Rota pública para o registro */}
      <Route
        path="/register"
        element={
          <Suspense fallback={<div>Carregando Registro...</div>}>
            <RemoteRegisterApp />
          </Suspense>
        }
      />
      {/* Rota pública para a página inicial */}
      {!token && <Route path="/" element={<Inicio />} />}

      {/* Rotas Privadas aninhadas sob o PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          {/* Rota inicial padrão para usuários logados */}
          <Route path="/" element={<Navigate to="/consorcios" replace />} />
          <Route path="/consorcios" element={<ConsorciosPage />} />
          <Route path="/cotas" element={<CotasPage />} />
          {/* Futuras rotas (ex: /usuarios) podem ser adicionadas aqui */}
        </Route>
      </Route>

      {/* Redireciona qualquer outra rota não encontrada para a página inicial (se não logado) ou para /consorcios (se logado) */}
      <Route
        path="*"
        element={token ? <Navigate to="/consorcios" /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
