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
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import {
  addUser,
  UserDataUpdate,
  bulkUserUpload,
} from "../../../APIConfig/adminConfig";
import { getAllAvatars } from "../../../APIConfig/CtfConfig";
import ErrorHandler from "../../../ErrorHandler";
import { Icons } from "../../../components/icons";
import { userValidationSchema } from "../../../utilities/validationSchemas";

const AddOrUpdateUser = ({ template, data }) => {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);

  /* ================= FETCH AVATARS ================= */
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await getAllAvatars();
        if (response?.data?.user_avatar_list) {
          setAvatars(response.data.user_avatar_list);
        }
      } catch (error) {
        ErrorHandler(error);
      }
    };
    fetchAvatars();
  }, []);

  /* ================= FORM ================= */
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

  /* ================= DEFAULT AVATAR ================= */
  useEffect(() => {
    if (template === "Add User" && avatars.length > 0) {
      setSelectedAvatar(avatars[0]);
    } else if (data?.user_avatar) {
      setSelectedAvatar(data.user_avatar);
    }
  }, [avatars, data, template]);

  /* ================= BULK UPLOAD ================= */
  const handleBulkUpload = async (file) => {
    if (!file) return;

    try {
      setBulkUploading(true);
      const res = await bulkUserUpload(file);

      toast.success(
        `Uploaded ${res.data.success_count} users`
      );

      if (res.data.failed_count > 0) {
        toast.warning(
          `${res.data.failed_count} rows failed. Check console.`
        );
        console.warn("Bulk upload failed rows:", res.data.failed_rows);
      }
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setBulkUploading(false);
    }
  };

  

  return (
    <Stack px={2} py={4}>
      <ToastContainer />

      <form onSubmit={formik.handleSubmit} autoComplete="off">
        {/* ================= HEADER ================= */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2">{template}</Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            {template === "Add User" && (
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                disabled={bulkUploading}
              >
                Bulk Upload
                <input
                  hidden
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) =>
                    handleBulkUpload(e.target.files[0])
                  }
                />
              </Button>
            )}

            <Button type="submit" variant="contained">
              {template}
            </Button>
          </Stack>
        </Stack>

        {/* ================= FORM CARD ================= */}
        <Stack direction="row" justifyContent="center">
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
            {/* ================= AVATAR ================= */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="body2" mb={2} sx={{ color: "#EAEAEB" }}>
                Choose Avatar
              </Typography>

              <img
                src={selectedAvatar}
                alt="avatar"
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: "100%",
                }}
              />

              <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                {avatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(url)}
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: "50%",
                      cursor: "pointer",
                      border:
                        selectedAvatar === url
                          ? "2px solid #00FFFF"
                          : "2px solid transparent",
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* ================= NAME + EMAIL ================= */}
            <Stack direction="row" spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                {...formik.getFieldProps("name")}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                disabled={template !== "Add User"}
                {...formik.getFieldProps("email")}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Stack>

            {/* ================= TEAM + MOBILE ================= */}
            <Stack direction="row" spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Select Team</InputLabel>
                <Select
                  name="team"
                  value={formik.values.team}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="RED TEAM">Red Team</MenuItem>
                  <MenuItem value="WHITE TEAM">White Team</MenuItem>
                  <MenuItem value="BLUE TEAM">Blue Team</MenuItem>
                  <MenuItem value="YELLOW TEAM">Yellow Team</MenuItem>
                  <MenuItem value="PURPLE TEAM">Purple Team</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onChange={(e) =>
                  formik.setFieldValue(
                    "mobileNumber",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
              />
            </Stack>

            {/* ================= PASSWORDS ================= */}
            <TextField
              label="Enter Password"
              type={showPassword ? "text" : "password"}
              name="password"
              {...formik.getFieldProps("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              {...formik.getFieldProps("confirmPassword")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* ================= TOGGLES ================= */}
            <Stack direction="row" flexWrap="wrap" gap={3}>
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
                    />
                  ) : (
                    <Icons.checkboxFalse
                      onClick={() => formik.setFieldValue(key, true)}
                    />
                  )}
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      formik.setFieldValue(key, !formik.values[key])
                    }
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
