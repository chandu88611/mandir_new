import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null, // Single field to store the entire user object
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload; // Store the entire user object
    },
    clearUserData: (state) => {
      state.userData = null; // Clear the user data when needed
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;
