// src/features/booleanSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const ScenarioSlice = createSlice({
  name: "boolean",
  initialState,
  reducers: {
    toggleValue1: (state) => {
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

export const { toggleValue1, setTrue, setFalse } = ScenarioSlice.actions;

export default ScenarioSlice.reducer;