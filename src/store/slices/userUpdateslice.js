import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: " idle",
    error : null,
}

export const userUpdatesSlice = createSlice({
  name: " userUpdate",
  initialState,
  reducers: {
    userUpdatePending: (state) => {
      state.status = "loading";
      state.error = null;
    },
    userUpdateSuccess: (state) => {
      state.status = "succeeded";
    },
    userUpdateFailed: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    resetUserUpdateStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  userUpdatePending,
  userUpdateSuccess,
  userUpdateFailed,
  resetUserUpdateStatus,
} = userUpdatesSlice.actions;

export default userUpdatesSlice.reducer;
