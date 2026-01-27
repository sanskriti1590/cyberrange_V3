import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllUsers} from "../../../APIConfig/adminConfig";

export const ALL_USERS_GET_STATUSES = Object.freeze({
  IDLE: 'idle',
  ERROR: 'error',
  LOADING: 'loading',
});

const initialState = {
  allUsersData: [],
  allUsersDataGetStatus: ALL_USERS_GET_STATUSES.IDLE,
};

export const allUsersSlice = createSlice({
  name: 'scenarioCategories',
  initialState,
  reducers: {
    addNewUser: (state, action) => {
      state.allUsersData.unshift(action.payload);
    },
    deleteUser: (state, action) => {
      const idsToDelete = action.payload;
      state.allUsersData = state.allUsersData.filter(
        (user) => !idsToDelete.includes(user.user_id)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // For all users data fetching
      .addCase(allUsersDataGet.pending, (state, action) => {
        state.allUsersDataGetStatus = ALL_USERS_GET_STATUSES.LOADING;
      })
      .addCase(allUsersDataGet.fulfilled, (state, action) => {
        state.allUsersData = action.payload;
        state.allUsersDataGetStatus = ALL_USERS_GET_STATUSES.IDLE;
      })
      .addCase(allUsersDataGet.rejected, (state, action) => {
        state.allUsersDataGetStatus = ALL_USERS_GET_STATUSES.ERROR;
      });
  },
});
export const {addNewUser, deleteUser} = allUsersSlice.actions;
export default allUsersSlice.reducer;

// Thunk for all users data fetching
export const allUsersDataGet = createAsyncThunk(
  'allUsersDataGet',
  async () => {
    try {
      const response = await getAllUsers()
      return response?.data
    } catch (error) {
      console.error(error)
    }
  }
);