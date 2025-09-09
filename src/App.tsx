import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setCredentials, logout } from "./features/auth/authSlice";
// import { RootState } from "./app/store";
import "./App.css";
import Inicio from "./components/Inicio/Inicio";

// Dynamically import Login and Register components from authApp
const RemoteLoginApp = React.lazy(() => import("authApp/Login"));
const RemoteRegisterApp = React.lazy(() => import("authApp/Register"));

// Dynamically import Consorcio components from consorcioApp
const RemoteConsorcioList = React.lazy(
  () => import("consorcioApp/ConsorcioList")
);
const RemoteConsorcioCreate = React.lazy(
  () => import("consorcioApp/ConsorcioCreate")
);
const RemoteConsorcioEdit = React.lazy(
  () => import("consorcioApp/ConsorcioEdit")
);

// Dynamically import Cota components from cotasApp
const RemoteCotaList = React.lazy(() => import("cotasApp/CotaList"));
const RemoteCotaCreate = React.lazy(() => import("cotasApp/CotaCreate"));
const RemoteCotaEdit = React.lazy(() => import("cotasApp/CotaEdit"));

function App() {
  // const dispatch = useDispatch();
  // const { user, token } = useSelector((state: RootState) => state.auth);

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("jwt_token");
  //   if (storedToken) {
  //     const mockUser = {
  //       id: 0,
  //       nome: "Usuário Logado",
  //       email: "logged@example.com",
  //     }; // Substituir com dados reais
  //     dispatch(setCredentials({ token: storedToken, user: mockUser }));
  //   }
  // }, [dispatch]);

  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* A navegação agora está no componente Inicio */}
        </header>
        <main>
          <Suspense fallback={<div>Carregando...</div>}>
            <Routes>
              <Route path="/login" element={<RemoteLoginApp />} />
              <Route path="/register" element={<RemoteRegisterApp />} />
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
              <Route
                path="/"
                element={<Inicio />} // Home padrão
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
