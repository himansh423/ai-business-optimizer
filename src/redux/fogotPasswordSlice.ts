import { createSlice } from "@reduxjs/toolkit";

interface ForgotPasswordState {
  message: string;
  showPassword: boolean;
  resetMessage:string;
}

const initialState: ForgotPasswordState = {
  message: "",
  showPassword: false,
  resetMessage:""
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setMessage: (state, actions) => {
      const { data } = actions.payload;
      state.message = data;
    },
    setShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    setResetMessage: (state,actions) => {
      const {data} = actions.payload;
      state.resetMessage = data;
    }
  },
});

export const forgotPasswordAction = forgotPasswordSlice.actions;

export default forgotPasswordSlice;
