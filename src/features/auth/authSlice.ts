import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Definição das interfaces
interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Helper para pegar o usuário do localStorage de forma segura
const getUserFromStorage = (): User | null => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      return JSON.parse(userString);
    } catch (e) {
      console.error("Falha ao analisar o usuário do localStorage", e);
      localStorage.removeItem('user'); // Limpa o dado corrompido
      return null;
    }
  }
  return null;
};

// Estado inicial
const initialState: AuthState = {
  token: localStorage.getItem('jwt_token'),
  user: getUserFromStorage(), // Pega o usuário do localStorage
  loading: false,
  error: null,
};

// Async Thunk para o Login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; senha: string }, { rejectWithValue }) => {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === 'leandro.diniz@topaz.com' && credentials.senha === '1234') {
      const mockUser: User = { id: 1, nome: 'Leandro Diniz', email: 'leandro.diniz@topaz.com' };
      const mockToken = 'fake-jwt-token-topaz-challenge';
      return { token: mockToken, user: mockUser };
    } else {
      return rejectWithValue('Credenciais inválidas. Tente novamente.');
    }
  }
);

// Criação do Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user'); // Remove o usuário do storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('jwt_token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Salva o usuário no storage
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
