import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import uploadImg from "../../../assests/uploadIcon.png";
import { createSenarios, getCategorList } from "../../../APIConfig/scenarioConfig";
import ListItem from "../../createSolo/ListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import TextEditor from "../../../components/TextEditor";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import FullScreenDialog from "./scenarioDialog";
import { useFormik } from "formik";
import { createSquadValidationSchema } from "../../../utilities/validationSchemas";

const CreateSquad = () => {
    const [category, setCategory] = useState([]);
    const [scenarioId, setScenarioId] = React.useState("");


    const [flagInputs, setFlagInputs] = useState({
        scenario_blue_team_flags: "",
        scenario_purple_team_flags: "",
        scenario_red_team_flags: "",
        scenario_yellow_team_flags: "",
    });

    const handleFlagInputChange = (teamKey, value) => {
        setFlagInputs((prev) => ({ ...prev, [teamKey]: value }));
    };


    useEffect(() => {
        const apiCall = async () => {
            const data = await getCategorList();
            setCategory(data?.data || []);
        };
        apiCall();
    }, []);

    // ✅ Shared function for submitting scenario data
    const submitScenarioData = async (values) => {
        try {
            const data = await createSenarios(
                values,
                values.scenario_members_requirement,
                values.scenario_blue_team_flags.join(" "),
                values.scenario_purple_team_flags.join(" "),
                values.scenario_red_team_flags.join(" "),
                values.scenario_documents,
                values.scenario_description,
                values.scenario_tools_and_technologies,
                values.scenario_prerequisites
            );
            return data?.data?.scenario_id;
        } catch (error) {
            const obj = error?.response?.data?.errors || {};
            for (let i in obj) {
                toast.error(`${i.replace(/_/g, " ")} - ${obj[i]}`);
            }
            throw error; // Re-throw so calling functions can handle it
        }
    };


    // ✅ Formik setup with full state
    const formik = useFormik({
        initialValues: {
            scenario_name: "",
            scenario_category_id: "",
            scenario_assigned_severity: "Easy",
            scenario_score: "",
            scenario_time: "",
            scenario_thumbnail: null,
            scenario_documents: [],
            scenario_blue_team_flags: [],
            scenario_purple_team_flags: [],
            scenario_red_team_flags: [],
            scenario_yellow_team_flags: [],
            scenario_description: "",
            scenario_tools_and_technologies: "",
            scenario_prerequisites: "",
            scenario_members_requirement: {
                red: 0,
                blue: 0,
                yellow: 0,
                white: 0,
                purple: 0,
            },
        },

        validationSchema: createSquadValidationSchema,

        onSubmit: async (values, { setSubmitting }) => {
            try {
                const result = await submitScenarioData(values);
                if (result) {
                    setScenarioId(result);
                    return result;
                }
            } catch (error) {
                throw error; // Re-throw to let the dialog know it failed
            } finally {
                setSubmitting(false);
            }
        },
    });

    // ✅ Custom submit function that returns a promise
    const handleScenarioSubmit = async () => {
        try {
            // Validate form first
            const errors = await formik.validateForm();
            if (Object.keys(errors).length > 0) {
                // Set all fields as touched to show errors
                formik.setTouched({
                    scenario_name: true,
                    scenario_category_id: true,
                    scenario_assigned_severity: true,
                    scenario_score: true,
                    scenario_time: true,
                    scenario_thumbnail: true,
                    scenario_documents: true,
                    scenario_blue_team_flags: true,
                    scenario_purple_team_flags: true,
                    scenario_red_team_flags: true,
                    scenario_yellow_team_flags: true,
                    scenario_description: true,
                    scenario_tools_and_technologies: true,
                    scenario_prerequisites: true,
                });

                // Show error toast for each validation error
                // Object.keys(errors).forEach(fieldName => {
                //     const errorMessage = errors[fieldName];
                //     if (typeof errorMessage === 'string') {
                //         toast.error(`${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${errorMessage}`);
                //     } else if (Array.isArray(errorMessage)) {
                //         errorMessage.forEach(msg => {
                //             if (typeof msg === 'string') {
                //                 toast.error(`${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${msg}`);
                //             }
                //         });
                //     }
                // });

                return false;
            }

            // Use the shared submit function
            const result = await submitScenarioData(formik.values);
            if (result) {
                setScenarioId(result);
                return result;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    // ✅ File Handlers
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (["jpeg", "png"].includes(file.type.split("/").pop())) {
            if (file.size < 5 * 1024 * 1024) {
                formik.setFieldValue("scenario_thumbnail", file);
            } else {
                toast.error("Upload a file less than 5MB!");
            }
        } else {
            toast.error("Please upload a .jpeg or .png file");
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type === "application/pdf") {
            if (file.size < 5 * 1024 * 1024) {
                formik.setFieldValue("scenario_documents", [
                    ...formik.values.scenario_documents,
                    file,
                ]);
            } else {
                toast.error("Upload a file less than 5MB!");
            }
        } else {
            toast.error("Please upload a PDF");
        }
    };

    const removePdf = (name) => {
        const filtered = formik.values.scenario_documents.filter(
            (f) => f.name !== name
        );
        formik.setFieldValue("scenario_documents", filtered);
    };

    // ✅ Flag handlers (add/remove)
    const addFlag = (team, flagName) => {
        if (!flagName) return toast.error("Flag name is required");
        formik.setFieldValue(team, [
            { name: flagName },
            ...formik.values[team],
        ]);
    };

    const removeFlag = (team, index) => {
        const updated = [...formik.values[team]];
        updated.splice(index, 1);
        formik.setFieldValue(team, updated);
    };

    // ✅ Breadcrumbs
    const breadcrumbs = [
        { name: "Dashboard", link: "/" },
        { name: "Create Scenario", link: "/createCorporate" },
    ];

    return (
        <Stack width="100%">
            <ToastContainer />
            <BreadCrumbs breadcrumbs={breadcrumbs} />
            <Typography variant="h1" ml={5}>
                Create Squad
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <Stack direction="row" justifyContent="space-evenly" gap={2} width="100%">
                    <Stack gap={3} width="60%" p={2}>
                        {/* ------------------- Top Inputs ------------------- */}
                        <Stack gap={2} direction="row" width="100%">
                            <TextField
                                fullWidth
                                label="Squad Name"
                                name="scenario_name"
                                value={formik.values.scenario_name}
                                onChange={formik.handleChange}
                                error={formik.touched.scenario_name && Boolean(formik.errors.scenario_name)}
                                helperText={formik.touched.scenario_name && formik.errors.scenario_name}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Select Category</InputLabel>
                                <Select
                                    name="scenario_category_id"
                                    label="Select Category"
                                    value={formik.values.scenario_category_id}
                                    onChange={formik.handleChange}
                                >
                                    {category.map((item, idx) => (
                                        <MenuItem key={idx} value={item.scenario_category_id}>
                                            {item.scenario_category_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.scenario_category_id && formik.errors.scenario_category_id && (
                                    <Typography variant="caption" color='error' sx={{ mt: 1, ml: 2 }}>
                                        {formik.errors.scenario_category_id}
                                    </Typography>
                                )}
                            </FormControl>
                        </Stack>

                        <Stack gap={2} direction="row" width="100%">
                            <FormControl fullWidth>
                                <InputLabel>Severity</InputLabel>
                                <Select
                                    name="scenario_assigned_severity"
                                    label="Severity"
                                    value={formik.values.scenario_assigned_severity}
                                    onChange={formik.handleChange}

                                >
                                    <MenuItem value="Very Easy">Very Easy</MenuItem>
                                    <MenuItem value="Easy">Easy</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="Hard">Hard</MenuItem>
                                    <MenuItem value="Very Hard">Very Hard</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Points"
                                name="scenario_score"
                                value={formik.values.scenario_score}
                                onChange={formik.handleChange}
                                error={formik.touched.scenario_score && Boolean(formik.errors.scenario_score)}
                                helperText={formik.touched.scenario_score && formik.errors.scenario_score}
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            label="Time Duration"
                            name="scenario_time"
                            value={formik.values.scenario_time}
                            onChange={formik.handleChange}
                            error={formik.touched.scenario_time && Boolean(formik.errors.scenario_time)}
                            helperText={formik.touched.scenario_time && formik.errors.scenario_time}
                        />

                        {/* ------------------- Flags ------------------- */}

                        {[
                            { label: "Blue", key: "scenario_blue_team_flags" },
                            { label: "Purple", key: "scenario_purple_team_flags" },
                            { label: "Red", key: "scenario_red_team_flags" },
                            { label: "Yellow", key: "scenario_yellow_team_flags" },
                        ].map((team, i) => (
                            <Stack key={i} gap={2}>
                                <Stack direction="row" gap={2}>
                                    <TextField
                                        fullWidth
                                        label={`Enter ${team.label} Team Flag`}
                                        value={flagInputs[team.key]}
                                        onChange={(e) => handleFlagInputChange(team.key, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                if (!flagInputs[team.key].trim()) return;
                                                addFlag(team.key, flagInputs[team.key].trim());
                                                handleFlagInputChange(team.key, "");
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            if (!flagInputs[team.key].trim()) return;
                                            addFlag(team.key, flagInputs[team.key].trim());
                                            handleFlagInputChange(team.key, "");
                                        }}
                                    >
                                        Add
                                    </Button>
                                </Stack>
                                {formik.errors[team.key] && (
                                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                                        {formik.errors[team.key]}
                                    </Typography>
                                )}

                                {formik.values[team.key].map((flag, idx) => (
                                    <ListItem
                                        key={idx}
                                        flag={flag}
                                        remove={() => removeFlag(team.key, idx)}
                                    />
                                ))}
                            </Stack>
                        ))}



                        {/* ------------------- Text Editors ------------------- */}
                        <Typography variant="h3" mb={1}>Description</Typography>
                        <TextEditor
                            text={formik.values.scenario_description}
                            setText={(val) => formik.setFieldValue("scenario_description", val)}
                        />
                        {formik.errors.scenario_description && (
                            <Typography variant="caption" color='error' sx={{ mt: 2 }}>
                                {formik.errors.scenario_description}
                            </Typography>
                        )}

                        <Typography variant="h3" mt={4} mb={1}>Tools & Technologies</Typography>
                        <TextEditor
                            text={formik.values.scenario_tools_and_technologies}
                            setText={(val) => formik.setFieldValue("scenario_tools_and_technologies", val)}
                        />
                        {formik.errors.scenario_tools_and_technologies && (
                            <Typography variant="caption" color='error' sx={{ mt: 2 }}>
                                {formik.errors.scenario_tools_and_technologies}
                            </Typography>
                        )}

                        <Typography variant="h3" mt={4} mb={1}>Prerequisites</Typography>
                        <TextEditor
                            text={formik.values.scenario_prerequisites}
                            setText={(val) => formik.setFieldValue("scenario_prerequisites", val)}
                        />
                        {formik.errors.scenario_prerequisites && (
                            <Typography variant="caption" color='error' sx={{ mt: 2 }}>
                                {formik.errors.scenario_prerequisites}
                            </Typography>
                        )}

                        <Stack mt={5} width="5vw">
                            <FullScreenDialog senario={handleScenarioSubmit} datas="next" scenarioId={scenarioId} />
                        </Stack>
                    </Stack>

                    {/* ------------------- FILE UPLOADS ------------------- */}
                    <Divider orientation="vertical" flexItem />
                    <Stack gap={8} width="30%" p={1} alignItems="center">
                        <Typography variant="h3">Upload Thumbnail</Typography>
                        {formik.values.scenario_thumbnail ? (
                            <Stack direction="row" gap={1}>
                                <Typography sx={{ color: "#fff" }}>
                                    {formik.values.scenario_thumbnail.name}
                                </Typography>
                                <DeleteIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={() => formik.setFieldValue("scenario_thumbnail", null)}
                                />
                            </Stack>
                        ) : (
                            <Button component="label" variant="text" sx={{ color: "#fff", width: "100%" }}>
                                <Stack
                                    spacing={2}
                                    sx={{
                                        border: "1px dashed #12464C",
                                        borderRadius: "8px",
                                        height: "100px",
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <img src={uploadImg} alt="upload" height="36" width="36" />
                                    <Typography variant="body2" sx={{ color: "#6F727A" }}>
                                        Drop your thumbnail here or upload a .jpeg/.png
                                    </Typography>
                                    <input type="file" hidden onChange={handleThumbnailChange} />
                                </Stack>
                            </Button>
                        )}
                        {formik.errors.scenario_thumbnail && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, textAlign: "center" }}>
                                {formik.errors.scenario_thumbnail}
                            </Typography>
                        )}

                        <Typography variant="h3">Upload Walkthrough</Typography>
                        <Button component="label" variant="text" sx={{ color: "#fff", width: "100%" }}>
                            <Stack
                                spacing={2}
                                sx={{
                                    border: "1px dashed #12464C",
                                    borderRadius: "8px",
                                    height: "100px",
                                    width: "100%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <img src={uploadImg} alt="upload" height="36" width="36" />
                                <Typography variant="body2" sx={{ color: "#6F727A" }}>
                                    Drop your files here, or upload a .pdf
                                </Typography>
                                <input type="file" hidden onChange={handlePdfChange} />
                            </Stack>
                        </Button>
                        {formik.errors.scenario_documents && (
                            <Typography variant="caption" color="error" sx={{ mt: 1, textAlign: "center" }}>
                                {formik.errors.scenario_documents}
                            </Typography>
                        )}

                        {formik.values.scenario_documents.map((item, idx) => (
                            <Stack key={idx} direction="row" gap={1}>
                                <Typography sx={{ color: "#fff" }}>{item.name}</Typography>
                                <DeleteIcon style={{ cursor: "pointer" }} onClick={() => removePdf(item.name)} />
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </form>
        </Stack>
    );
};

export default CreateSquad;
