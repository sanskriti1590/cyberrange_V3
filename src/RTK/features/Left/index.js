import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: true,
};

const LeftSlice = createSlice({
  name: "boolean",
  initialState,
  reducers: {
    toggleValue2: (state) => {
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

export const { toggleValue2, setTrue, setFalse } = LeftSlice.actions;

export default LeftSlice.reducer;