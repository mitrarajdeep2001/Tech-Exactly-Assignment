import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "ADMIN" | "USER";

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  username: string;
  notificationCount: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Start async auth action
    authStart(state) {
      state.loading = true;
      state.error = null;
    },

    // Login success
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) {
      state.user = {
        _id: action.payload.user._id,
        email: action.payload.user.email,
        role: action.payload.user.role.toUpperCase() as UserRole, // 👈 normalize
        username: action.payload.user.username,
        notificationCount: action.payload.user.notificationCount,
      };
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
    },

    // Auth failure
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Logout
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { authStart, loginSuccess, authFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
