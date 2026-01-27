import React, { useEffect, useRef, useState } from "react";
import { Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { webScenarioCategoriesDataGet } from "../../../RTK/admin/webScenarios/webScenarioCategoriesSlice";
import { fetchWebScenario, updateWebScenario } from "../../../APIConfig/adminConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PlusButton from "../../../components/PlusButton";
import TextEditor from "../../../components/TextEditor";
import formatFileSize from "../../../utilities/formatFileSize";
import truncateString from "../../../utilities/truncateString";
import uploadImage from "../../../components/assests/icons/upload.svg";
import pdfImage from "../../../components/assests/icons/pdf.svg";
import { Icons } from "../../../components/icons";

const EditWebScenarios = () => {
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { webScenarioCategoriesData } = useSelector(state => state.webScenarioCategories);

	const [formValues, setFormValues] = useState({
		gameName: "",
		category: "",
		severity: "",
		score: "",
		time: "",
		websiteUrl: "",
		flags: "",
		description: "",
		flagInformation: "",
		rulesAndRegulations: "",
		walkthroughFile: null,
		thumbnailFile: null
	});
	const [flagChips, setFlagChips] = useState([]);
	const [textDescription, setTextDescription] = useState("");
	const [textFlagInfo, setTextFlagInfo] = useState("");
	const [textRules, setTextRules] = useState("");
	const walkthroughFileRef = useRef(null);
	const thumbnailFileRef = useRef(null);

	// Fetch data and initialize the flag chips
	const fetchData = async () => {
		try {
			const response = await fetchWebScenario(id);
			const data = response?.data;
			if (data) {
				setFormValues({
					gameName: data?.name || "",
					category: data?.category_id || "",
					severity: data?.assigned_severity || "",
					score: data?.game_points || "",
					time: data?.time_limit || "",
					websiteUrl: data?.game_url || "",
					flags: "",
					description: data?.description || "",
					flagInformation: data?.flag_content || "",
					rulesAndRegulations: data?.rules_regulations_text || "",
					walkthroughUrl: data?.walkthrough_file_url || null,
					thumbnailUrl: data?.thumbnail || null,
					walkthroughFile: null,
					thumbnailFile: null
				});
				setFlagChips(data?.flags ? data.flags : []);
				setTextDescription(data?.description || "");
				setTextFlagInfo(data?.flag_content_text || "");
				setTextRules(data?.rules_regulations_text || "");
			}
		} catch (error) {
			console.error("Error fetching data:", error.response?.data || error.message);
		}
	};

	useEffect(() => {
		fetchData();
	}, [id]);
	useEffect(() => {
		dispatch(webScenarioCategoriesDataGet());
	}, [dispatch]);

	const handleDeleteChip = (chipToDelete) => {
		setFlagChips(chips => chips.filter(chip => chip !== chipToDelete));
	};

	const handleFlagAdd = () => {
		if (formValues.flags) {
			setFlagChips(prevChips => [...prevChips, formValues.flags]);
			setFormValues(prev => ({ ...prev, flags: "" }));
		}
	};

	const handleInputChange = (e) => {
		setFormValues({ ...formValues, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		const { name } = e.target;

		if (name === "walkthroughFile") {
			// Check if the file is a PDF and within 50 MB
			if (file && file.type === "application/pdf" && file.size <= 50 * 1024 * 1024) {
				setFormValues((prev) => ({ ...prev, walkthroughFile: file }));
			} else {
				toast.error("Walkthrough file must be a PDF and not exceed 50 MB.");
				e.target.value = null;
			}
		} else if (name === "thumbnailFile") {
			// Check if the file is an image and within 5 MB
			if (
				file &&
				file.type.startsWith("image/") &&
				file.size <= 5 * 1024 * 1024
			) {
				setFormValues((prev) => ({ ...prev, thumbnailFile: file }));
			} else {
				toast.error("Thumbnail file must be an image and not exceed 5 MB.");
				e.target.value = null;
			}
		}
	};

	const handleFileDelete = (fileType) => {
		if (fileType === "walkthroughFile") {
			setFormValues(prev => ({ ...prev, walkthroughFile: null, walkthroughUrl: null }));
			walkthroughFileRef.current.value = null;
		} else if (fileType === "thumbnailFile") {
			setFormValues(prev => ({ ...prev, thumbnailFile: null, thumbnailUrl: null }));
			thumbnailFileRef.current.value = null;
		}
	};

	const handleSubmit = async () => {
		const requiredFields = [
			formValues.gameName,
			formValues.category,
			formValues.severity,
			formValues.score,
			formValues.time,
			formValues.websiteUrl,
			textDescription,
			textFlagInfo,
			textRules
		].filter(Boolean);

		// Check if both the file and URL for walkthrough and thumbnail are empty
		const isWalkthroughMissing = !formValues.walkthroughFile && !formValues.walkthroughUrl;
		const isThumbnailMissing = !formValues.thumbnailFile && !formValues.thumbnailUrl;

		if (requiredFields.some((field) => !field) || isWalkthroughMissing || isThumbnailMissing) {
			toast.error("All fields are compulsory, including files.");
			return;
		}

		const formDataToSubmit = new FormData();
		formDataToSubmit.append("name", formValues.gameName);
		formDataToSubmit.append("description", textDescription);
		formDataToSubmit.append("flags", flagChips.join(","));
		formDataToSubmit.append("rules_regulations_text", textRules);
		formDataToSubmit.append("flag_content_text", textFlagInfo);
		formDataToSubmit.append("category_id", formValues.category);
		formDataToSubmit.append("game_points", formValues.score);
		formDataToSubmit.append("game_url", formValues.websiteUrl);
		formDataToSubmit.append("time_limit", formValues.time);
		formDataToSubmit.append("assigned_severity", formValues.severity);

		if (formValues.walkthroughFile) {
			formDataToSubmit.append("walkthrough_file", formValues.walkthroughFile);
		}

		if (formValues.thumbnailFile) {
			formDataToSubmit.append("thumbnail", formValues.thumbnailFile);
		}

		try {
			const response = await updateWebScenario(id, formDataToSubmit);
			if (response.status === 200) {
				toast.success("Scenario updated successfully.");
				navigate("/webScenarios/categories");
			}
		} catch (error) {
			console.error("Error submitting form:", error.response?.data || error.message);
			toast.error("Failed to update the scenario.");
		}
	};


	return (
		<>
			<BreadCrumbs
				breadcrumbs={[
					{ name: "Dashboard", link: "/" },
					{ name: "Edit Web Scenario", link: "/admin/webScenarioUpdate" },
				]}
			/>
			<Stack p={5}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography component="h1" variant="h2">
						Edit Web Scenarios
					</Typography>
					<Button variant="contained" onClick={handleSubmit}>
						Submit
					</Button>
				</Stack>

				<Stack margin={5} gap={4}>
					<Stack
						gap={4}
						justifyContent="center"
						alignItems="center"
						bgcolor="background.secondary"
						borderRadius={4}
						padding={8}
					>
						<TextField
							label="Game Name"
							variant="outlined"
							fullWidth
							name="gameName"
							value={formValues.gameName}
							onChange={handleInputChange}
						/>
						<Stack width="100%" direction="row" spacing={2}>
							<FormControl fullWidth>
								<InputLabel>Select Category</InputLabel>
								<Select
									name="category"
									value={formValues.category}
									label="Select Category"
									onChange={handleInputChange}
								>
									{webScenarioCategoriesData.map((category) => (
										<MenuItem
											key={category.category_id}
											value={category.category_id}
										>
											{category.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl fullWidth>
								<InputLabel>Severity</InputLabel>
								<Select
									name="severity"
									value={formValues.severity}
									label="Severity"
									onChange={handleInputChange}
								>
									<MenuItem value="very_easy">Very Easy</MenuItem>
									<MenuItem value="easy">Easy</MenuItem>
									<MenuItem value="medium">Medium</MenuItem>
									<MenuItem value="hard">Hard</MenuItem>
									<MenuItem value="very_hard">Very Hard</MenuItem>
								</Select>
							</FormControl>
						</Stack>
						<Stack width="100%" direction="row" spacing={2}>
							<TextField
								label="Score"
								variant="outlined"
								fullWidth
								name="score"
								value={formValues.score}
								onChange={handleInputChange}
							/>
							<FormControl fullWidth>
								<InputLabel>Time</InputLabel>
								<Select
									name="time"
									value={formValues.time}
									label="Time"
									onChange={handleInputChange}
								>
									<MenuItem value="1">1 Hour</MenuItem>
									<MenuItem value="2">2 Hours</MenuItem>
									<MenuItem value="3">3 Hours</MenuItem>
									<MenuItem value="4">4 Hours</MenuItem>
									<MenuItem value="5">5 Hours</MenuItem>
								</Select>
							</FormControl>
						</Stack>
						<TextField
							label="Website URL"
							variant="outlined"
							fullWidth
							name="websiteUrl"
							value={formValues.websiteUrl}
							onChange={handleInputChange}
						/>
						<Stack
							direction="row"
							justifyContent="space-between"
							width="100%"
							spacing={2}
						>
							<TextField
								label="Enter Flags"
								variant="outlined"
								fullWidth
								name="flags"
								value={formValues.flags}
								onChange={handleInputChange}
							/>
							<PlusButton onClick={handleFlagAdd} />
						</Stack>

						{flagChips.length > 0 && (
							<Stack direction="row" justifyContent="start" alignItems="center" spacing={1.5} width="100%">
								{flagChips.map((chip, index) => (
									<Chip key={index} label={chip} variant="outlined" onDelete={() => handleDeleteChip(chip)} />
								))}
							</Stack>
						)}

						{/* Description Editor */}
						<Stack width="100%" spacing={1.5} marginBottom={5.5}>
							<Typography color="#acacac !important">Description</Typography>
							<TextEditor setText={setTextDescription} text={textDescription} />
						</Stack>

						{/* Flag Information Editor */}
						<Stack width="100%" spacing={1.5} marginBottom={5.5}>
							<Typography color="#acacac !important">
								Flag Information
							</Typography>
							<TextEditor setText={setTextFlagInfo} text={textFlagInfo} />
						</Stack>

						{/* Rules and Regulations Editor */}
						<Stack width="100%" spacing={1.5} marginBottom={5.5}>
							<Typography color="#acacac !important">
								Rules and Regulation
							</Typography>
							<TextEditor setText={setTextRules} text={textRules} />
						</Stack>

						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							width="100%"
							spacing={2}
						>
							{/* Walkthrough Upload */}
							<Stack direction="column" spacing={1.5}>
								<Typography color="#acacac !important">Walkthrough</Typography>
								<Stack direction="row" spacing={2.5}>
									<Stack
										justifyContent="center"
										alignItems="center"
										sx={{
											width: "340px",
											height: "170px",
											borderRadius: "16px",
											border: "1px dashed #535660",
											cursor: "pointer",
										}}
									>
										{/* Check if there is a file from API (walkthroughUrl) */}
										{formValues.walkthroughFile || formValues.walkthroughUrl ? (
											<Stack
												justifyContent="center"
												alignItems="center"
												gap={1}
												sx={{
													width: "132px",
													height: "132px",
													borderRadius: "16px",
													border: "1px solid #242833",
													position: "relative",
												}}
											>
												{/* Close icon to remove either uploaded file or API-provided file */}
												<Icons.crossCircle
													style={{
														position: "absolute",
														top: "8px",
														right: "8px",
														cursor: "pointer",
														color: "#535660",
													}}
													onClick={() => handleFileDelete("walkthroughFile")}
												/>
												<img
													src={pdfImage}
													alt="upload"
													style={{ width: "40px", height: "40px" }}
												// onClick={()}
												/>
												<Typography
													variant="body2"
													sx={{ color: "#9C9EA3 !important" }}
												>
													{/* If there is an uploaded file, show its name, otherwise show the API-provided file name */}
													{truncateString(
														formValues.walkthroughFile
															? formValues.walkthroughFile.name
															: "Walkthrough File",
														15
													)}
												</Typography>
												<Typography
													variant="body2"
													sx={{
														color: "#9C9EA3 !important",
														fontSize: "10px !important",
													}}
												>
													{/* Show size for the uploaded file, or "From API" for API-provided file */}
													{formValues.walkthroughFile &&
														`Size - ${formatFileSize(
															formValues.walkthroughFile.size
														)}`}
												</Typography>
											</Stack>
										) : (
											// Upload prompt when no file is present
											<Stack justifyContent="center" alignItems="center"
												onClick={() => walkthroughFileRef.current.click()}>
												<img
													src={uploadImage}
													alt="upload"
													style={{ width: "40px", height: "40px" }}
												/>
												<Typography
													variant="body1"
													sx={{
														textDecoration: "underline",
														color: "#00FFFF !important",
													}}
												>
													Click to Upload
												</Typography>
												<Typography
													variant="body2"
													sx={{ color: "#6F727A !important" }}
												>
													Maximum file size 50 MB
												</Typography>
											</Stack>
										)}
										<input
											id="walkthrough-upload"
											type="file"
											accept="application/pdf"
											style={{ display: "none" }}
											name="walkthroughFile"
											ref={walkthroughFileRef}
											onChange={handleFileChange}
										/>
									</Stack>
								</Stack>
							</Stack>

							{/* Thumbnail Upload */}
							<Stack direction="column" spacing={1.5}>
								<Typography color="#acacac !important">Thumbnail</Typography>
								<Stack direction="row" spacing={2.5}>
									<Stack
										justifyContent="center"
										alignItems="center"
										sx={{
											width: "340px",
											height: "170px",
											borderRadius: "16px",
											border: "1px dashed #535660",
											cursor: "pointer",
										}}
									>
										{/* Check if there is a file from API (thumbnailUrl) */}
										{formValues.thumbnailFile || formValues.thumbnailUrl ? (
											<Stack
												justifyContent="center"
												alignItems="center"
												gap={1}
												sx={{
													width: "132px",
													height: "132px",
													borderRadius: "16px",
													border: "1px solid #242833",
													position: "relative",
												}}
											>
												{/* Close icon to remove either uploaded file or API-provided file */}
												<Icons.crossCircle
													style={{
														position: "absolute",
														top: "8px",
														right: "8px",
														cursor: "pointer",
														color: "#535660",
													}}
													onClick={() => handleFileDelete("thumbnailFile")}
												/>
												<img
													src={pdfImage}
													alt="upload"
													style={{ width: "40px", height: "40px" }}
												/>
												<Typography
													variant="body2"
													sx={{ color: "#9C9EA3 !important" }}
												>
													{/* If there is an uploaded file, show its name, otherwise show the API-provided file name */}
													{truncateString(
														formValues.thumbnailFile
															? formValues.thumbnailFile.name
															: "Thumbnail File",
														15
													)}
													{/*{truncateString(formValues.thumbnailFile.name, 15)}*/}
												</Typography>
												<Typography
													variant="body2"
													sx={{
														color: "#9C9EA3 !important",
														fontSize: "10px !important",
													}}
												>
													{/* Show size for the uploaded file, or "From API" for API-provided file */}
													{formValues.thumbnailFile
														&& `Size - ${formatFileSize(
															formValues.thumbnailFile.size
														)}`}
													{/*Size - {formatFileSize(formValues.thumbnailFile.size)}*/}
												</Typography>
											</Stack>
										) : (
											// Upload prompt when no file is present
											<Stack
												justifyContent="center"
												alignItems="center"
												onClick={() => thumbnailFileRef.current.click()}
											>
												<img
													src={uploadImage}
													alt="upload"
													style={{ width: "40px", height: "40px" }}
												/>
												<Typography
													variant="body1"
													sx={{
														textDecoration: "underline",
														color: "#00FFFF !important",
													}}
												>
													Click to Upload
												</Typography>
												<Typography
													variant="body2"
													sx={{ color: "#6F727A !important" }}
												>
													Maximum file size 5 MB
												</Typography>
											</Stack>
										)}
										<input
											id="thumbnail-upload"
											type="file"
											accept="image/*"
											style={{ display: "none" }}
											name="thumbnailFile"
											ref={thumbnailFileRef}
											onChange={handleFileChange}
										/>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</>
	);
};

export default EditWebScenarios;
