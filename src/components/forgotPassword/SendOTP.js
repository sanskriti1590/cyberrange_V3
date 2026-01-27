import React, { useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Stack, Typography, CircularProgress } from "@mui/material";
import rangestormlogo from "../../assests/rangestormlogo.png";
import { Icons } from "../icons";
import { sendVerificationCode } from "../../RTK/features/forgotPassword/forgotPasswordSlice";
import { useDispatch } from "react-redux";
import { sendOTP } from "../../APIConfig/userConfig";
import ErrorHandler from "../../ErrorHandler";

const SendOtp = () => {
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);  // State to track loading progress
  const [progress, setProgress] = useState("");   // State to track error or success

  const emailInputHandler = (email) => {
    setUserEmail(email.trim().toLowerCase());
  };

  const isFormValid = () => {
    if (userEmail.length < 1) {
      toast.error("All fields are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      setLoading(true);  // Set loading to true when submission starts
      setProgress("");   // Reset progress status
      try {
        const response = await sendOTP(userEmail);
        if (response) {
          dispatch(sendVerificationCode({ userEmail, stage: 1 }));
          toast.success("OTP sent successfully!");
          setUserEmail("");  // Clear input field on success
          setProgress("success");  // Set progress to success
        }
      } catch (error) {
        ErrorHandler(error);
        toast.error("Failed to send OTP");
        setProgress("error");  // Set progress to error on failure
      } finally {
        setLoading(false);  // Reset loading state
      }
    }
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
          <Typography
            style={{ fontWeight: "bold", color: "#F4F4F4" }}
            variant="h1"
            sx={{ mb: 4 }}
          >
            Forgot Password ?
          </Typography>
          <label
            style={{
              color: "#BCBEC1",
              fontSize: "14px",
              fontWeight: "400",
              letterSpacing: "0.12px",
            }}
          >
            Email
          </label>
          <Box style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="Enter your email address"
              value={userEmail}
              style={{
                width: "100%",
                backgroundColor: "#1C1F28",
                borderRadius: "8px",
                height: "48px",
                color: "#acacac",
                border: "none",
                padding: "12px 14px",
              }}
              onChange={(event) => emailInputHandler(event.target.value)}
            />
            <Box
              style={{
                display: "flex",
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
              }}
            >
              <Icons.envelope style={{ fontSize: "24px", color: "#6F727A" }} />
            </Box>
          </Box>

          <Stack alignItems="center" mt={2}>
            {loading && (
              <CircularProgress
                color={progress === "error" ? "error" : "secondary"}
              />
            )}
          </Stack>

          <Stack>
            <Button
              sx={{
                marginTop: "26px",
                width: "100%",
              }}
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled={loading}  // Disable button during loading
            >
              {loading ? "Sending..." : "Send Verification Code"}
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

export default SendOtp;
