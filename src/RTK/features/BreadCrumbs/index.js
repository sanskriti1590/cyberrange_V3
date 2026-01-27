// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   value: [{ name: 'Dashboard', link: '/' }],
// };

// const BreadCrumbsSlice = createSlice({
//     name:'breadcrumbs',
//     initialState,
//     addItem: (state, action) => {
//         state.value = action.payload
//       },
    
// })

// export const { addItem } = BreadCrumbsSlice.actions;

// export default BreadCrumbsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [{ name: 'Dashboard', link: '/' }],
};

const breadCrumbsSlice = createSlice({
  name: 'breadcrumbs',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addItem } = breadCrumbsSlice.actions;

export default breadCrumbsSlice.reducer;