// src/features/booleanSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

const WebScenarioSlice = createSlice({
  name: "boolean",
  initialState,
  reducers: {
    toggleValue4: (state) => {
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

export const { toggleValue4, setTrue, setFalse } = WebScenarioSlice.actions;

export default WebScenarioSlice.reducer;
