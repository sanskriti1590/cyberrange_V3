import {createSlice} from '@reduxjs/toolkit';

export const FORGOT_PASSWORD_GET_STATUSES = Object.freeze({
  IDLE: 'idle',
  ERROR: 'error',
  LOADING: 'loading',
});

const initialState = {
  forgotPasswordData: {
    stage: 0,
    userEmail: '',
  },
  forgotPasswordDataGetStatus: FORGOT_PASSWORD_GET_STATUSES.IDLE,
};

export const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    sendVerificationCode: (state, action) => {
      const {userEmail, stage} = action.payload;
      return {
        ...state,
        forgotPasswordData: {
          ...state.forgotPasswordData,
          userEmail,
          stage,
        },
      };
    },
    verifyOTP: (state, action) => {
      const {OTP, stage} = action.payload;
      return {
        ...state,
        forgotPasswordData: {
          ...state.forgotPasswordData,
          OTP,
          stage,
        },
      };
    },
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
  },
});
export const {sendVerificationCode, verifyOTP, resetState} = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
