import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getScenarioCategories} from "../../../APIConfig/adminConfig";

export const SCENARIO_CATEGORIES_GET_STATUSES = Object.freeze({
  IDLE: 'idle',
  ERROR: 'error',
  LOADING: 'loading',
});

const initialState = {
  scenarioCategoriesData: [],
  scenarioCategoriesDataGetStatus: SCENARIO_CATEGORIES_GET_STATUSES.IDLE,
};

export const scenarioCategoriesSlice = createSlice({
  name: 'scenarioCategories',
  initialState,
  reducers: {
    addNewScenarioCategory: (state, action) => {
      state.scenarioCategoriesData.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // For scenario categories data fetching
      .addCase(scenarioCategoriesDataGet.pending, (state, action) => {
        state.scenarioCategoriesDataGetStatus = SCENARIO_CATEGORIES_GET_STATUSES.LOADING;
      })
      .addCase(scenarioCategoriesDataGet.fulfilled, (state, action) => {
        state.scenarioCategoriesData = action.payload;
        state.scenarioCategoriesDataGetStatus = SCENARIO_CATEGORIES_GET_STATUSES.IDLE;
      })
      .addCase(scenarioCategoriesDataGet.rejected, (state, action) => {
        state.scenarioCategoriesDataGetStatus = SCENARIO_CATEGORIES_GET_STATUSES.ERROR;
      });
  },
});
export const {addNewScenarioCategory} = scenarioCategoriesSlice.actions;
export default scenarioCategoriesSlice.reducer;

// Thunk for scenario categories data fetching
export const scenarioCategoriesDataGet = createAsyncThunk(
  'scenarioCategoriesDataGet',
  async () => {
    try {
      const response = await getScenarioCategories()
      return response?.data
    } catch (error) {
      console.error(error)
    }
  }
);