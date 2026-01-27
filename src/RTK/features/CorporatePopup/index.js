// src/features/booleanSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const CorporateSlice = createSlice({
  name: "boolean",
  initialState,
  reducers: {
    toggleValue3: (state) => {
      state.value = !state.value;
    },
    setTrue: (state) => {
      state.value = true;
    },
    setFalse: (state) => {
      state.value = false;
    },
  },
});

export const { toggleValue3, setTrue, setFalse } = CorporateSlice.actions;

export default CorporateSlice.reducer;