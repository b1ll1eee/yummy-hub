import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLogin } from "../thunks/userLogin";
import { LoginUser } from '../../Model/User'

interface LoginState {
  user: null | LoginUser;
  isLoading: boolean;
  error: null | any; 
}

const initialState: LoginState = {
  user: null,
  isLoading: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetLogin: () => initialState,
    getLoginState:  (state) => state,
  },
  extraReducers(builder) {
    builder.addCase(userLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action: PayloadAction<LoginUser>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(userLogin.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});
export const { resetLogin,getLoginState } = loginSlice.actions; 
export const loginReducer = loginSlice.reducer;