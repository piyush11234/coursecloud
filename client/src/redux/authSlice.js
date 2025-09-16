import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload) {
        // Only update fields if they exist in payload
        state.user = action.payload.user || state.user;
        state.accessToken = action.payload.accessToken ?? state.accessToken;
        state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
