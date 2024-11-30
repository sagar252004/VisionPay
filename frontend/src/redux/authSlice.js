import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
  },
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set user data
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // Update wallet balance
    updateWalletBalance: (state, action) => {
      if (state.user) {
        state.user.walletBalance = action.payload; // Update wallet balance in user data
      }
    },
  },
});

export const { setLoading, setUser, updateWalletBalance } = authSlice.actions;

export default authSlice.reducer;
