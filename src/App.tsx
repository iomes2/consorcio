import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';
import ConsorciosPage from './pages/ConsorciosPage';
import CotasPage from './pages/CotasPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
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

        {/* Redireciona qualquer outra rota não encontrada para a página inicial */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
