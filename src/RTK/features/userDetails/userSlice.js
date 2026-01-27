// first ---- imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Apiconfig from "../../../APIConfig/ApiConfig";
import jwtDecode from "jwt-decode";
import API from "../../../Axios/axios";

// second --- initial state
const initialState = {
  loading: false,
  userss: [],
  error: "",
};

// third --- thunk
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async () => {
    const token = localStorage.getItem("access_token");
    const user = jwtDecode(token);
    const Id = user?.user_id;

    const response = await API.get(
      `${Apiconfig.user.userProfile}${Id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // ✅ correct
  }
); // ✅ properly closed

// fourth --- slice
const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.userss = action.payload; // ✅ correct
        state.error = "";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.userss = [];
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
