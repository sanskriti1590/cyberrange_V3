
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
import uploadImg from "../../../../assests/uploadIcon.png";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getCategory } from "../../../../APIConfig/CtfConfig";
import { toast } from "react-toastify";
import "./index.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ctfUpdatePost,
  singleCtfUpdateGetApi,
} from "../../../../APIConfig/adminConfig";
import TextEditor from "../../../../components/TextEditor";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateSoloValidationSchema } from "../../../../utilities/validationSchemas";




const UpdateCtf = () => {
  const { userId } = useParams();
  const [category, setCategory] = useState([]);
  const [flag, setFlag] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [text, setText] = useState("");
  const [textObj, setTextObj] = useState("");
  const [textPre, setTextPre] = useState("");
  const formik = useFormik({
    initialValues: {
      ctf_description: "",
      ctf_severity: "",
      ctf_category_id: "",
      ctf_name: "",
      ctf_time: "",
      ctf_score: "",
      ctf_thumbnail: null,
      ctf_walkthrough: null,
      ctf_thumbnailUrl: null,
      ctf_walkthroughUrl: null,
    },
    validationSchema: updateSoloValidationSchema,
    onSubmit: async (values) => {
      try {
        const sol = flag.join(" ");
        await ctfUpdatePost(values, sol, userId, text, textObj, textPre);
        toast.success("Update successful!");
      } catch (error) {
        const obj = error?.response?.data?.errors;
        if (obj) {
          for (let i in obj) {
            toast.error(
              i.charAt(0).toUpperCase() +
              i.slice(1).replace(/_/g, " ") +
              " - " +
              obj[i]
            );
          }
        } else {
          toast.error("Something went wrong!");
        }
      }
    },
  });

  // Load categories and existing CTF data
  useEffect(() => {
    const fetchData = async () => {
      const [categoryRes, ctfRes] = await Promise.all([
        getCategory(),
        singleCtfUpdateGetApi(userId),
      ]);

      categoryRes?.data && setCategory(categoryRes?.data || []);

      const data = ctfRes?.data;
      if (data) {
        formik.setValues({
          ctf_description: data?.ctf_description || "",
          ctf_severity: data?.ctf_severity || "",
          ctf_category_id: data?.ctf_category_id || "",
          ctf_name: data?.ctf_name || "",
          ctf_time: data?.ctf_time || "",
          ctf_score: data?.ctf_score || "",
          ctf_thumbnailUrl: data?.ctf_thumbnail || null,
          ctf_walkthroughUrl: data?.ctf_walkthrough || null,
        });
        setText(data?.ctf_description || "");
        setTextObj(data?.ctf_flags_information || "");
        setTextPre(data?.ctf_rules_regulations || "");
        setFlag(data?.ctf_flags || []);
      }
    };
    fetchData();
  }, [userId]);

  const handleFileChange = (e, field, allowedTypes) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.type.split("/").pop();
    if (!allowedTypes.includes(ext)) {
      toast.error(`Please upload a valid ${allowedTypes.join(" or ")} file`);
      return;
    }
    formik.setFieldValue(field, file);
  };

  const removeFlag = (index) => {
    const newArr = [...flag];
    newArr.splice(index, 1);
    setFlag(newArr);
  };

  const addFlag = () => {
    if (!inputValue.trim()) return toast.error("Flag name is required");
    setFlag((prev) => [inputValue.trim(), ...prev]);
    setInputValue("");
  };


  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack margin={5} gap={4}>
        <Typography variant="h2">Update Solo Challenge</Typography>

        <Stack gap={12} sx={{ backgroundColor: "custom.main", padding: 4 }}>
          <Stack width="100%" gap={3} marginTop={1}>
            <Stack direction="row" sx={{ gap: 4 }}>
              <Stack width="55%" gap={2}>
                <TextField
                  name="ctf_name"
                  label="Game Name"
                  value={formik.values.ctf_name}
                  onChange={formik.handleChange}
                  error={formik.touched.ctf_name && Boolean(formik.errors.ctf_name)}
                  helperText={formik.touched.ctf_name && formik.errors.ctf_name}
                />
                <TextField
                  name="ctf_score"
                  label="CTF Score"
                  value={formik.values.ctf_score}
                  onChange={formik.handleChange}
                  error={formik.touched.ctf_score && Boolean(formik.errors.ctf_score)}
                  helperText={formik.touched.ctf_score && formik.errors.ctf_score}
                />

                <FormControl fullWidth>
                  <InputLabel>Select Category</InputLabel>
                  <Select
                    name="ctf_category_id"
                    value={formik.values.ctf_category_id}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.ctf_category_id &&
                      Boolean(formik.errors.ctf_category_id)
                    }
                  >
                    {category?.map((item) => (
                      <MenuItem
                        key={item.ctf_category_id}
                        value={item.ctf_category_id}
                      >
                        {item.ctf_category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    name="ctf_severity"
                    value={formik.values.ctf_severity}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.ctf_severity && Boolean(formik.errors.ctf_severity)
                    }
                  >
                    <MenuItem value="Very Easy">Very Easy</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                    <MenuItem value="Very Hard">Very Hard</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Time</InputLabel>
                  <Select
                    name="ctf_time"
                    value={formik.values.ctf_time}
                    onChange={formik.handleChange}
                    error={formik.touched.ctf_time && Boolean(formik.errors.ctf_time)}
                  >
                    {[...Array(10)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {/* Upload section */}
              <Stack gap={6}>
                <Typography variant="h2">Upload Thumbnail</Typography>
                {formik.values.ctf_thumbnail ? (
                  <Stack direction="row" gap={2} alignItems="center">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        typeof formik.values.ctf_thumbnail === "string"
                          ? window.open(formik.values.ctf_thumbnail, "_blank")
                          : toast.info("Already selected")
                      }
                    >
                      Thumbnail
                    </Button>
                    <DeleteIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => formik.setFieldValue("ctf_thumbnail", null)}
                    />
                  </Stack>
                ) : (
                  <Button
                    component="label"
                    variant="text"
                    sx={{
                      color: "#fff",
                      backgroundColor: "custom.main",
                      width: "448px",
                      my: 2,
                    }}
                  >
                    <Stack
                      sx={{
                        border: "1px dashed #12464C",
                        borderRadius: "8px",
                        height: "152px",
                        width: "448px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 4,
                        padding: 4,
                      }}
                    >
                      <img src={uploadImg} width="24px" height="24px" alt="upload" />
                      <Typography variant="body2" textAlign="center">
                        Browse and choose a .jpeg or .png file
                      </Typography>
                      <input
                        type="file"
                        hidden
                        accept="image/png, image/jpeg"
                        onChange={(e) =>
                          handleFileChange(e, "ctf_thumbnail", ["jpeg", "png"])
                        }
                      />
                    </Stack>
                  </Button>
                )}
                {formik.values.ctf_thumbnailUrl && <a target="_blank" href={formik.values.ctf_thumbnailUrl} rel="noreferrer">Open file</a>}
                {/* {formik.errors.ctf_thumbnail &&} */}
                {formik.errors.ctf_thumbnail && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {formik.errors.ctf_thumbnail}
                  </Typography>
                )}

                <Typography variant="h2">Upload Walkthrough</Typography>
                {formik.values.ctf_walkthrough ? (
                  <Stack direction="row" gap={2} alignItems="center">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        typeof formik.values.ctf_walkthrough === "string"
                          ? window.open(formik.values.ctf_walkthrough, "_blank")
                          : toast.info("Already selected")
                      }
                    >
                      Walkthrough PDF
                    </Button>
                    <DeleteIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => formik.setFieldValue("ctf_walkthrough", null)}
                    />
                  </Stack>
                ) : (
                  <Button
                    component="label"
                    variant="text"
                    sx={{
                      color: "#fff",
                      backgroundColor: "custom.main",
                      width: "448px",
                      my: 2,
                    }}
                  >
                    <Stack
                      sx={{
                        border: "1px dashed #12464C",
                        borderRadius: "8px",
                        height: "152px",
                        width: "448px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 4,
                        padding: 4,
                      }}
                    >
                      <img src={uploadImg} width="24px" height="24px" alt="upload" />
                      <Typography variant="body2" textAlign="center">
                        Browse and choose a .pdf file
                      </Typography>
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={(e) =>
                          handleFileChange(e, "ctf_walkthrough", ["pdf"])
                        }
                      />
                    </Stack>
                  </Button>
                )}
                {formik.values.ctf_walkthroughUrl && <a target="_blank" href={formik.values.ctf_walkthroughUrl} rel="noreferrer">Open file</a>}
              </Stack>

              {formik.errors.ctf_walkthrough && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {formik.errors.ctf_walkthrough}
                </Typography>
              )}
            </Stack>

            {/* Text Editors */}
            <Stack width="100%" sx={{ mb: 3 }}>
              <Typography variant="h3">Description</Typography>
              <TextEditor setText={setText} text={text} />
            </Stack>
            <Stack width="100%" sx={{ mb: 3 }}>
              <Typography variant="h3">Flag Information</Typography>
              <TextEditor setText={setTextObj} text={textObj} />
            </Stack>
            <Stack width="100%" sx={{ mb: 3 }}>
              <Typography variant="h3">Rules and Regulation</Typography>
              <TextEditor setText={setTextPre} text={textPre} />
            </Stack>

            {/* Flags */}
            <Stack marginTop={1}>
              <Stack gap={2}>
                <Stack direction="row" gap={2}>
                  <TextField
                    name="ctf_flags"
                    label="Enter Flags"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addFlag()}
                    sx={{ width: "90%" }}
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    type="button"
                    onClick={addFlag}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack
                  flexDirection="column"
                  width="100%"
                  gap={2}
                  sx={{
                    maxHeight: "150px",
                    overflow: "auto",
                    color: "white",
                  }}
                >
                  {flag.map((f, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#fff",
                      }}
                    >
                      {f}
                      <Button
                        color="error"
                        variant="contained"
                        onClick={() => removeFlag(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </Stack>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "130px", p: 2, borderRadius: "8px" }}
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
};

export default UpdateCtf;

