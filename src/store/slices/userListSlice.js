// userListSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

export const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    getAllUsers: (state, action) => {
      state.users = action.payload;
    },
    deleteUser: (state, action) => {
      // Filter out the user with the specified ID
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    getAlluserMatrices:(state, action) => {
      state.patient = action.payload;
    }
  },
});

export const { getAllUsers, deleteUser ,getAlluserMatrices} = userListSlice.actions;
export default userListSlice.reducer;
