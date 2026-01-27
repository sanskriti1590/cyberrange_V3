import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "@mui/material/Link";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import uploadImg from "../../../../assests/uploadIcon.png";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getCategorList,
  scenarioSingleGet,
  senariosUpdate,
} from "../../../../APIConfig/scenarioConfig";
import TextEditor from "../../../../components/TextEditor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { CheckMark } from "../../user/UserUpdate";
import { updateSquadScenarioValidationSchema } from "../../../../utilities/validationSchemas";


const UpdateScenario = () => {
  const { userId } = useParams();
  const [category, setCategory] = useState([]);
  const [multipleFile, setMultipleFile] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [reload, setReload] = useState(false);
  const [file, setFile] = useState({ jpeg: "" });
  const navigate = useNavigate(0)
  const formik = useFormik({
    initialValues: {
      scenario_name: "",
      scenario_category_id: "",
      scenario_assigned_severity: "",
      scenario_score: "",
      scenario_time: "",
      scenario_description: null,
      scenario_prerequisites: null,
      scenario_tools_technologies: null,
      scenario_for_premium_user: false,
      scenario_thumbnail: null,
      scenario_documents: [],
    },
    validationSchema: updateSquadScenarioValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsActive(true);
        const submitValues = { ...values };

        if (typeof submitValues.scenario_thumbnail === "string") {
          delete submitValues.scenario_thumbnail;
        }

        await senariosUpdate(
          userId,
          submitValues,
          multipleFile,
          submitValues.scenario_description,
          submitValues.scenario_tools_technologies,
          submitValues.scenario_prerequisites
        );

        toast.success("Scenario updated successfully!");
        // navigate(0)
        setMultipleFile([])
        setReload(!reload);
      } catch (error) {
        const obj = error.response?.data?.errors || {};
        Object.keys(obj).forEach((key) =>
          toast.error(`${key.replace(/_/g, " ")} - ${obj[key]}`)
        );
      } finally {
        setIsActive(false);
      }
    },
  });



  // Fetch scenario data for edit
  useEffect(() => {
    const fetchScenario = async () => {
      setIsActive(true);
      const value = await scenarioSingleGet(userId);
      const data = value?.data;

      if (data) {


        formik.setValues({
          scenario_name: data?.scenario_name || "",
          scenario_category_id: data?.scenario_category_id || "",
          scenario_assigned_severity: data?.scenario_assigned_severity || "",
          scenario_score: data?.scenario_score || "",
          scenario_time: data?.scenario_time || "",
          scenario_description: data?.scenario_description || "",
          scenario_prerequisites: data?.scenario_prerequisites || null,
          scenario_tools_technologies: data?.scenario_tools_technologies || null,
          scenario_for_premium_user: data?.scenario_for_premium_user || false,
          scenario_thumbnail: data?.scenario_thumbnail || null,
          scenario_documents: [],
        });

        setFile({ jpeg: data?.scenario_thumbnail || "" });
        setExistingDocs(data?.scenario_documents || []);

      }
      // Clear errors
      formik.setFieldError("scenario_description", "");
      formik.setFieldError("scenario_prerequisites", "");
      formik.setErrors({});
      // Clear touched so errors from TextEditor disappear
      formik.setTouched({});
      setIsActive(false);
    };
    fetchScenario();
  }, [reload]);

  // Fetch category list
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategorList();
      data?.data && setCategory(data?.data || []);
    };
    fetchCategories();
  }, []);

  const handleSignInChange = (e) => {
    const { name, checked } = e.target;
    formik.setFieldValue(name, checked);
  };

  const handleChangePdf = (e) => {
    const file = e.target.files[0];
    if (file?.type === "application/pdf") {
      const newFiles = [...multipleFile, file];
      setMultipleFile(newFiles);
      formik.setFieldValue("scenario_documents", newFiles);
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  const handleChangeThumbnail = (e) => {
    const file = e.target.files[0];
    if (["image/jpeg", "image/png"].includes(file?.type)) {
      setFile({ jpeg: file });
      formik.setFieldValue("scenario_thumbnail", file);
    } else {
      toast.error("Please upload a JPEG or PNG image.");
    }
  };

  const handleRemoveDoc = (name) => {
    const newFiles = multipleFile.filter((f) => f.name !== name);
    setMultipleFile(newFiles);
    formik.setFieldValue("scenario_documents", newFiles);
  };

  const handleDeleteExistingDoc = async (url) => {
    setExistingDocs(existingDocs.filter((f) => f !== url));

  };
  return (
    <Stack mt={6} gap={4} width="100%">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isActive}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Stack ml={5}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link underline="hover" color="#ACACAC" href="/">Dashboard</Link>
          <Link underline="hover" color="#ACACAC" href="/UpdateScenario">Update Squad</Link>
        </Breadcrumbs>
      </Stack>

      <Typography variant="h2" ml={5}>Update Squad</Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack direction="row" justifyContent="space-evenly" gap={2}>
          {/* LEFT SIDE */}
          <Stack gap={3} width="60%" p={2}>
            {/* Name + Category */}
            <Stack direction="row" gap={2}>
              <TextField
                label="Scenario Name"
                name="scenario_name"
                value={formik.values.scenario_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.scenario_name && Boolean(formik.errors.scenario_name)}
                helperText={formik.touched.scenario_name && formik.errors.scenario_name}
                fullWidth
              />
              <FormControl fullWidth error={formik.touched.scenario_category_id && Boolean(formik.errors.scenario_category_id)}>
                <InputLabel>Select Category</InputLabel>
                <Select
                  name="scenario_category_id"
                  value={formik.values.scenario_category_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#acacac",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#acacac",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#acacac",
                    },
                    ".MuiSvgIcon-root ": {
                      fill: "#acacac !important",
                    },
                  }}
                  style={{ backgroundColor: "#161616 !important" }}
                >
                  {category?.map((item) => (
                    <MenuItem value={item.scenario_category_id} key={item.scenario_category_id}>
                      {item.scenario_category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Severity + Points */}
            <Stack direction="row" gap={2}>
              <FormControl fullWidth error={formik.touched.scenario_assigned_severity && Boolean(formik.errors.scenario_assigned_severity)}>
                <InputLabel>Severity</InputLabel>
                <Select
                  name="scenario_assigned_severity"
                  value={formik.values.scenario_assigned_severity}
                  onChange={formik.handleChange}
                >
                  {["Very Easy", "Easy", "Medium", "Hard", "Very Hard"].map((lvl) => (
                    <MenuItem value={lvl} key={lvl}>{lvl}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Points"
                name="scenario_score"
                value={formik.values.scenario_score}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.scenario_score && Boolean(formik.errors.scenario_score)}
                helperText={formik.touched.scenario_score && formik.errors.scenario_score}
                fullWidth
              />
            </Stack>

            {/* Time + Premium */}
            <Stack direction="row" gap={2} alignItems="center">
              <TextField
                label="Time Duration (hrs)"
                name="scenario_time"
                value={formik.values.scenario_time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.scenario_time && Boolean(formik.errors.scenario_time)}
                helperText={formik.touched.scenario_time && formik.errors.scenario_time}
                fullWidth
              />
              <CheckMark
                label="Premium"
                name="scenario_for_premium_user"
                onChange={handleSignInChange}
                value={formik.values.scenario_for_premium_user}
              />
            </Stack>

            {/* Description */}
            <Typography variant="h3">Description</Typography>
            <TextEditor
              setText={(v) => formik.setFieldValue("scenario_description", v)}
              text={formik.values.scenario_description}
            />
            {formik.errors.scenario_description && (
              <Typography variant="caption" color='error' sx={{ mt: 2 }}>
                {formik.errors.scenario_description}
              </Typography>
            )}

            {/* Tools */}
            <Typography variant="h3" mt={4}>Tools & Technologies</Typography>
            <TextEditor
              setText={(v) => formik.setFieldValue("scenario_tools_technologies", v)}
              text={formik.values.scenario_tools_technologies}
            />
            {formik.errors.scenario_tools_technologies && (
              <Typography variant="caption" color='error' sx={{ mt: 2 }}>
                {formik.errors.scenario_tools_technologies}
              </Typography>
            )}

            {/* Prerequisites */}
            <Typography variant="h3" mt={4}>Prerequisites</Typography>
            <TextEditor
              setText={(v) => formik.setFieldValue("scenario_prerequisites", v)}
              text={formik.values.scenario_prerequisites}
            />
            {formik.errors.scenario_prerequisites && (
              <Typography variant="caption" color='error' sx={{ mt: 2 }}>
                {formik.errors.scenario_prerequisites}
              </Typography>
            )}

            <Button variant="contained" color="secondary" type="submit" sx={{ width: "120px", mt: 4 }} >
              Update
            </Button>
          </Stack>

          {/* RIGHT SIDE */}
          <Divider orientation="vertical" flexItem />
          <Stack gap={2} width="30%" p={2} alignItems="center">
            <Typography variant="h2">Upload Thumbnail</Typography>

            {file.jpeg ? (
              <Stack direction="row" gap={1}>
                <Typography sx={{ color: "#fff" }}>thumbnail</Typography>
                <DeleteIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setFile({ jpeg: "" });
                    formik.setFieldValue("scenario_thumbnail", null);
                  }}
                />
              </Stack>
            ) : (
              <Button
                component="label"
                sx={{
                  width: "300px",
                  height: '100px',
                  border: "1px dashed #12464C",
                  borderRadius: "8px",
                  maxHeight: '200px'

                }}>
                <Stack
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <img src={uploadImg} width="20px" height="20px" alt="upload" />
                  <Typography variant="body2" textAlign="center">
                    Drop your thumbnail here or browse (.jpeg, .png)
                  </Typography>
                  <input type="file" hidden onChange={handleChangeThumbnail} />
                </Stack>
              </Button>
            )}

            <Divider flexItem sx={{ my: 2 }} />

            <Typography variant="h2">Upload Walkthrough (PDFs)</Typography>
            <Button component="label" sx={{
              width: "300px",
              height: '100px',
              border: "1px dashed #12464C",
              borderRadius: "8px",
              maxHeight: '200px'
            }}>
              <Stack
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <img src={uploadImg} width="20px" height="20px" alt="upload" />
                <Typography variant="body2" textAlign="center">
                  Drop or browse PDF files
                </Typography>
                <input type="file" hidden accept=".pdf" onChange={handleChangePdf} />
              </Stack>
            </Button>

            {/* Existing Docs */}
            {existingDocs.map((item, index) => (
              <Stack direction="row" gap={1} key={index}>
                <Typography sx={{ color: "#fff" }}>Walkthrough-{index + 1}</Typography>
                <DeleteIcon sx={{ cursor: "pointer" }} onClick={() => handleDeleteExistingDoc(item)} />
                <VisibilityIcon sx={{ cursor: "pointer" }} onClick={() => window.open(item, "_blank")} />
              </Stack>
            ))}

            {/* Newly Added Docs */}
            {multipleFile.map((item, index) => (
              <Stack direction="row" gap={1} key={index}>
                <Typography sx={{ color: "#fff" }}>{item.name}</Typography>
                <DeleteIcon sx={{ cursor: "pointer" }} onClick={() => handleRemoveDoc(item.name)} />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
};

export default UpdateScenario;
