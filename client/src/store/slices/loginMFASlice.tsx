import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userLoginMFA } from "../thunks/userLoginMFA";
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

const loginMFASlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetMFALogin: () => initialState,
    getMFALoginState:  (state) => state,
  },
  extraReducers(builder) {
    builder.addCase(userLoginMFA.pending, (state,) => {
      state.isLoading = true;
    });
    builder.addCase(userLoginMFA.fulfilled, (state, action: PayloadAction<LoginUser>) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(userLoginMFA.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});
export const { resetMFALogin,getMFALoginState } = loginMFASlice.actions; 
export const loginMFAReducer = loginMFASlice.reducer;