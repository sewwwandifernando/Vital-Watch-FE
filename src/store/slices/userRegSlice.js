// userRegSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  registrationStatus: "idle", // Possible values: "idle", "loading", "succeeded", "failed"
  error: null,
};

const userRegSlice = createSlice({
  name: "userReg",
  initialState,
  reducers: {
    registrationPending: (state) => {
      state.registrationStatus = "loading";
      state.error = null;
    },
    registrationSuccess: (state) => {
      state.registrationStatus = "succeeded";
    },
    registrationFailed: (state, action) => {
      state.registrationStatus = "failed";
      state.error = action.payload;
    },
    resetRegistrationStatus: (state) => {
      state.registrationStatus = "idle";
      state.error = null;
    },
  },
});

export const {
  registrationPending,
  registrationSuccess,
  registrationFailed,
  resetRegistrationStatus,
} = userRegSlice.actions;

export default userRegSlice.reducer;
