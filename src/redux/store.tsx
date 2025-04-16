import { configureStore } from "@reduxjs/toolkit";
import emailSlice from "./emailSlice";
import forgotPasswordSlice from "./fogotPasswordSlice";
import businessSetupFormSlice from "./businessSetupFormSlice";

export const store = configureStore({
  reducer: {
    email: emailSlice.reducer,
    forgotPassword: forgotPasswordSlice.reducer,
    businessSetupForm:businessSetupFormSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
