// pages/CreateWebScenarios.jsx
import React from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import FlagInput from "../../../components/FlagInput";
import FileUploadCard from "../../../components/FileUploadCard";
import EditorsSection from "../../../components/EditorsSection";
import useWebScenarioForm from "../../../hooks/useWebScenarioForm";
import { validateWalkthroughFile, validateThumbnailFile } from "../../../utilities/fileValidators";
import { createWebScenario, updateWebScenario } from "../../../APIConfig/adminConfig";

const CreateWebScenarios = () => {
	const { id } = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();

	const { formik, walkthroughFileRef, thumbnailFileRef } = useWebScenarioForm(isEdit, id);
	const { webScenarioCategoriesData = [] } = useSelector((s) => s.webScenarioCategories || { webScenarioCategoriesData: [] });

	// Flag handlers
	const handleDeleteChip = (chipToDelete) => {
		const updated = formik.values.flagChips.filter((c) => c !== chipToDelete);
		formik.setFieldValue("flagChips", updated, true);
		if (updated.length === 0) {
			formik.setFieldTouched("flagChips", true, true);
			formik.validateField("flagChips");
		} else {
			formik.setFieldError("flagChips", undefined);
		}
	};

	const handleFlagAdd = () => {
		const val = formik.values.flags?.trim();
		if (!val) return;
		if (formik.values.flagChips.includes(val)) {
			toast.error("This flag already exists");
			return;
		}
		formik.setFieldValue("flagChips", [...formik.values.flagChips, val]);
		formik.setFieldValue("flags", "");
		formik.setFieldError("flagChips", undefined);
		formik.setFieldTouched("flagChips", false);
	};

	// File handlers
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		const { name } = e.target;
		if (!file) return;

		if (name === "walkthroughFile") {
			const res = validateWalkthroughFile(file);
			if (!res.ok) {
				toast.error(res.message);
				e.target.value = null;
				return;
			}
			formik.setFieldValue("walkthroughFile", file);
		} else if (name === "thumbnailFile") {
			const res = validateThumbnailFile(file);
			if (!res.ok) {
				toast.error(res.message);
				e.target.value = null;
				return;
			}
			formik.setFieldValue("thumbnailFile", file);
		}
	};

	const handleFileDelete = (field) => {
		formik.setFieldValue(field, null);
		if (field === "walkthroughFile" && walkthroughFileRef?.current) walkthroughFileRef.current.value = null;
		if (field === "thumbnailFile" && thumbnailFileRef?.current) thumbnailFileRef.current.value = null;
	};

	const handleSubmitClick = async () => {
		const errors = await formik.validateForm();
		console.log('erors', errors)
		if (Object.keys(errors).length > 0) {
			formik.setTouched({
				gameName: true,
				description: true,
				flagChips: true,
				rulesAndRegulations: true,
				flagInformation: true,
				category: true,
				score: true,
				websiteUrl: true,
				time: true,
				severity: true,
			});
			Object.keys(errors).forEach((k) => {
				const msg = errors[k];
				if (typeof msg === "string") toast.error(`${k}: ${msg}`);
				else if (Array.isArray(msg)) msg.forEach((m) => toast.error(`${k}: ${m}`));
			});
			return false;
		}

		const values = formik.values;
		const formData = new FormData();
		formData.append("name", values.gameName);
		formData.append("description", values.description);
		formData.append("flags", values.flagChips.join(","));
		formData.append("rules_regulations_text", values.rulesAndRegulations);
		formData.append("flag_content_text", values.flagInformation);
		formData.append("category_id", values.category);
		formData.append("game_points", values.score);
		formData.append("game_url", values.websiteUrl);
		formData.append("time_limit", values.time);
		formData.append("assigned_severity", values.severity);
		if (values.walkthroughFile) formData.append("walkthrough_file", values.walkthroughFile);
		if (values.thumbnailFile) formData.append("thumbnail", values.thumbnailFile);

		try {
			const response = isEdit ? await updateWebScenario(id, formData) : await createWebScenario(formData);
			if (response.status === 201 || response.status === 200) {
				toast.success(isEdit ? "Scenario updated." : "Scenario created.");
				navigate("/webScenarios/categories");
			}
		} catch (err) {
			const errs = err.response?.data?.errors;
			if (errs && typeof errs === "object") {
				Object.keys(errs).forEach((fieldName) => {
					const errorMessage = errs[fieldName];
					if (typeof errorMessage === "string") {
						toast.error(`${fieldName.replace(/_/g, " ")}: ${errorMessage}`);
					} else if (Array.isArray(errorMessage)) {
						errorMessage.forEach((msg) => toast.error(`${fieldName.replace(/_/g, " ")}: ${msg}`));
					} else if (typeof errorMessage === "object") {
						Object.keys(errorMessage).forEach((sub) => {
							toast.error(`${fieldName.replace(/_/g, " ")}.${sub}: ${errorMessage[sub]}`);
						});
					}
				});
			} else {
				toast.error("Something went wrong");
			}
		}
	};

	return (
		<>
			<BreadCrumbs
				breadcrumbs={[
					{ name: "Dashboard", link: "/" },
					{ name: isEdit ? "Update Web Scenario" : "Create Web Scenario", link: "/webScenarios/create" },
				]}
			/>
			<Stack p={5}>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography component="h1" variant="h2">
						{isEdit ? "Update" : "Create"} Web Scenarios
					</Typography>
					<Button variant="contained" onClick={handleSubmitClick}>
						Submit
					</Button>
				</Stack>

				<Stack margin={5} gap={4}>
					<Stack gap={4} justifyContent="center" alignItems="center" bgcolor="background.secondary" borderRadius={4} padding={8}>
						<TextField
							label="Game Name"
							variant="outlined"
							fullWidth
							name="gameName"
							value={formik.values.gameName}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.gameName && Boolean(formik.errors.gameName)}
							helperText={formik.touched.gameName && formik.errors.gameName}
						/>

						<Stack width="100%" direction="row" spacing={2}>
							<FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
								<InputLabel>Select Category</InputLabel>
								<Select name="category" value={formik.values.category} label="Select Category" onChange={formik.handleChange} onBlur={formik.handleBlur}>
									{webScenarioCategoriesData.map((cat) => (
										<MenuItem key={cat.category_id} value={cat.category_id}>
											{cat.name}
										</MenuItem>
									))}
								</Select>
								{formik.touched.category && formik.errors.category && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
										{formik.errors.category}
									</Typography>
								)}
							</FormControl>

							<FormControl fullWidth error={formik.touched.severity && Boolean(formik.errors.severity)}>
								<InputLabel>Severity</InputLabel>
								<Select name="severity" value={formik.values.severity} label="Severity" onChange={formik.handleChange} onBlur={formik.handleBlur}>
									<MenuItem value="very_easy">Very Easy</MenuItem>
									<MenuItem value="easy">Easy</MenuItem>
									<MenuItem value="medium">Medium</MenuItem>
									<MenuItem value="hard">Hard</MenuItem>
									<MenuItem value="very_hard">Very Hard</MenuItem>
								</Select>
								{formik.touched.severity && formik.errors.severity && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
										{formik.errors.severity}
									</Typography>
								)}
							</FormControl>
						</Stack>

						<Stack width="100%" direction="row" spacing={2}>
							<TextField
								label="Score"
								variant="outlined"
								fullWidth
								name="score"
								value={formik.values.score}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.score && Boolean(formik.errors.score)}
								helperText={formik.touched.score && formik.errors.score}
							/>
							<FormControl fullWidth error={formik.touched.time && Boolean(formik.errors.time)}>
								<InputLabel>Time</InputLabel>
								<Select name="time" value={formik.values.time} label="Time" onChange={formik.handleChange} onBlur={formik.handleBlur}>
									<MenuItem value="1">1 Hour</MenuItem>
									<MenuItem value="2">2 Hours</MenuItem>
									<MenuItem value="3">3 Hours</MenuItem>
									<MenuItem value="4">4 Hours</MenuItem>
									<MenuItem value="5">5 Hours</MenuItem>
								</Select>
								{formik.touched.time && formik.errors.time && (
									<Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
										{formik.errors.time}
									</Typography>
								)}
							</FormControl>
						</Stack>

						<TextField
							label="Website URL"
							variant="outlined"
							fullWidth
							name="websiteUrl"
							value={formik.values.websiteUrl}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={formik.touched.websiteUrl && Boolean(formik.errors.websiteUrl)}
							helperText={formik.touched.websiteUrl && formik.errors.websiteUrl}
						/>

						<FlagInput
							value={{
								name: "flags",
								value: formik.values.flags,
								onBlur: formik.handleBlur,
							}}
							chips={formik.values.flagChips}
							onChange={formik.handleChange}
							onAdd={handleFlagAdd}
							onDelete={handleDeleteChip}
							error={formik.touched.flags && formik.errors.flags}
							touched={formik.touched.flagChips}
						/>

						<EditorsSection label="Description" value={formik.values.description} setValue={(t) => formik.setFieldValue("description", t)} error={formik.errors.description} />
						<EditorsSection label="Flag Information" value={formik.values.flagInformation} setValue={(t) => formik.setFieldValue("flagInformation", t)} error={formik.errors.flagInformation} />
						<EditorsSection label="Rules and Regulation" value={formik.values.rulesAndRegulations} setValue={(t) => formik.setFieldValue("rulesAndRegulations", t)} error={formik.errors.rulesAndRegulations} />

						<Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" spacing={2}>
							<FileUploadCard
								file={formik.values.walkthroughFile}
								fileUrl={formik.values.walkthroughUrl}
								inputRef={walkthroughFileRef}
								inputProps={{ id: "walkthrough-upload", type: "file", accept: "application/pdf", name: "walkthroughFile", onChange: handleFileChange }}
								onClickUpload={() => walkthroughFileRef.current && walkthroughFileRef.current.click()}
								onDelete={() => handleFileDelete("walkthroughFile")}
								type="pdf"
								error={formik.touched.walkthroughFile && formik.errors.walkthroughFile}
							/>

							<FileUploadCard
								file={formik.values.thumbnailFile}
								fileUrl={formik.values.thumbnailUrl}
								inputRef={thumbnailFileRef}
								inputProps={{ id: "thumbnail-upload", type: "file", accept: "image/*", name: "thumbnailFile", onChange: handleFileChange }}
								onClickUpload={() => thumbnailFileRef.current && thumbnailFileRef.current.click()}
								onDelete={() => handleFileDelete("thumbnailFile")}
								type="image"
								error={formik.touched.thumbnailFile && formik.errors.thumbnailFile}
							/>
						</Stack>
					</Stack>
				</Stack>

				<ToastContainer />
			</Stack>
		</>
	);
};

export default CreateWebScenarios;
