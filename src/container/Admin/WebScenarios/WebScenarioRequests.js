import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, Collapse, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import SearchBar from "../../../components/ui/SearchBar";
import { approvedUnapprovedWebScenarios, fetchWebScenario, getApprovedUnapprovedWebScenarios, updateWebScenario } from "../../../APIConfig/adminConfig";
import WebScenarioCards from "./WebScenarioCards";
import CustomModal from "../../../components/ui/CustomModal";
import { useFormik } from 'formik';
import ErrorHandler from "../../../ErrorHandler";

const WebScenarioRequests = () => {
	const navigate = useNavigate();
	const [tabValue, setTabValue] = useState(0);

	const [unApprovedData, setUnApprovedData] = useState([]);
	const [approvedData, setApprovedData] = useState([]);
	const [filteredUnApprovedData, setFilteredUnApprovedData] = useState([]);
	const [filteredApprovedData, setFilteredApprovedData] = useState([]);

	const [searchValue, setSearchValue] = useState("");
	const [modal, setModal] = useState(false);
	const [modalId, setModalId] = useState();
	const [initialGameUrl, setInitialGameUrl] = useState(''); // Track initial URL

	// Simple URL validation function
	const validateUrl = (url) => {
		if (!url) {
			return 'URL is required';
		}

		// Basic URL pattern check
		const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
		if (!urlPattern.test(url)) {
			return 'Please enter a valid URL (e.g., https://example.com/)';
		}

		return '';
	};

	// Formik setup with validation
	const formik = useFormik({
		initialValues: {
			game_url: '',
			is_approved: true
		},
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};
			const urlError = validateUrl(values.game_url);
			if (urlError) {
				errors.game_url = urlError;
			}
			return errors;
		},
		onSubmit: async (values) => {

			await handleApprove_edit(modalId, values);
		}
	});

	const handleServerError = (error) => {
		if (error.response?.status >= 500) {
			navigate("/error/serverError");
		}
	};

	const fetchData = async (isApproved) => {
		try {
			const response = await getApprovedUnapprovedWebScenarios(isApproved);
			isApproved ? setApprovedData(response?.data) : setUnApprovedData(response?.data);
		} catch (error) {
			handleServerError(error);
		}
	};

	useEffect(() => {
		fetchData(0);
	}, []);

	const handleSearch = (value) => {
		setSearchValue(value);
		const data = tabValue === 0 ? unApprovedData : approvedData;
		const setFilteredData = tabValue === 0 ? setFilteredUnApprovedData : setFilteredApprovedData;

		const filteredData = value.trim()
			? data.filter((item) => item?.name?.toLowerCase().includes(value.toLowerCase()))
			: [];

		setFilteredData(filteredData);
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
		fetchData(newValue);
	};

	//-handle Approve_edit function for approval or edit
	const handleApprove_edit = async (id, formdata) => {
		// console.log(id, formdata)
		try {
			const response = await updateWebScenario(id, { ...formdata });
			console.log(response, 'Update response');

			// Close modal and show success
			setModal(false);
			toast.success("Web-scenario approved and URL updated successfully!");

			// Refresh data
			fetchData(tabValue);

		} catch (error) {
			// console.error('Update failed:', error);
			ErrorHandler(error)
		}
	}


	const handleAction = async (id, isApprove, item) => {
		if (!isApprove) {
			try {
				const response = await approvedUnapprovedWebScenarios(id);
				if (response) {
					const updateData = isApprove
						? unApprovedData.filter((item) => item.game_id !== id)
						: approvedData.filter((item) => item.game_id !== id);

					isApprove ? setUnApprovedData(updateData) : setApprovedData(updateData);
					toast.success(response?.data?.message);
				}
			} catch (error) {
				// console.error(error);
				ErrorHandler(error)
			}
		}

		if (isApprove) {
			try {
				const response = await fetchWebScenario(id);

				if (response?.data?.game_id) {
					// Set modal data and reset form with current values
					setModal(true);
					setModalId(response?.data?.game_id);
					const currentGameUrl = response?.data?.game_url || '';

					// Set for Formik 
					formik.setValues({
						game_url: currentGameUrl,
						is_approved: true
					});
					setInitialGameUrl(currentGameUrl); // Store initial URL for comparison
				}


			} catch (error) {
				// console.error('Failed to fetch data:', error);
				// toast.error("Failed to fetch data");
				ErrorHandler(error)
			}
		}
	};

	// Check if URL has been changed from initial value
	const hasUrlChanged = formik.values.game_url !== initialGameUrl;

	// Check if form is valid for submission
	const isFormValid = formik.dirty && !formik.errors.game_url;

	const renderCTAButton = (isApprove, id, item) => (
		<Typography
			variant="h5"
			style={{
				cursor: "pointer",
				height: "fit-content",
				padding: "4px 16px",
				margin: 24,
				minWidth: "120px",
				background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
				borderRadius: "16px",
				textAlign: "center",
				color: "#EAEAEB",
			}}
			onClick={() => handleAction(id, isApprove, item)}
		>
			{isApprove ? "Approve" : "Unapprove"}
		</Typography>
	);

	const breadcrumbs = [{ name: "Web Scenario Requests", link: "/admin/webScenarioRequests" }];

	const currentData = searchValue
		? tabValue === 0
			? filteredUnApprovedData
			: filteredApprovedData
		: tabValue === 0
			? unApprovedData
			: approvedData;

	return (
		<>
			<BreadCrumbs breadcrumbs={breadcrumbs} />
			<Stack px={2} py={4}>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="h1">All Web Scenario Requests</Typography>
					<SearchBar value={searchValue} onChange={(e) => handleSearch(e.target.value.trimStart())} />
				</Stack>
			</Stack>
			<Stack px={2} py={4}>
				<Tabs value={tabValue} onChange={handleTabChange}>
					<Tab label="Recent Requests" sx={{ fontSize: "18px", fontWeight: "500", color: "#EAEAEB", textTransform: "capitalize" }} />
					<Tab label="Approved Web Scenario" sx={{ fontSize: "18px", fontWeight: "500", color: "#EAEAEB", textTransform: "capitalize" }} />
				</Tabs>

				<Box mt={2}>
					{currentData.length === 0 ? (
						<Stack direction="row" justifyContent="center" alignItems="center">
							<Typography variant="h4">No Results Found</Typography>
						</Stack>
					) : (
						<TransitionGroup>
							{currentData.map((item) => (
								<Collapse key={item.scenario_id}>
									<WebScenarioCards
										item={item}
										CTAButton={renderCTAButton(tabValue === 0, item.game_id, item)}
									/>
								</Collapse>
							))}
						</TransitionGroup>
					)}
				</Box>

				<CustomModal
					open={modal}
					sx={{ border: '1px solid white', width: '80%', maxWidth: '500px' }}
					disableExternalClick
					onClose={() => setModal(false)}
					hideCloseIcon={false}
				>
					<Box
						component="form"
						onSubmit={formik.handleSubmit}
						sx={{
							width: '100%',
							justifyContent: 'center',
							alignItems: 'center',
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
							p: 2
						}}
					>
						<Typography variant="h4" sx={{ color: '#EAEAEB', mb: 2 }}>
							Verify the URL and approve the Web-Scenario
						</Typography>
						<Box sx={{ width: '100%' }}>
							<TextField
								id="game_url"
								name="game_url"
								label="Game URL"
								variant="outlined"
								fullWidth
								autoFocus
								value={formik.values.game_url}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.game_url && Boolean(formik.errors.game_url)}
								helperText={formik.touched.game_url && formik.errors.game_url}
								placeholder="https://example.com/game"
								sx={{
									'& .MuiFormHelperText-root': {
										color: '#EAEAEB'
									}
								}}
							/>
						</Box>
						<Button
							type="submit"
							variant="contained"
							disabled={!isFormValid} // Disable if form has errors or no changes
							sx={{
								cursor: isFormValid ? "pointer" : "not-allowed",
								height: "fit-content",
								padding: "8px 24px",
								minWidth: "120px",
								background: isFormValid
									? "linear-gradient(45deg, #03688C 0%, #08BED0 100%)"
									: "linear-gradient(45deg, #666 0%, #999 100%)",
								borderRadius: "16px",
								textTransform: 'none',
								fontSize: '16px',
								fontWeight: '500',
							}}
						>
							{/* Show different text based on URL change */}
							{hasUrlChanged ? "Update & Approve" : "Approve"}
						</Button>
					</Box>
				</CustomModal>
			</Stack>
		</>
	);
};

export default WebScenarioRequests;