import React, { Suspense, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "./features/auth/authSlice";
import { RootState } from "./app/store";
import "./App.css";
// Importar o componente Dashboard
import Dashboard from "./components/Dashboard/Dashboard";
import Inicio from "./components/Inicio/Inicio"; // Re-importar Inicio

// Dynamically import Login and Register components from authApp
const RemoteLoginApp = React.lazy(() => import("authApp/Login"));
const RemoteRegisterApp = React.lazy(() => import("authApp/Register"));

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      const mockUser = {
        id: 0,
        nome: "Usuário Logado",
        email: "logged@example.com",
      };
      dispatch(setCredentials({ token: storedToken, user: mockUser }));
    }
  }, [dispatch]);

  // handleLogout e user foram movidos para Dashboard.tsx

  useEffect(() => {
    if (token) {
      if (location.pathname === "/login" || location.pathname === "/register") {
        navigate("/");
      }
    }
  }, [token, navigate, location.pathname]);

  return (
    <div className="App">
      <main>
        <Suspense fallback={<div>Carregando...</div>}>
          <Routes>
            {token ? (
              // Se o usuário está autenticado, renderiza o Dashboard
              <Route path="/*" element={<Dashboard />} />
            ) : (
              // Caso contrário, renderiza as rotas de login/registro
              <>
                <Route path="/login" element={<RemoteLoginApp />} />
                <Route path="/register" element={<RemoteRegisterApp />} />
                <Route path="/" element={<Inicio />} />
              </>
            )}
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
