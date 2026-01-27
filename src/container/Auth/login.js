import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../../APIConfig/CtfConfig";
import jwtDecode from "jwt-decode";
import "../../index.css";
import CustomizeInput from "../../components/CustomizeInput";
import CustomizeHiddenInput from "../../components/CustomizeHiddenInput";
import { useSelector } from "react-redux";
import logo from ".././../assests/bhumilogo.png";
import rangestormlogo from ".././../assests/rangestormlogo.png";
// import idrbtLogo from "../components/assests/CR4SA-Logo_Transperant.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const pathurl = useSelector((state) => state?.pathUrl?.mode?.currentPath);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleChangeLogin();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleChangeLogin = async () => {
    // Validation before making request
    if (!inputs.email || !inputs.password) {
      toast.error("Email and Password are required");
      return;
    }

    try {
      const normalizedInputs = {
        ...inputs,
        email: inputs.email.toLowerCase(),
      };

      const response = await loginUser(normalizedInputs);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      const token = localStorage.getItem("access_token");
      const user = token && jwtDecode(token);

      if (!user.is_verified) {
        navigate("/verify/mobileNumber");
      }

      if (token) {
        if (user.is_verified && token) {

          navigate(pathurl ? pathurl : "/")


        }
      }
    } catch (error) {
      const obj = error.response.data.errors;

      for (let i in obj) {
        toast.error(
          i.charAt(0).toUpperCase() +
          i.slice(1).replace(/_/g, " ") +
          " - " +
          obj[i]
        );
      }
    }
  };

  return (
    <Stack height="100dvh" width="100%" display="flex" justifyContent="center" >
      <Stack
        width={{ xs: "100%", sm: "100%", md: "50%", lg: "40%", xl: "40%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
        py={4}

      >
        <img
          src={logo} // Corrected here
          alt="Description of the image"
          style={{ width: "50%", height: "auto" }}
        />
      </Stack>
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
            Login
          </Typography>
          <Stack display="flex" flexDirection="column" sx={{ mb: 2 }}>
            <CustomizeInput
              label="Email"
              type="text"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
          </Stack>
          <Stack>
            <CustomizeHiddenInput
              label="Password"
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
              placeholder="Enter Password"
              onKeyPress={handleEnterKeyPress}
            />
          </Stack>

          {/*Hide this section as Forgot Password feature is not working from backend side*/}
          <Stack alignItems="end">
            <Typography
              variant="body1"
              component="a"
              onClick={() => navigate("/auth/forgotPassword")}
              mt={1}
              style={{
                textDecoration: "none",
                color: "#00FFFF",
                cursor: "pointer",
              }}
            >
              Forgot Password?
            </Typography>
          </Stack>

          <Stack>
            <Button
              sx={{
                marginTop: "26px",
                width: "100%",
              }}
              variant="contained"
              color="secondary"
              onClick={handleChangeLogin}
            >
              Continue
            </Button>

            {/* <Stack justifyContent="center" alignItems="center" border={'1px solid green'}>
              <Typography
                variant="body1"
                // component="a"
                mt={1}
                sx={{ color: "#F4F4F4", textDecoration: "none" }}
              >
                Don’t have an account?{" "}
                <span
                  style={{ color: "#00FFFF", cursor: "pointer" }}
                  onClick={() => navigate("/auth/register")}
                >
                  Signup
                </span>{" "}
              </Typography>
            </Stack> */}
          </Stack>
        </Stack>
      </Stack>
      <Stack
        alignItems="end"
        sx={{ justifyContent: "center", alignItems: "center" }}
        width={{ xs: "0%", sm: "0%", md: "50%", lg: "60%", xl: "60%" }}
        position="fixed"
        right={0}
      >
        <img
          src={rangestormlogo}
          // src={idrbtLogo}
          alt="login-img"
          // style={{ width: "60%", height: "20vh", cursor: "default" }}
          style={{
            width: "50%", cursor: "default",
            objectFit: "contain",
            filter: "drop-shadow(0 0 10px #00E0FF)",
            borderRadius: "20px"

          }}
        />
      </Stack>
    </Stack>
  );
};

export default LoginPage;
