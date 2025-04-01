import { configureStore } from "@reduxjs/toolkit";
import emailSlice from "./emailSlice";
import forgotPasswordSlice from "./fogotPasswordSlice";

export const store = configureStore({
  reducer: {
    email: emailSlice.reducer,
    forgotPassword: forgotPasswordSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
