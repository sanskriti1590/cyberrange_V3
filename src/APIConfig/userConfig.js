import AxiosNoToken from '../Axios/axiosNoToken';

import ApiConfig from './ApiConfig';


export const sendOTP = async (userEmail) => {
  return await AxiosNoToken.post(`${ApiConfig.user.sendVerificationCode}`, {
    email: userEmail
  });
};

export const changePassword = async (OTP, newPassword, confirmNewPassword) => {
  return await AxiosNoToken.post(`${ApiConfig.user.setNewPassword}`, {
    otp: OTP,
    password: newPassword,
    confirm_password: confirmNewPassword
  });
};

export const totalUserCount = async () => {
  return await AxiosNoToken.get(ApiConfig.user.totalUsers);
};