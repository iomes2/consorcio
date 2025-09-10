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
      {/* <header className="App-header">
        <nav>
          {!token ? (
            <>
              <Link to="/login" style={{ marginRight: "10px", color: "white" }}>
                Login
              </Link>
              <Link to="/register" style={{ color: "white" }}>
                Register
              </Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: "10px", color: "white" }}>
                Olá, {user?.nome || "Usuário"}!
              </span>
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
                style={{
                  marginLeft: "20px",
                  marginRight: "10px",
                  color: "white",
                }}
              >
                Listar Consórcios
              </Link>
              <Link
                to="/consorcios/create"
                style={{ marginRight: "10px", color: "white" }}
              >
                Criar Consórcio
              </Link>
              <Link to="/consorcios/edit/1" style={{ color: "white" }}>
                Editar Consórcio (ID 1)
              </Link>
              <Link
                to="/cotas"
                style={{
                  marginLeft: "20px",
                  marginRight: "10px",
                  color: "white",
                }}
              >
                Listar Cotas
              </Link>
              <Link
                to="/cotas/create"
                style={{ marginRight: "10px", color: "white" }}
              >
                Criar Cota
              </Link>
              <Link to="/cotas/edit/1" style={{ color: "white" }}>
                Editar Cota (ID 1)
              </Link>
            </>
          )}
        </nav>
      </header> */}
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
