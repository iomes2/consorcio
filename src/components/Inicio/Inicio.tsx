import React, { Suspense, useEffect } from "react";
import "./Inicio.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";

const Inicio = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      const mockUser = {
        id: 0,
        nome: "Usuário Logado",
        email: "logged@example.com",
      }; // Substituir com dados reais
      dispatch(setCredentials({ token: storedToken, user: mockUser }));
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main className="main">
      <div className="background">
        <h1>O consórcio perfeito para você</h1>
        {/* <img src="/topaz_bg.jpg" alt="bg" className="bg-main"/> */}
      </div>
      <div>
        <nav>
          {!token ? (
            <>
              <Link to="/login" style={{ marginRight: "10px"}}>
                Login
              </Link>
              <Link to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: "10px"}}>
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
      </div>
    </main>
  );
};

export default Inicio;
