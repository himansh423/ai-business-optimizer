import { createSlice } from "@reduxjs/toolkit";

interface BusinessSetupFormState {
  businessCategories: string[];
  businessTags: string[];
  orderingPlatforms: string[];
  date: string | undefined;
  selectedCountryCode: string;

}
const initialState: BusinessSetupFormState = {
  businessCategories: [],
  businessTags: [],
  orderingPlatforms: [],
  date: undefined,
  selectedCountryCode: "+1",
  
};
const businessSetupFormSlice = createSlice({
  name: "businessSetupForm",
  initialState,
  reducers: {
    setBusinessCategories: (state, action) => {
      const { data } = action.payload;
      state.businessCategories = data;
    },
    setBusinessTags: (state, action) => {
      const { data } = action.payload;
      state.businessTags = data;
    },
    setOrderingPlatforms: (state, action) => {
      const { data } = action.payload;
      state.orderingPlatforms = data;
    },
    setDate: (state, action) => {
      const { data } = action.payload;
      state.date = data;
    },
    setSelectedCountryCode: (state, action) => {
      const { data } = action.payload;
      state.selectedCountryCode = data;
    },
    
  },
});

export const businessSetupFormAction = businessSetupFormSlice.actions;

export default businessSetupFormSlice;
