import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import rangestormlogo from "../../assests/rangestormlogo.png";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import ErrorHandler from "../../ErrorHandler";
import { Icons } from "../icons";
import { changePassword, sendOTP } from "../../APIConfig/userConfig";
import { useNavigate } from "react-router-dom";
import { resetState } from "../../RTK/features/forgotPassword/forgotPasswordSlice";

const ChangePassword = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { forgotPasswordData } = useSelector((state) => state.forgotPassword);

  const [OTP, setOTP] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const passwordInputHandler = (value) => {
    setNewPassword(value);
  };

  const confirmPasswordInputHandler = (value) => {
    setConfirmNewPassword(value);
  };

  const passwordVisibilityHandler = () => {
    setShowNewPassword(!showNewPassword);
  };

  const confirmPasswordVisibilityHandler = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };
  const isFormValid = () => {
    if (!newPassword || !confirmNewPassword || OTP.length !== 6) {
      toast.error("All fields are required.");
      return false;
    }
    if (newPassword.length < 8 || /^\d+$/.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and cannot be entirely numeric."
      );
      return false;
    }
    if (/^\d+$/.test(newPassword)) {
      toast.error("Password cannot be entirely numeric");
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Password and Confirm Password do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      try {
        const response = await changePassword(
          OTP,
          newPassword,
          confirmNewPassword
        );
        if (response.data) {
          toast.success(response.data.message);
          setTimeout(() => {
            dispatch(resetState());
            navigate("/auth/login");
          }, 2000);
        }
      } catch (error) {
        ErrorHandler(error);
      }
    }
  };

  const resendOTPHandler = async () => {
    try {
      const response = await sendOTP(forgotPasswordData.userEmail);
      if (response.data) {
        toast.success(response.data.message);
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const backButtonHandler = async () => {
    dispatch(resetState());
  };

  return (
    <Stack height="100dvh" width="100%" display="flex" justifyContent="center">
      <Stack
        width={{ xs: "100%", sm: "100%", md: "50%", lg: "40%", xl: "40%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
      >
        <Stack
          display="flex"
          width="100%"
          flexDirection="column"
          maxWidth={"400px"}
        >
          <Stack
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{ width: "100%", cursor: "pointer", color: "#0FF" }}
            mb={5}
            onClick={backButtonHandler}
          >
            <Icons.leftArrow />
            <Typography variant="h4" sx={{ color: "#0FF !important" }} ml={1}>
              Back
            </Typography>
          </Stack>
          <Typography
            style={{ fontWeight: "bold", color: "#F4F4F4" }}
            variant="h1"
            sx={{ mb: 1 }}
          >
            Change Password
          </Typography>

          <Typography
            style={{ fontWeight: "400", color: "#BCBEC1 !important" }}
            variant="h5"
            sx={{ mb: 3 }}
          >
            We’ve send you a verification code on your registered email.
            <br />
            <span style={{ color: "#0FF", fontSize: "14px" }}>
              {forgotPasswordData.userEmail}
            </span>
          </Typography>

          <Box>
            <OtpInput
              value={OTP}
              onChange={setOTP}
              numInputs={6}
              inputStyle={{
                color: "#EAEAEB",
                backgroundColor: "#1C1F28",
                height: "50px",
                width: "50px",
                border: "2px solid #1C1F28",
                borderRadius: "8px",
              }}
              containerStyle={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              renderInput={(props) => <input {...props} className="inputTag" />}
            />
          </Box>
          <Stack justifyContent="flex-start" alignItems="flex-start">
            <Typography
              variant="h5"
              mt={1}
              sx={{
                color: "#BCBEC1 !important",
                textDecoration: "none",
                fontWeight: "400",
              }}
            >
              Didn’t received code?{" "}
              <span
                style={{
                  fontSize: "14px",
                  color: "#00FFFF",
                  cursor: "pointer",
                }}
                onClick={resendOTPHandler}
              >
                Resend Code
              </span>{" "}
            </Typography>
          </Stack>

          <Stack
            display="flex"
            width="100%"
            flexDirection="column"
            maxWidth={"400px"}
            mt={2}
          >
            <label
              style={{
                color: "#BCBEC1",
                fontSize: "14px",
                fontWeight: "400",
                letterSpacing: "0.12px",
              }}
            >
              New Password
            </label>
            <Box style={{ position: "relative" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={newPassword}
                onChange={(event) => passwordInputHandler(event.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: "#1C1F28",
                  borderRadius: "8px",
                  height: "48px",
                  color: "#acacac",
                  border: "none",
                  padding: "12px 14px",
                }}
              />
              <Box
                style={{
                  backgroundColor: "#1C1F28",
                  display: "flex",
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                }}
              >
                {showNewPassword ? (
                  <Icons.hide
                    style={{
                      fontSize: "24px",
                      color: "#6F727A",
                      cursor: "pointer",
                    }}
                    onClick={passwordVisibilityHandler}
                  />
                ) : (
                  <Icons.show
                    style={{
                      fontSize: "24px",
                      color: "#6F727A",
                      cursor: "pointer",
                    }}
                    onClick={passwordVisibilityHandler}
                  />
                )}
              </Box>
            </Box>

            <label
              style={{
                color: "#BCBEC1",
                fontSize: "14px",
                fontWeight: "400",
                letterSpacing: "0.12px",
                marginTop: "16px",
              }}
            >
              Re-enter Password
            </label>
            <Box style={{ position: "relative" }}>
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmNewPassword}
                onChange={(event) =>
                  confirmPasswordInputHandler(event.target.value)
                }
                style={{
                  width: "100%",
                  backgroundColor: "#1C1F28",
                  borderRadius: "8px",
                  height: "48px",
                  color: "#acacac",
                  border: "none",
                  padding: "12px 14px",
                }}
              />
              <Box
                style={{
                  backgroundColor: "#1C1F28",
                  display: "flex",
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-50%)",
                }}
              >
                {showConfirmNewPassword ? (
                  <Icons.hide
                    style={{
                      fontSize: "24px",
                      color: "#6F727A",
                      cursor: "pointer",
                    }}
                    onClick={confirmPasswordVisibilityHandler}
                  />
                ) : (
                  <Icons.show
                    style={{
                      fontSize: "24px",
                      color: "#6F727A",
                      cursor: "pointer",
                    }}
                    onClick={confirmPasswordVisibilityHandler}
                  />
                )}
              </Box>
            </Box>
          </Stack>

          <Stack>
            <Button
              sx={{
                marginTop: "32px",
                width: "100%",
              }}
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        alignItems="center"
        width={{ xs: "0%", sm: "0%", md: "50%", lg: "60%", xl: "60%" }}
        position="fixed"
        right={0}
      >
        <img
          src={rangestormlogo}
          alt="login-img"
          style={{ width: "60%", height: "20vh", cursor: "default" }}
        />
      </Stack>
    </Stack>
  );
};

export default ChangePassword;
