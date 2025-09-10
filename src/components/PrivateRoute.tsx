import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../app/store';

const PrivateRoute = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  // Verifica se o usuário está logado (pode ser baseado no user ou no token)
  const isAuthenticated = user && token;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
