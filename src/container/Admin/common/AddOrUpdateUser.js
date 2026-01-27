import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { addUser, UserDataUpdate } from "../../../APIConfig/adminConfig";
import { getAllAvatars } from "../../../APIConfig/CtfConfig";
import ErrorHandler from "../../../ErrorHandler";
import { Icons } from "../../../components/icons";
import { userValidationSchema } from "../../../utilities/validationSchemas"

const AddOrUpdateUser = ({ template, data }) => {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // Fetch avatars once
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await getAllAvatars();
        response?.data?.user_avatar_list && setAvatars(response?.data?.user_avatar_list || []);
      } catch (error) {
        ErrorHandler(error);
      }
    };
    fetchAvatars();
  }, []);



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.user_full_name || "",
      email: data?.email || "",
      team: data?.user_role || "",
      mobileNumber: data?.mobile_number || "",
      password: "",
      confirmPassword: "",
      isVerified: data?.is_verified || false,
      isPremium: data?.is_premium || false,
      isAdmin: data?.is_admin || false,
      isActive: data?.is_active || false,
      display_all_ctf: data?.display_all_ctf || false,
      display_all_scenario: data?.display_all_scenario || false,
      display_all_corporate: data?.display_all_corporate || false,
      display_locked_ctf: data?.display_locked_ctf || false,
      display_locked_scenario: data?.display_locked_scenario || false,
      display_locked_corporate: data?.display_locked_corporate || false,
    },
    validationSchema: userValidationSchema(template),
    onSubmit: async (values) => {
      try {
        const payload = { ...values };
        const response =
          template === "Add User"
            ? await addUser(payload, selectedAvatar)
            : await UserDataUpdate(data.user_id, payload, selectedAvatar);

        if (response) {
          toast.success(response.data.message);
          navigate("/admin/users");
        }
      } catch (error) {
        ErrorHandler(error);
      }
    },
  });

  // Set default avatar on load
  useEffect(() => {
    if (template === "Add User" && avatars.length > 0) {
      setSelectedAvatar(avatars[0]);
    } else if (data?.user_avatar) {
      setSelectedAvatar(data.user_avatar);
    }
  }, [avatars, data, template]);

  return (
    <Stack px={2} py={4}>
      <ToastContainer />
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h2">{template}</Typography>
          <Button type="submit" variant="contained">
            {template}
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="center" alignItems="center">
          <Stack
            mt={4}
            spacing={3}
            sx={{
              borderRadius: "16px",
              backgroundColor: "#16181F",
              width: "100%",
              maxWidth: "772px",
              padding: "24px 40px",
            }}
          >
            {/* Avatar Selection */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" mb={2} sx={{ color: "#EAEAEB" }}>
                Choose Avatar
              </Typography>
              <img
                src={selectedAvatar}
                alt="selected avatar"
                style={{ height: "80px", width: "80px", borderRadius: "100%" }}
              />
              <Box mt={2} display="flex" gap={2} flexWrap="wrap" justifyContent="center">
                {avatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(url)}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      border: selectedAvatar === url ? "2px solid #00FFFF" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Name + Email */}
            <Stack direction="row" spacing={3}>
              <FormControl fullWidth>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Email Address"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={template !== "Add User"}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#636363", // Text color
                      WebkitTextFillColor: "#636363", // Fix for Chrome autofill fade
                      cursor: "not-allowed",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "#636363", // Label color
                    },
                    "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
                      borderColor: "#535353", // Subtle border color
                    },
                  }}
                />
              </FormControl>
            </Stack>

            {/* Team + Mobile */}
            <Stack direction="row" spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Select Team</InputLabel>
                <Select
                  name="team"
                  value={formik.values.team}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.team && Boolean(formik.errors.team)}
                  label="Select Team"
                >
                  <MenuItem value="RED TEAM">Red Team</MenuItem>
                  <MenuItem value="WHITE TEAM">White Team</MenuItem>
                  <MenuItem value="BLUE TEAM">Blue Team</MenuItem>
                  <MenuItem value="YELLOW TEAM">Yellow Team</MenuItem>
                </Select>
                {formik.touched.team && formik.errors.team && (
                  <Typography variant="caption" color="error">
                    {formik.errors.team}
                  </Typography>
                )}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={formik.values.mobileNumber}
                  onChange={(e) => {
                    const numeric = e.target.value.replace(/\D/g, "").slice(0, 10);
                    formik.setFieldValue("mobileNumber", numeric);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.mobileNumber && Boolean(formik.errors.mobileNumber)}
                  helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                />
              </FormControl>
            </Stack>


            {/* Passwords */}
            <>
              <FormControl fullWidth>
                <TextField
                  label="Enter Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </>
            {/* Toggles */}
            <Stack direction="row" flexWrap="wrap" justifyContent="space-between" gap={2}>
              {[
                ["isVerified", "Verify this account?"],
                ["isPremium", "Give Premium Access"],
                ["isAdmin", "Create Admin"],
                ["isActive", "Active Status"],
              ].map(([key, label]) => (
                <Stack key={key} direction="row" alignItems="center" spacing={1}>
                  {formik.values[key] ? (
                    <Icons.checkboxTrue
                      onClick={() => formik.setFieldValue(key, false)}
                      style={{ color: "#00FFFF", cursor: "pointer" }}
                    />
                  ) : (
                    <Icons.checkboxFalse
                      onClick={() => formik.setFieldValue(key, true)}
                      style={{ color: "#6F727A", cursor: "pointer" }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ color: "#6F727A", cursor: "pointer" }}
                    onClick={() => formik.setFieldValue(key, !formik.values[key])}
                  >
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Display Toggles */}
            <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
              {[
                ["display_all_ctf", "Solo"],
                ["display_locked_ctf", "Solo Locked"],
                ["display_all_scenario", "Squad"],
                ["display_locked_scenario", "Squad Locked"],
                ["display_all_corporate", "Corporate"],
                ["display_locked_corporate", "Corporate Locked"],
              ].map(([key, label]) => (
                <Stack key={key} direction="row" alignItems="center" spacing={1}>
                  {formik.values[key] ? (
                    <Icons.toggleRight
                      onClick={() => formik.setFieldValue(key, false)}
                      style={{ color: "#00FFFF", cursor: "pointer" }}
                    />
                  ) : (
                    <Icons.toggleLeft
                      onClick={() => formik.setFieldValue(key, true)}
                      style={{ color: "#6F727A", cursor: "pointer" }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ color: "#6F727A", cursor: "pointer" }}
                    onClick={() => formik.setFieldValue(key, !formik.values[key])}
                  >
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default AddOrUpdateUser;
