import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    frontAccessToken: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setFrontAccessToken: (state, action) => {
      state.frontAccessToken = action.payload;
    },
  },
});

export const { setAccessToken, setFrontAccessToken } = authSlice.actions;

export default authSlice.reducer;
