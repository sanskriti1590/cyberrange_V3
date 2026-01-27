import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getWebScenariosCategories} from "../../../APIConfig/adminConfig";

export const WEB_SCENARIO_CATEGORIES_GET_STATUSES = Object.freeze({
    IDLE: 'idle',
    ERROR: 'error',
    LOADING: 'loading',
});

const initialState = {
    webScenarioCategoriesData: [],
    webScenarioCategoriesDataGetStatus: WEB_SCENARIO_CATEGORIES_GET_STATUSES.IDLE,
};

export const webScenarioCategoriesSlice = createSlice({
    name: 'webScenarioCategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // For Web Scenarios categories data fetching
            .addCase(webScenarioCategoriesDataGet.pending, (state, action) => {
                state.webScenarioCategoriesDataGetStatus = WEB_SCENARIO_CATEGORIES_GET_STATUSES.LOADING;
            })
            .addCase(webScenarioCategoriesDataGet.fulfilled, (state, action) => {
                state.webScenarioCategoriesData = action.payload;
                state.webScenarioCategoriesDataGetStatus = WEB_SCENARIO_CATEGORIES_GET_STATUSES.IDLE;
            })
            .addCase(webScenarioCategoriesDataGet.rejected, (state, action) => {
                state.webScenarioCategoriesDataGetStatus = WEB_SCENARIO_CATEGORIES_GET_STATUSES.ERROR;
            });
    },
});
export default webScenarioCategoriesSlice.reducer;

// Thunk for Web Scenarios categories data fetching
export const webScenarioCategoriesDataGet = createAsyncThunk(
    'webScenarioCategoriesDataGet',
    async () => {
        try {
            const response = await getWebScenariosCategories()
            return response?.data
        } catch (error) {
            console.error(error)
        }
    }
);