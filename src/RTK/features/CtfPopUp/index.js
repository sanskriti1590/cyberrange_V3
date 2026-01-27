// src/features/booleanSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const CtfSlice = createSlice({
  name: "boolean",
  initialState,
  reducers: {
    toggleValue: (state) => {
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

export const { toggleValue, setTrue, setFalse } = CtfSlice.actions;

export default CtfSlice.reducer;