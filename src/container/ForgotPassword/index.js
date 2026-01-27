import React from 'react';
import SendOtp from '../../components/forgotPassword/SendOTP';
import {useSelector} from 'react-redux';
import ChangePassword from '../../components/forgotPassword/ChangePassword';

const ForgotPassword = () => {
  const {forgotPasswordData} = useSelector((state) => state.forgotPassword);
  return (
    <>
      {forgotPasswordData.stage === 0 && <SendOtp/>}
      {forgotPasswordData.stage === 1 && <ChangePassword/>}
    </>
  );
};

export default ForgotPassword;