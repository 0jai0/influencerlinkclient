import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null, // Added for error tracking
  token: localStorage.getItem("token") || null,
};

const API_BASE_URL = "http://localhost:5000/api/pageowners"; // Change as needed

export const updateUser = createAsyncThunk(
  "/auth/updateUser", // You can modify this path to suit your endpoint
  async ({ userId, updateData }, { rejectWithValue }) => {
    console.log(userId, "hhj");
    try {
      const response = await axios.put(
        `${API_BASE_URL}/updateUser/${userId}`, // Update URL to match your API endpoint
        updateData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "User update failed");
    }
  }
);


// Register User
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register`, // Update URL here
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login` , // Update URL here
        formData,
        { withCredentials: true }
      );

      // Save token to localStorage with expiration
      const { token, expiresIn } = response.data;
      const expirationDate = new Date().getTime() + expiresIn * 100000; // expiresIn is in seconds
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationDate);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/logout`, // Update URL here
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// Check Auth
export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found in localStorage");
      return rejectWithValue("No token found");
    }

    try {
      console.log("Sending token:", token); // Debugging token
      const response = await axios.get(
        `${API_BASE_URL}/check-auth`, // Update URL here
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is sent correctly
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error during checkAuth:", error.response?.data); // Debugging error
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      return rejectWithValue(error.response?.data?.message || "Auth check failed");
    }
  }
);

// Refresh Token (Optional)
export const refreshAuthToken = createAsyncThunk(
  "/auth/refresh",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/refresh`, // Update URL here
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { newToken, expiresIn } = response.data;
      const expirationDate = new Date().getTime() + expiresIn * 1000;
      localStorage.setItem("token", newToken);
      localStorage.setItem("tokenExpiration", expirationDate);

      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      return rejectWithValue(error.response?.data?.message || "Token refresh failed");
    }
  }
);


// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;  // Assuming the response includes the updated user data
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

// Validate Token on App Load
export const validateAuthToken = () => (dispatch) => {
  const token = localStorage.getItem("token");
  const expiration = localStorage.getItem("tokenExpiration");

  if (token && expiration && new Date().getTime() < parseInt(expiration, 10)) {
    // Token is valid, dispatch checkAuth to sync state
    dispatch(checkAuth());
  } else {
    // Token is invalid or expired
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    dispatch(logout());
  }
};
