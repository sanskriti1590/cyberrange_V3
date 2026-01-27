import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css";
import { optSend, unverified } from "../../APIConfig/CtfConfig";
import rangestormlogo from "../../assests/rangestormlogo.png";

const Phonenum = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [inputs, setInputs] = useState({
    Phonenum: "",
  });

  useEffect(() => {
    const userDetails = async () => {
      const data = await unverified();
      data.data && setData(data.data);
    };
    userDetails();
  }, [inputs]);

  const handleChange = (e) => {
    const { Phonenum, value } = e.target;
    setInputs({
      ...inputs,
      [Phonenum]: value,
    });
  };

  const optRequest = async () => {
    try {
      const value = await optSend();
      if (value.data.message) {
        toast.success("OTP sent successfully!"); // Success toast
        navigate("/verify/verification");
      }
    } catch (err) {
      // Handle error response
      if (err.response.status === 400) {
        toast.error("Failed to send OTP. Please try again."); // Error toast
        navigate("/verify/verification");
      }
    }
  };

  return (
    <>
      <Stack height="100dvh" width="100%" display="flex" justifyContent="center">
        <Stack
          width={{ xs: "100%", sm: "100%", md: "50%", lg: "40%", xl: "40%" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          px={4}
        >
          <Stack display="flex" width="100%" flexDirection="column" maxWidth={"400px"}>
            <Stack alignItems="start" gap={4}>
              <Typography
                style={{ fontWeight: "semibold", color: "#F4F4F4" }}
                variant="h1"
              >
                Email
              </Typography>

              <Typography variant="body1">{data.email}</Typography>
              <Stack width="100%">
                <Button
                  sx={{ marginTop: "24px", width: "100%" }}
                  variant="contained"
                  color="secondary"
                  onClick={optRequest}
                >
                  Send OTP
                </Button>
                <Typography
                  variant="body1"
                  my={2}
                  sx={{
                    color: "#F4F4F4",
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Back to{" "}
                  <span
                    style={{ color: "#00FFFF", cursor: "pointer" }}
                    onClick={() => navigate("/auth/register")}
                  >
                    Signup
                  </span>{" "}
                </Typography>
              </Stack>
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
            style={{ width: "80%", height: "30vh", cursor: "default" }}
          />
        </Stack>
      </Stack>
      <ToastContainer /> {/* Add the ToastContainer here */}
    </>
  );
};

export default Phonenum;
