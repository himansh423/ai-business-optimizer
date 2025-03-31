import { createSlice } from "@reduxjs/toolkit";

interface EmailState {
  email: string;
}
const initialState: EmailState = {
  email: "",
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      const { data } = action.payload;
      state.email = data;
    },
  },
});

export const emailActions = emailSlice.actions;

export default emailSlice;
