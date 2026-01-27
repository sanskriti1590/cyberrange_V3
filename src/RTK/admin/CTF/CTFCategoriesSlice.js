import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getCTFCategories} from "../../../APIConfig/adminConfig";

export const CTF_CATEGORIES_GET_STATUSES = Object.freeze({
  IDLE: 'idle',
  ERROR: 'error',
  LOADING: 'loading',
});

const initialState = {
  CTFCategoriesData: [],
  CTFCategoriesDataGetStatus: CTF_CATEGORIES_GET_STATUSES.IDLE,
};

export const CTFCategoriesSlice = createSlice({
  name: 'CTFCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // For CTF categories data fetching
      .addCase(CTFCategoriesDataGet.pending, (state, action) => {
        state.CTFCategoriesDataGetStatus = CTF_CATEGORIES_GET_STATUSES.LOADING;
      })
      .addCase(CTFCategoriesDataGet.fulfilled, (state, action) => {
        state.CTFCategoriesData = action.payload;
        state.CTFCategoriesDataGetStatus = CTF_CATEGORIES_GET_STATUSES.IDLE;
      })
      .addCase(CTFCategoriesDataGet.rejected, (state, action) => {
        state.CTFCategoriesDataGetStatus = CTF_CATEGORIES_GET_STATUSES.ERROR;
      });
  },
});
// export const {addNewCTFCategory, updateCTFCategories} = CTFCategoriesSlice.actions;
export default CTFCategoriesSlice.reducer;

// Thunk for CTF categories data fetching
export const CTFCategoriesDataGet = createAsyncThunk(
  'CTFCategoriesDataGet',
  async () => {
    try {
      const response = await getCTFCategories()
      return response?.data
    } catch (error) {
      console.error(error)
    }
  }
);