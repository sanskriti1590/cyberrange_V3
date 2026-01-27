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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import uploadImg from "../../assests/uploadIcon.png";
import { createMachine, getCategory } from "../../APIConfig/CtfConfig";
import StepperHorizontal from "../../components/Stepper";
import TextEditor from "../../components/TextEditor";
import PlusButton from "../../components/PlusButton";
import BreadCrumbs from "../../components/navbar/BreadCrumb";
import ListItem from "./ListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { uploadMachineValidationSchema } from "../../utilities/validationSchemas";



const UploadMachine = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);

  // Fetch categories
  useEffect(() => {
    (async () => {
      const data = await getCategory();
      setCategory(data?.data || []);
    })();
  }, []);

  // Yup validation schema


  const formik = useFormik({
    initialValues: {
      ctf_name: "",
      ctf_category_id: "",
      ctf_severity: "",
      ctf_time: "",
      ctf_score: "",
      ctf_description: "",
      ctf_flags_information: "",
      ctf_rules: "",
      ctf_walkthrough: '',
      ctf_thumbnail: '',
      flags: "",        // input box value for entering a single flag
      flagChips: [],
    },
    validationSchema: uploadMachineValidationSchema,
    onSubmit: async (values) => {
      const flags = (values.flagChips || []).join(" ")

      try {
        const res = await createMachine(values, flags);
        if (res?.data?.ctf_creator_id) {
          navigate("/createSolo/uploadFile", {
            state: { ctf_id: res.data.ctf_id },
          });
        }
      } catch (error) {
        const obj = error.response?.data?.errors || {};
        for (let key in obj) {
          toast.error(`${key.replace(/_/g, " ")} - ${obj[key]}`);
        }
      }
    },
  });


  // Add a flag into Formik flagChips
  const addFlag = () => {
    const val = (formik.values.flags || "").trim();
    if (!val) {
      toast.error("Flag name is required");
      return;
    }

    // duplicate check
    if (formik.values.flagChips.includes(val)) {
      toast.error("This flag already exists");
      return;
    }

    // const newChips = [{ name: val }, ...formik.values.flagChips.map(f => ({ name: f }))];
    // Note: your ListItem expects { name }, so we store chips as objects to keep existing ListItem usage.
    // But validation schema expects strings — convert when validating/submitting; alternatively store as strings.
    // To minimize other changes, we'll store strings (and render using {name: chip} below)
    // So instead, do string storage:
    const newStringChips = [val, ...formik.values.flagChips];
    formik.setFieldValue("flagChips", newStringChips);
    formik.setFieldValue("flags", "");
    formik.setFieldError("flagChips", undefined);
    formik.setFieldTouched("flagChips", false);
  };

  // Remove a flag by index
  const removeFlag = (index) => {
    const updated = formik.values.flagChips.filter((_, i) => i !== index);
    formik.setFieldValue("flagChips", updated);
    // if empty, mark touched/validate so user sees error
    if (updated.length === 0) {
      formik.setFieldTouched("flagChips", true);
      formik.validateField("flagChips");
    } else {
      formik.setFieldError("flagChips", undefined);
    }
  };




  const data = {
    index: 0,
    steps: ["Fill Form", "Upload Machine"],
  };

  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    { name: "Upload Solo", link: "/createSolo" },
  ];
  return (
    <Stack>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mx: 5, mt: 2 }}>
        <Typography variant="h2">Create Solo Challenge</Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: "160px", p: 2, borderRadius: "8px", fontWeight: 700 }}
          onClick={formik.handleSubmit}
        >
          Save & Continue
        </Button>
      </Stack>

      <Stack margin={5} gap={4} sx={{ overflowY: "scroll", height: "80vh" }}>
        <Stack gap={4} alignItems="center" bgcolor="background.secondary" padding={8}>
          <StepperHorizontal data={data} />

          <form onSubmit={formik.handleSubmit} style={{ width: "90%" }}>
            <Stack gap={3}>
              {/* Game Name */}
              <TextField
                name="ctf_name"
                label="Game Name"
                fullWidth
                value={formik.values.ctf_name}
                onChange={formik.handleChange}
                error={formik.touched.ctf_name && Boolean(formik.errors.ctf_name)}
                helperText={formik.touched.ctf_name && formik.errors.ctf_name}
              />

              <Stack direction="row" gap="1%">
                {/* Category */}
                <FormControl fullWidth error={formik.touched.ctf_category_id && Boolean(formik.errors.ctf_category_id)}>
                  <InputLabel>Select Category</InputLabel>
                  <Select
                    name="ctf_category_id"
                    value={formik.values.ctf_category_id}
                    label="Select Category"
                    onChange={formik.handleChange}
                  >
                    {category.map((item) => (
                      <MenuItem key={item.ctf_category_id} value={item.ctf_category_id}>
                        {item.ctf_category_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.errors.ctf_category_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 2, ml: 1 }}>
                      {formik.errors.ctf_category_id}
                    </Typography>
                  )}
                </FormControl>

                {/* Severity */}
                <FormControl fullWidth error={formik.touched.ctf_severity && Boolean(formik.errors.ctf_severity)}>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    name="ctf_severity"
                    value={formik.values.ctf_severity}
                    label="Severity"
                    onChange={formik.handleChange}
                  >
                    {["Very Easy", "Easy", "Medium", "Hard", "Very Hard"].map((lvl) => (
                      <MenuItem key={lvl} value={lvl}>
                        {lvl}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.errors.ctf_severity && (
                    <Typography variant="caption" color="error" sx={{ mt: 2, ml: 1 }}>
                      {formik.errors.ctf_severity}
                    </Typography>
                  )}
                </FormControl>
              </Stack>

              {/* Score & Time */}
              <Stack direction="row" gap="1%">
                <TextField
                  name="ctf_score"
                  label="Score"
                  fullWidth
                  value={formik.values.ctf_score}
                  onChange={formik.handleChange}
                  error={formik.touched.ctf_score && Boolean(formik.errors.ctf_score)}
                  helperText={formik.touched.ctf_score && formik.errors.ctf_score}
                />
                <FormControl fullWidth error={formik.touched.ctf_time && Boolean(formik.errors.ctf_time)}>
                  <InputLabel>Time (hr)</InputLabel>
                  <Select
                    name="ctf_time"
                    value={formik.values.ctf_time}
                    label="Time (hr)"
                    onChange={formik.handleChange}
                  >
                    {[...Array(10)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.errors.ctf_time && (
                    <Typography variant="caption" color="error" sx={{ mt: 2, ml: 1 }}>
                      {formik.errors.ctf_time}
                    </Typography>
                  )}
                </FormControl>
              </Stack>

              {/* Description */}
              <Stack marginBottom={2}>
                <Typography>Description</Typography>
                <TextEditor
                  text={formik.values.ctf_description}
                  setText={(val) => formik.setFieldValue("ctf_description", val)}
                />
                {formik.errors.ctf_description && (
                  <Typography variant="caption" color="error" sx={{ mt: 2, ml: 1 }}>
                    {formik.errors.ctf_description}
                  </Typography>
                )}
              </Stack>

              {/* Flag Information */}
              <Stack marginBottom={2}>
                <Typography>Flag Information</Typography>
                <TextEditor
                  text={formik.values.ctf_flags_information}
                  setText={(val) => formik.setFieldValue("ctf_flags_information", val)}
                />
                {formik.errors.ctf_flags_information && (
                  <Typography variant="caption" color="error" sx={{ mt: 2, ml: 1 }}>
                    {formik.errors.ctf_flags_information}
                  </Typography>
                )}
              </Stack>

              {/* Flags */}
              {/* <Stack gap={2}>
                <Stack direction="row" gap={2} alignItems="center">
                  <TextField
                    label="Enter Flags"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <PlusButton onClick={addFlag} />

                  <Box>
                    {/* Flag validation error display */}
              {/* {formik.touched.flagChips && formik.errors.flagChips && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {formik.errors.flagChips}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                {flagList.length > 0 && (
                  <Stack
                    flexDirection="column"
                    gap={2}
                    sx={{
                      maxHeight: 200,
                      overflowY: "auto",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    {flagList.map((f, index) => (
                      <ListItem key={index} flag={f} remove={() => removeFlag(index)} />
                    ))}
                  </Stack>
                )}
              </Stack> */}
              {/* Flags */}
              <Stack gap={2} sx={{ mt: 4 }}>
                <Stack direction="row" gap={2} alignItems="center">
                  <TextField
                    label="Enter Flags"
                    value={formik.values.flags}
                    name="flags"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ flex: 1 }}
                    error={formik.touched.flags && Boolean(formik.errors.flags)}
                    helperText={formik.touched.flags && formik.errors.flags}
                  />
                  <PlusButton onClick={addFlag} />

                  <Box>
                    {/* Flag validation error display */}
                    {formik.touched.flagChips && formik.errors.flagChips && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {formik.errors.flagChips}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                {formik.values.flagChips.length > 0 && (
                  <Stack
                    flexDirection="column"
                    gap={2}
                    sx={{
                      maxHeight: 200,
                      overflowY: "auto",
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    {formik.values.flagChips.map((chip, index) => (
                      // If ListItem expects { flag } with .name, adapt by passing { name: chip }
                      <ListItem key={index} flag={{ name: chip }} remove={() => removeFlag(index)} />
                    ))}
                  </Stack>
                )}
              </Stack>


              {/* Rules */}
              <Stack marginBottom={2}>
                <Typography>Rules and Regulation</Typography>
                <TextEditor
                  text={formik.values.ctf_rules}
                  setText={(val) => formik.setFieldValue("ctf_rules", val)}
                />
                {formik.errors.ctf_rules && (
                  <Typography variant="caption" color="error" sx={{ mt: 2, ml: 1 }}>
                    {formik.errors.ctf_rules}
                  </Typography>
                )}
              </Stack>

              {/* File Uploads */}
              <Stack direction="row" justifyContent="space-around" gap={2} sx={{ mt: 6 }}>
                {/* JPEG Upload */}
                <Stack
                  width="40%"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ border: "1px dashed #12464C", borderRadius: "8px", p: 2 }}
                >
                  <Typography variant="h2">Upload Thumbnail</Typography>

                  {formik.values.ctf_thumbnail ? (
                    <Stack direction="row" mt={2}>
                      <Typography>{formik.values.ctf_thumbnail.name}</Typography>
                      <DeleteIcon
                        sx={{ cursor: "pointer", ml: 1 }}
                        onClick={() => formik.setFieldValue("ctf_thumbnail", null)}
                      />
                    </Stack>
                  ) : (
                    <Box component="label" sx={{ width: "100%", cursor: "pointer" }}>
                      <Stack alignItems="center" gap={2} p={2}>
                        <img src={uploadImg} width="24px" alt="upload" />
                        <Typography fontSize={12}>
                          Browse and upload an image file (JPG/PNG)
                        </Typography>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            formik.setFieldValue("ctf_thumbnail", e.currentTarget.files[0])
                          }
                        />
                      </Stack>
                    </Box>
                  )}

                  {formik.errors.ctf_thumbnail && (
                    <Typography variant="caption" color="error">
                      {formik.errors.ctf_thumbnail}
                    </Typography>
                  )}
                </Stack>

                {/* PDF Upload */}
                <Stack
                  width="40%"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ border: "1px dashed #12464C", borderRadius: "8px", p: 2 }}
                >
                  <Typography variant="h2">Upload Walkthrough</Typography>

                  {formik.values.ctf_walkthrough ? (
                    <Stack direction="row" mt={2}>
                      <Typography>{formik.values.ctf_walkthrough.name}</Typography>
                      <DeleteIcon
                        sx={{ cursor: "pointer", ml: 1 }}
                        onClick={() => formik.setFieldValue("ctf_walkthrough", null)}
                      />
                    </Stack>
                  ) : (
                    <Box component="label" sx={{ width: "100%", cursor: "pointer" }}>
                      <Stack alignItems="center" gap={2} p={2}>
                        <img src={uploadImg} width="24px" alt="upload" />
                        <Typography fontSize={12}>
                          Select a PDF file from your computer
                        </Typography>
                        <input
                          type="file"
                          accept="application/pdf"
                          hidden
                          onChange={(e) =>
                            formik.setFieldValue("ctf_walkthrough", e.currentTarget.files[0])
                          }
                        />
                      </Stack>
                    </Box>
                  )}

                  {formik.errors.ctf_walkthrough && (
                    <Typography variant="caption" color="error">
                      {formik.errors.ctf_walkthrough}
                    </Typography>
                  )}
                </Stack>
              </Stack>

            </Stack>
          </form>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UploadMachine;
