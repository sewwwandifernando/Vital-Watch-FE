// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: {
    name: '',
    role: 1,
    token: localStorage.getItem('token') || null,
  },
  // userRole: '', // Initialize with an empty string
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      // Update isAuthenticated to true when the user logs in
      // state.isAuthenticated = true;
      // Set the user role based on the action payload
      // state.userRole = action.payload;
      state.user = action.payload
    },
    // logout: (state) => {
    //   // Clear authentication and user role when the user logs out
    //   state.isAuthenticated = false;
    //   state.userRole = '';
    // },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

// Export the action creators
export const { setCurrentUser,setToken,clearToken  } = authSlice.actions;

export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;
