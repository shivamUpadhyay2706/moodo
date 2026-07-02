import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('moodo_token');
const userJson = localStorage.getItem('moodo_user');
let user = null;

if (userJson) {
  try {
    user = JSON.parse(userJson);
  } catch (e) {
    localStorage.removeItem('moodo_user');
  }
}

const initialState = {
  isAuthenticated: !!token,
  token: token || null,
  user: user || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('moodo_token', token);
      localStorage.setItem('moodo_user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('moodo_token');
      localStorage.removeItem('moodo_user');
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
