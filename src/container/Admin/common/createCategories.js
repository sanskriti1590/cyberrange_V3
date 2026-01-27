import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import uploadFileIcon from "../../../assests/icons/upload.svg";
import { Icons } from "../../../components/icons";
import {
	addCTFCategory,
	addScenarioCategory,
	addWebScenarioCategory,
	updateCTFCategory,
	updateScenarioCategory,
	updateWebScenarioCategory,
} from "../../../APIConfig/adminConfig";
import { useNavigate } from "react-router-dom";

const CreateCategories = (props) => {
	const { template, data, categoryId } = props;
	const navigate = useNavigate();

	// Constants for max and min lengths
	const MAX_CATEGORY_NAME_LENGTH = 100;
	const MIN_DESCRIPTION_LENGTH = 50;
	const MAX_DESCRIPTION_LENGTH = 5000;

	const [formData, setFormData] = useState({
		categoryName: "",
		description: "",
		imgFile: null,
		imgBlob: null,
	});

	useEffect(() => {
		if (data) {
			setFormData({
				...formData,
				categoryName: data.category_name,
				description: data.category_description,
				imgBlob: data.category_thumbnail,
			});
		}
	}, [data]);

	const fileInputRef = useRef(null);

	const handleCategoryNameChange = (value) => {
		setFormData({ ...formData, categoryName: value });
	};

	const handleDescriptionChange = (value) => {
		setFormData({ ...formData, description: value });
	};

	const handleRemoveThumbnail = (value) => {
		setFormData({ ...formData, imgFile: null, imgBlob: null });
	};

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const allowedExtensions = ["jpg", "jpeg", "png"];
			const fileExtension = file.name.split(".").pop().toLowerCase();

			// Check if the selected file's extension is in the allowedExtensions array
			if (!allowedExtensions.includes(fileExtension)) {
				toast.error(
					"Unsupported file type. Please select a JPG, JPEG, or PNG file."
				);
				return; // Do not proceed with the upload
			}

			// Check if the selected file's size exceeds 5 MB (5 * 1024 * 1024 bytes)
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image size exceeds 5 MB.");
				return; // Do not proceed with the upload
			}
			// Read the selected file as a blob
			const reader = new FileReader();
			reader.onload = () => {
				// Get the blob data
				const imgBlob = reader.result;

				// Store the selected file and blob in state
				setFormData({
					...formData,
					imgFile: file,
					imgBlob: imgBlob,
				});
			};

			reader.readAsDataURL(file); // This will trigger the onload function when the file is read.
		}
	};

	const handleBoxClick = () => {
		// Trigger the file input when the Box is clicked
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	const validateForm = (formData) => {
		const { categoryName, description, imgBlob } = formData;
		let errorMessage = "";

		if (!categoryName.trimLeft() || !description.trimLeft() || !imgBlob) {
			errorMessage = "All fields are compulsory.";
		} else {
			if (categoryName.length > MAX_CATEGORY_NAME_LENGTH) {
				errorMessage += `Category Name cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters. `;
			}
			if (
				description.length < MIN_DESCRIPTION_LENGTH ||
				description.length > MAX_DESCRIPTION_LENGTH
			) {
				errorMessage += `Description must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters. `;
			}
		}

		return errorMessage;
	};

	const handleFormErrors = (err) => {
		const errorData = err?.response?.data?.errors
		if (err?.message) {
			toast.error(err?.message);
			return
		}
		if (errorData?.non_field_errors) {
			errorData?.non_field_errors.forEach((errorMessage) => {
				toast.error(errorMessage);
			});
		}

		for (const key in errorData) {
			if (key !== "non_field_errors") {
				const errorMessage = errorData[key];
				const formattedKey = formatKey(key);
				toast.error(`${formattedKey} - ${errorMessage}`);
			}
		}
	};

	const formatKey = (key) => {
		return key
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};
	const handleSubmit = async (event) => {
		event.preventDefault();

		// Validation logic (extracted into a separate function)
		const errorMessage = validateForm(formData);

		if (errorMessage) {
			toast.error(errorMessage);
			return;
		}

		try {
			let response;
			let successMessage;
			let action;
			let redirectPath;

			switch (template) {
				case "Create Solo":
					response = await addCTFCategory(formData);
					successMessage = response.data.message;
					redirectPath = "/admin/soloCatgories";
					break;
				case "Edit Solo":
					response = await updateCTFCategory(formData, categoryId);
					successMessage = response.data.message;
					redirectPath = "/admin/soloCatgories";
					break;
				case "Create Squad":
					response = await addScenarioCategory(formData);
					successMessage = response.data.message;
					redirectPath = "/admin/squadCategories";
					break;
				case "Edit Squad":
					response = await updateScenarioCategory(formData, categoryId);
					successMessage = response.data.message;
					redirectPath = "/admin/squadCategories";
					break;
				case "Create Web Scenario":
					response = await addWebScenarioCategory(formData, categoryId);
					successMessage = response.data.message;
					redirectPath = "/admin/webScenarioCategories";
					break;
				case "Edit Web Scenario":
					response = await updateWebScenarioCategory(formData, categoryId);
					successMessage = response.data.message;
					redirectPath = "/admin/webScenarioCategories";
					break;
			}
			toast.success(successMessage);
			navigate(redirectPath);
		} catch (error) {
			handleFormErrors(error);
		}
	};

	return (
		<>
			<Stack px={2} py={4}>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography
						componant="h1"
						variant="h2"
					>{`${template} Category`}</Typography>
					<Button variant="contained" onClick={handleSubmit}>
						Submit
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
						<input
							type="text"
							placeholder="Category Name"
							style={{
								width: "100%",
								backgroundColor: "#1C1F28",
								borderRadius: "8px",
								height: "48px",
								color: "#acacac",
								border: "none",
								padding: "12px 14px",
							}}
							maxLength={MAX_CATEGORY_NAME_LENGTH}
							value={formData.categoryName}
							onChange={(event) => handleCategoryNameChange(event.target.value)}
						/>
						<textarea
							placeholder="Description"
							style={{
								width: "100%",
								backgroundColor: "#1C1F28",
								borderRadius: "8px",
								color: "#acacac",
								border: "none",
								padding: "12px 14px",
								resize: "none",
							}}
							rows={5}
							maxLength={MAX_DESCRIPTION_LENGTH}
							value={formData.description}
							onChange={(event) => handleDescriptionChange(event.target.value)}
						/>
						<Typography componant="h3" variant="h3">
							Thumbnail
						</Typography>

						{formData.imgBlob ? (
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Box
									sx={{
										position: "relative",
										backgroundColor: "#1C1F28",
										height: "132px",
										width: "132px",
										borderRadius: "100%",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<img
										src={formData?.imgBlob}
										alt="upload_file_icon"
										style={{
											height: "100%",
											width: "100%",
											borderRadius: "100%",
										}}
									/>
									<Box
										sx={{
											position: "absolute",
											top: 0,
											right: 0,
											cursor: "pointer",
											backgroundColor: "#1C1F28",
											height: "40px",
											width: "40px",
											borderRadius: "100%",
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Icons.delete
											style={{ fontSize: "24px", color: "#FF3932" }}
											onClick={handleRemoveThumbnail}
										/>
									</Box>
								</Box>
								<Typography
									componant="body3"
									variant="body3"
									mt={1}
									sx={{ color: "#6F727A !important" }}
								>
									Maximum file size 5 MB
								</Typography>
							</Box>
						) : (
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<input
									ref={fileInputRef}
									id="file-upload"
									type="file"
									accept="image/*" // Specify accepted file types (e.g., images)
									style={{ display: "none" }}
									onChange={handleFileInputChange}
								/>
								<Stack
									sx={{
										cursor: "pointer",
										backgroundColor: "#1C1F28",
										height: "132px",
										width: "132px",
										borderRadius: "100%",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
									onClick={handleBoxClick}
								>
									<img
										src={uploadFileIcon}
										alt="upload_file_icon"
										style={{
											height: "42px",
											width: "42px",
											color: "#00FFFF !important",
										}}
									/>
								</Stack>
								<Typography
									componant="body3"
									variant="body3"
									mt={1}
									sx={{ color: "#6F727A !important" }}
								>
									Maximum file size 5 MB
								</Typography>
							</Box>
						)}
					</Stack>
				</Stack>
			</Stack>
		</>
	);
};

export default CreateCategories;