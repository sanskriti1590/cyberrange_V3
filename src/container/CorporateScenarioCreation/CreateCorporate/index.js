import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import uploadImg from "../../../assests/uploadIcon.png";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import TextEditor from "../../../components/TextEditor";
import { getCategorList } from "../../../APIConfig/scenarioConfig";
import { createScenarioValidationSchema } from "../../../utilities/validationSchemas";

// 🧩 Helper: Convert Base64 → File
// 🧩 Safe Helper: Convert Base64 → File
const base64ToFile = (base64, filename, type) => {
  if (!base64 || typeof base64 !== "string" || !base64.includes(",")) {
    console.warn("Invalid base64 data for:", filename);
    return null;
  }
  try {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : type;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime || type });
  } catch (err) {
    console.error("Error converting base64 → File:", err);
    return null;
  }
};


const CreateCorporate = ({ setToggle, handleClear, setForm }) => {
  const [category, setCategory] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch category list
  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategorList();
      data?.data && setCategory(data?.data || []);
    };
    loadCategories();
  }, []);

  // 🧠 Formik setup
  const formik = useFormik({
    initialValues: {
      scenario_name: "",
      scenario_assigned_severity: "Easy",
      scenario_category_id: "",
      type: "1",
      scenario_thumbnail: null,
      scenario_description: "",
      scenario_tools_and_technologies: "",
      scenario_prerequisites: "",
      scoring_type: "STANDARD",
    },

    validationSchema: createScenarioValidationSchema,
    onSubmit: (values) => {
      console.log('values', values)
      const formData = new FormData();
      formData.append("scenario_name", values.scenario_name);
      formData.append("scenario_assigned_severity", values.scenario_assigned_severity);
      formData.append("scenario_category_id", values.scenario_category_id);
      const challengeMode = values.type === "1" ? "MILESTONE" : "FLAG";
      formData.append("challenge_mode", challengeMode);
      formData.append("scenario_thumbnail", values.scenario_thumbnail);
      formData.append("scenario_description", values.scenario_description);
      formData.append("scenario_tools_and_technologies", values.scenario_tools_and_technologies);
      formData.append("scenario_prerequisites", values.scenario_prerequisites);
      formData.append("scoring_type", values.scoring_type);




      setForm(formData);
      setToggle(values.type);
      toast.success("Form submitted successfully!");
    },
    validateOnMount: false, // 👈 prevent initial validation
    validateOnChange: false, // 👈 disable while restoring
    validateOnBlur: false,
  });

  // 📁 Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload JPG or PNG image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Upload a file less than 5MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      formik.setFieldValue("scenario_thumbnail", file);
      localStorage.setItem(
        "scenarioThumbnail",
        JSON.stringify({ name: file.name, type: file.type, data: reader.result })
      );
    };
    reader.readAsDataURL(file);
  };



  // 🧠 Restore everything from localStorage on mount
  useEffect(() => {




    // Restore thumbnail
    const savedThumb = JSON.parse(localStorage.getItem("scenarioThumbnail") || "null");
    if (savedThumb && savedThumb.data) {
      const restoredFile = base64ToFile(savedThumb.data, savedThumb.name, savedThumb.type);
      if (restoredFile) {
        setPreviewImage(savedThumb.data);
        formik.setFieldValue("scenario_thumbnail", restoredFile);
      }
    }



    // Restore text fields
    const savedData = localStorage.getItem("createScenarioForm");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      Object.keys(parsed).forEach((key) => {
        if (key === "scenario_thumbnail") return;
        formik.setFieldValue(key, parsed[key]);
      });
    }

  }, []);

  useEffect(() => {
    const localData = localStorage.getItem('scenarioCreationData');
    const parsedData = localData ? JSON.parse(localData) : null;
    const toggle = parsedData?.toggle;

    if (toggle === 0) {
      localStorage.setItem("createScenarioForm", JSON.stringify(formik.values));
    }
  }, [formik.values]);


  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    { name: "Create Corporate", link: "/createCorporate" },
  ];


  return (
    <Stack marginBottom={5}>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <form onSubmit={formik.handleSubmit}>
        <Stack direction="row" justifyContent="space-between" padding={3}>
          <Typography variant="h2">Create Corporate</Typography>
          <Stack direction='row' >
            <Button
              // variant="text"
              color='error'
              sx={{ width: "160px", p: 2, borderRadius: "8px", fontWeight: 700, color: 'red' }}
              onClick={() => handleClear(formik, setPreviewImage)}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ width: "160px", p: 2, borderRadius: "8px", fontWeight: 700 }}
            >
              Save & Continue
            </Button>

          </Stack>

        </Stack>

        <Stack alignItems="center">
          <Stack
            width="80%"
            justifyContent="center"
            alignItems="center"
            bgcolor="#16181F"
            p={5}
            gap={3}
          >
            {/* Upload Thumbnail */}
            <Stack width="100%">
              <Typography variant="h3" sx={{ color: "#9C9EA3 !important" }}>
                Upload Thumbnail
              </Typography>

              {previewImage ? (
                <Stack direction="row" gap={1} alignItems="center">
                  <img
                    src={previewImage}
                    alt="Preview"
                    width="200px"
                    style={{ borderRadius: "8px" }}
                  />
                  <DeleteIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      formik.setFieldValue("scenario_thumbnail", null);
                      setPreviewImage(null);
                      localStorage.removeItem("scenarioThumbnail");
                    }}
                  />
                </Stack>
              ) : (
                <Stack
                  component="label"
                  sx={{
                    border: "3px dashed #12464C",
                    borderRadius: "8px",
                    height: "132px",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "#6F727A",
                  }}
                >
                  <img src={uploadImg} alt="upload_image" height="36px" width="36px" />
                  <Typography>Browse and upload an image (JPG, PNG)</Typography>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Stack>
              )}
              {formik.errors.scenario_thumbnail && (
                <Typography color="error" variant="caption">
                  {formik.errors.scenario_thumbnail}
                </Typography>
              )}
            </Stack>

            {/* Scenario Name */}
            <TextField
              fullWidth
              label="Scenario Name"
              name="scenario_name"
              value={formik.values.scenario_name}
              onChange={formik.handleChange}
              error={formik.touched.scenario_name && Boolean(formik.errors.scenario_name)}
              helperText={formik.touched.scenario_name && formik.errors.scenario_name}
            />

            {/* Severity & Category */}
            <Stack direction="row" gap={2} width="100%">
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  name="scenario_assigned_severity"
                  value={formik.values.scenario_assigned_severity}
                  label="Severity"
                  onChange={formik.handleChange}
                >
                  {["Very Easy", "Easy", "Medium", "Hard", "Very Hard"].map((level) => (
                    <MenuItem value={level} key={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Select Category</InputLabel>
                <Select
                  name="scenario_category_id"
                  value={formik.values.scenario_category_id}
                  label="Select Category"
                  onChange={formik.handleChange}
                >
                  {category.map((cat) => (
                    <MenuItem key={cat.scenario_category_id} value={cat.scenario_category_id}>
                      {cat.scenario_category_name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.errors.scenario_category_id && (
                  <Typography color="error" variant="caption">
                    {formik.errors.scenario_category_id}
                  </Typography>
                )}
              </FormControl>
            </Stack>

            {/* Scoring Type */}
            <Stack sx={{ width: "100%" }}>
              <Typography variant="h3" sx={{ color: "#9C9EA3 !important" }}>
                Scoring Type
              </Typography>
              <RadioGroup
                row
                name="scoring_type"
                value={formik.values.scoring_type}
                onChange={(e) => formik.setFieldValue("scoring_type", e.target.value)}
              >
                <FormControlLabel value="STANDARD" control={<Radio />} label="Standard Scoring" />
                <FormControlLabel value="DECAY" control={<Radio />} label="Decay Scoring" />
              </RadioGroup>
            </Stack>

            {/* Exercise Type */}
            <Stack sx={{ width: "100%" }}>
              <Typography variant="h3" sx={{ color: "#9C9EA3 !important" }}>
                Exercise Type
              </Typography>
              <RadioGroup
                row
                name="type"
                value={formik.values.type}
                onChange={(e) => formik.setFieldValue("type", e.target.value)}
              >
                <FormControlLabel value="1" control={<Radio />} label="Milestones Based" />
                <FormControlLabel value="2" control={<Radio />} label="Flag Based" />
              </RadioGroup>
            </Stack>

            {/* Text Editors */}
            {[
              { name: "scenario_description", label: "Description" },
              { name: "scenario_tools_and_technologies", label: "Tools & Technologies" },
              { name: "scenario_prerequisites", label: "Prerequisites" },
            ].map((field) => (
              <Stack width="100%" key={field.name} sx={{ mb: 7 }}>
                <Typography variant="h3" sx={{ color: "#9C9EA3 !important" }}>
                  {field.label}
                </Typography>
                <TextEditor
                  text={formik.values[field.name]}
                  setText={(val) => formik.setFieldValue(field.name, val)}
                />
                {formik.errors[field.name] && (
                  <Typography color="error" variant="caption" mt={4}>
                    {formik.errors[field.name]}
                  </Typography>
                )}
              </Stack>
            ))}


          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default CreateCorporate;
