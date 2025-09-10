import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { login } from '../features/auth/authSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('leandro.diniz@topaz.com');
  const [senha, setSenha] = useState('1234');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, senha }))
      .unwrap()
      .then(() => {
        // A navegação acontece quando o login é bem-sucedido
        navigate('/', { replace: true });
      })
      .catch((err) => {
        // O erro já é tratado no slice, mas podemos logar se quisermos
        console.error("Falha no login:", err);
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: "url('/topaz_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/40 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/10">
        <h1 className="text-5xl font-bold mb-8 text-center">Topaz</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="seu.email@topaz.com"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-white/80">Senha</label>
            <input
              id="password"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full p-3 bg-transparent border border-white/20 rounded-md mt-1 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600/80 hover:bg-blue-700/80 backdrop-blur-sm border border-blue-400/50 text-white font-bold py-3 px-4 rounded-lg transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
