import { createSlice, createAsyncThunk,PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import config from '../../config';

interface AuthState {
  user: { id: number; name: string } | null;
  isAuthenticated: boolean; 
  token: string | null;
  loading: boolean;
  error: string | null;
}


const initialState: AuthState = {
  user: null,
 isAuthenticated:false,
  token: null,
  loading: false,
  error: null,
};


// Async thunk สำหรับ login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { user_national_id: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${config.API_URL}${config.API_LOGIN}`,
        credentials,
      );
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  },
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated=false;
      localStorage.setItem('token','');

    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated=true;
        localStorage.setItem("token", action.payload.token); 

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
  },
  
});

export const { logout,setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
