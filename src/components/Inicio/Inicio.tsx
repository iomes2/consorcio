import React from "react";
import "./Inicio.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { logout } from "../../features/auth/authSlice";

const Inicio = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="inicio-container">
      <header className="inicio-header">
        <div className="logo">
          <Link to="/">Consórcio-X</Link>
        </div>
        <nav>
          {!token ? (
            <>
              <Link to="/login" style={{ marginRight: "10px" }}>
                Login
              </Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: "10px" }}>
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
      </header>
      <main className="main-content">
        <div className="hero-section">
          <h1>Encontre o consórcio dos seus sonhos</h1>
          <p>A maneira mais inteligente de conquistar seus bens.</p>
          <Link to="/login" className="cta-button">
            Ver Planos
          </Link>
        </div>
      </main>
      <footer className="inicio-footer">
        <p>&copy; 2024 Consórcio-X. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Inicio;
