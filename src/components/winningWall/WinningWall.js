import React, { useState } from "react";
import {
	Avatar,
	Box,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Icons } from "../icons";
import formatDate from "../../utilities/formatDate";
import CustomModal from "../ui/CustomModal";
import Button from "@mui/material/Button";
import trash from "../../assests/icons/trash.svg";
import truncateString from "../../utilities/truncateString";
import { CSSTransition } from "react-transition-group";
import { deleteUser } from "../../APIConfig/adminConfig";   
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


const WinningWall = (props) => {
	// Destructure props and initialize state and navigate hook
	const { data, header, template, height } = props;

	const navigate = useNavigate();


	const [modalOpen, setModalOpen] = useState(false);

	const [userId, setUserID] = useState(null);
	const [toast, setToast] = useState({
  open: false,
  message: "",
  severity: "success",
});

	const MAX_CHAR_LENGTH = 30;

	// Define a function to handle user profile navigation
	const handleProfileNavigation = async (user_id) => {
		// Fetch user details from the API and navigate to the profile page
		const token = localStorage.getItem("access_token");

		// If a token exists, decode it to get user information
		if (token) {
			// Fetch user details from the UserProfileApi
			const userId = user_id
			navigate(`/playerProfile/${userId}`);
		}
	};

	if (!data) {
		// If data is undefined, return null.
		return null;
	}

	const editCTFCategoryHandler = (categoryId) => {
		navigate(`/admin/createSoloCategories/${categoryId}`);
	};

	const editScenarioCategoryHandler = (categoryId) => {
		navigate(`/admin/editSquadCategories/${categoryId}`);
	};

	const editWebScenarioCategoryHandler = (categoryId) => {
		navigate(`/admin/editWebScenarioCategories/${categoryId}`);
	};

	const openDeleteUserHandler = (userId) => {
		setUserID(userId);
		setModalOpen(true);
	};



const deleteUserHandler = async () => {
  try {
    const res = await deleteUser(userId);

    if (res.status === 202) {
      setToast({
        open: true,
        message: "User deleted successfully",
        severity: "success",
      });

      handleCloseModal();
    }
  } catch (err) {
    console.error(err);

    setToast({
      open: true,
      message:
        err?.response?.data?.errors ||
        err?.response?.data?.message ||
        "Failed to delete user",
      severity: "error",
    });
  }
};
	const handleCloseModal = () => {
		setModalOpen(false);
	};

	const styles = {
		avatar: {
			width: "24px",
			height: "24px",
		},
		cellContent: {
			color: "#9C9EA3 !important",
		},
		container: {
			borderRadius: 2,
			backgroundColor: "custom.main",
		},
		headerCell: {
			color: "#EAEAEB",
			borderBottom: "1px solid #535660",
			fontSize: "16px",
			backgroundColor: "#242833",
			paddingLeft: "24px",
		},
		rankBox: {
			width: "fit-content",
			backgroundColor: "#002929",
			borderRadius: "16px",
			padding: "4px 16px",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		rankCell: {
			display: "flex",
			justifyContent: "start",
			borderBottom: "1px solid #535660",
			paddingLeft: "24px",
		},
		rankText: {
			color: "#00FFFF !important",
		},
		table: {
			color: "#B46228 !important",
			minWidth: 450,
		},
		tableContainer: {
			maxHeight: height ? height : 600,
		},
		tableRow: {
			cursor: "pointer",

			// '&:last-child td, &:last-child th': {
			//   border: 0,
			// },
		},
		tableCell: {
			borderBottom: "1px solid #535660",
			paddingLeft: "24px",
		},
		userBox: {
			alignItems: "center",
			display: "flex",
			flexDirection: "row",
			justifyContent: "center",
			width: "fit-content",
		},
		userCell: {
			alignItems: "center",
			display: "flex",
			justifyContent: "center",
		},
	};

	const renderTableHeader = () => {
		// const tableHeaders = ['Users', 'Role', 'Badges', 'Scores'];
		const tableHeaders = {
			winningWall: ["Sr no.", "Users", "Team", "Badges", "Scores"],
			CTFCategories: [
				"Sr no.",
				"Category Name",
				"No of Solo",
				"Created Date",
				"Action",
			],
			ScenarioCategories: [
				"Sr no.",
				"Category Name",
				"No of Squad",
				"Created Date",
				"Action",
			],
			WebScenarioUserCategories: [
				"Sr no.",
				"Category Name",
				"No of Web Scenarios",
				"Created Date",
				"Action",
			],
			users: [
				"Sr no.",
				"User",
				"Role",
				"Team",
				"Squad-Score",
				"Solo Score",
				"Action",
			],
			liveScore: ["Sr no.", "Users", "Team", "Scores"],
		};
		return (
			<TableRow>
				{tableHeaders[template].map((header, index) => (
					<TableCell key={index} align="left" sx={styles.headerCell}>
						{header}
					</TableCell>
				))}
			</TableRow>
		);
	};
	const renderTableBody = () => {
		if (data?.length <= 0) return <Typography>No data available</Typography>;
		return data?.map((row, index) => (
			<>
				{template === "winningWall" && (
					<TableRow
						key={row.user_id}
						onClick={() => handleProfileNavigation(row?.user_id)}
					>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="body3" sx={styles.cellContent}>
								{index + 1}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.rankCell}>
							<Box sx={styles.userCell}>
								<Box sx={styles.userBox}>
									{/* Conditionally render Tooltip based on the length of user_full_name */}
									{row.user_full_name.length > MAX_CHAR_LENGTH ? (
										<Tooltip title={row.user_full_name} placement="top" arrow>
											<Box sx={styles.userBox}>
												<Avatar
													alt="Remy Sharp"
													src={row.user_avatar}
													style={styles.avatar}
												/>
												<Typography variant="h5" ml={1}>
													{truncateString(row.user_full_name, MAX_CHAR_LENGTH)}
												</Typography>
											</Box>
										</Tooltip>
									) : (
										<Box sx={styles.userBox}>
											<Avatar
												alt="Remy Sharp"
												src={row.user_avatar}
												style={styles.avatar}
											/>
											<Typography variant="h5" ml={1}>
												{row.user_full_name}
											</Typography>
										</Box>
									)}
								</Box>
							</Box>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Box sx={styles.rankBox}>
								<Typography variant="body3" sx={styles.rankText}>
									{row.user_role}
								</Typography>
							</Box>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="h5" sx={styles.cellContent}>
								{row.badge_earned}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="h5" sx={styles.cellContent}>
								{row.score_obtained}
							</Typography>
						</TableCell>
					</TableRow>
				)}
				{template === "CTFCategories" && (
					<TableRow key={row.ctf_category_id} sx={styles.tableRow}>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="body3" sx={styles.cellContent}>
								{index + 1}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.rankCell}>
							<Box sx={styles.userCell}>
								<Box sx={styles.userBox}>
									{/* Conditionally render Tooltip based on the length of ctf_category_name */}
									{row.ctf_category_name.length > MAX_CHAR_LENGTH ? (
										<Tooltip title={row.user_full_name} placement="top" arrow>
											<Box sx={styles.userBox}>
												<Avatar
													alt="Remy Sharp"
													src={row.ctf_category_thumbnail}
													style={styles.avatar}
												/>
												<Typography variant="h5" ml={1}>
													{truncateString(
														row.ctf_category_name,
														MAX_CHAR_LENGTH
													)}
												</Typography>
											</Box>
										</Tooltip>
									) : (
										<Box sx={styles.userBox}>
											<Avatar
												alt="Remy Sharp"
												src={row.ctf_category_thumbnail}
												style={styles.avatar}
											/>
											<Typography variant="h5" ml={1}>
												{" "}
												{row.ctf_category_name}
											</Typography>
										</Box>
									)}
								</Box>
							</Box>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="body3" sx={styles.cellContent}>
								{row.no_of_ctf}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="h5" sx={styles.cellContent}>
								{formatDate(row.created_at)}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Stack direction="row">
								<Icons.edit
									style={{ fontSize: "24px", color: "#00FFFF" }}
									onClick={() => editCTFCategoryHandler(row.ctf_category_id)}
								/>
							</Stack>
						</TableCell>
					</TableRow>
				)}
				{template === "ScenarioCategories" && (
					<TableRow key={row.scenario_category_id} sx={styles.tableRow}>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="body3" sx={styles.cellContent}>
								{index + 1}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.rankCell}>
							<Box sx={styles.userCell}>
								<Box sx={styles.userBox}>
									{/* Conditionally render Tooltip based on the length of scenario_category_name */}
									{row.scenario_category_name.length > MAX_CHAR_LENGTH ? (
										<Tooltip
											title={row.scenario_category_name}
											placement="top"
											arrow
										>
											<Box sx={styles.userBox}>
												<Avatar
													alt="Remy Sharp"
													src={row.scenario_category_thumbnail}
													style={styles.avatar}
												/>
												<Typography variant="h5" ml={1}>
													{truncateString(
														row.scenario_category_name,
														MAX_CHAR_LENGTH
													)}
												</Typography>
											</Box>
										</Tooltip>
									) : (
										<Box sx={styles.userBox}>
											<Avatar
												alt="Remy Sharp"
												src={row.scenario_category_thumbnail}
												style={styles.avatar}
											/>
											<Typography variant="h5" ml={1}>
												{" "}
												{row.scenario_category_name}
											</Typography>
										</Box>
									)}
								</Box>
							</Box>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="body3" sx={styles.cellContent}>
								{row.no_of_scenario}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="h5" sx={styles.cellContent}>
								{formatDate(row.created_at)}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Stack direction="row">
								<Icons.edit
									style={{ fontSize: "24px", color: "#00FFFF" }}
									onClick={() =>
										editScenarioCategoryHandler(row.scenario_category_id)
									}
								/>
							</Stack>
						</TableCell>
					</TableRow>
				)}
				{template === "WebScenarioUserCategories" && (
					<TableRow key={row.scenario_category_id} sx={styles.tableRow}>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="body3" sx={styles.cellContent}>
								{index + 1}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.rankCell}>
							<Box sx={styles.userCell}>
								<Box sx={styles.userBox}>
									{/* Conditionally render Tooltip based on the length of scenario_category_name */}
									{row.name.length > MAX_CHAR_LENGTH ? (
										<Tooltip
											title={row.name}
											placement="top"
											arrow
										>
											<Box sx={styles.userBox}>
												<Avatar
													alt="Remy Sharp"
													src={row.thumbnail}
													style={styles.avatar}
												/>
												<Typography variant="h5" ml={1}>
													{truncateString(
														row.name,
														MAX_CHAR_LENGTH
													)}
												</Typography>
											</Box>
										</Tooltip>
									) : (
										<Box sx={styles.userBox}>
											<Avatar
												alt="Remy Sharp"
												src={row.thumbnail}
												style={styles.avatar}
											/>
											<Typography variant="h5" ml={1}>
												{" "}
												{row.name}
											</Typography>
										</Box>
									)}
								</Box>
							</Box>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="body3" sx={styles.cellContent}>
								{row.games_count}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Typography variant="h5" sx={styles.cellContent}>
								{formatDate(row.created_at)}
							</Typography>
						</TableCell>
						<TableCell align="left" sx={styles.tableCell}>
							<Stack direction="row">
								<Icons.edit
									style={{ fontSize: "24px", color: "#00FFFF" }}
									onClick={() =>
										editWebScenarioCategoryHandler(row.category_id)
									}
								/>
							</Stack>
						</TableCell>
					</TableRow>
				)}
				{template === "users" && (
					<>
						<TableRow key={row.user_id} sx={styles.tableRow}>
							<TableCell align="left" sx={styles.tableCell}>
								<Typography variant="body3" sx={styles.cellContent}>
									{index + 1}
								</Typography>
							</TableCell>
							<TableCell align="left" sx={styles.rankCell}>
								<Box
									sx={styles.userCell}
									onClick={() => handleProfileNavigation(row?.user_id)}
								>
									<Box sx={styles.userBox}>
										{/* Conditionally render Tooltip based on the length of user_full_name */}
										{row.user_full_name.length > MAX_CHAR_LENGTH ? (
											<Tooltip title={row.user_full_name} placement="top" arrow>
												<Box sx={styles.userBox}>
													<Avatar
														alt="Remy Sharp"
														src={row.user_avatar}
														style={styles.avatar}
													/>
													<Typography variant="h5" ml={1}>
														{truncateString(
															row.user_full_name,
															MAX_CHAR_LENGTH
														)}
													</Typography>
												</Box>
											</Tooltip>
										) : (
											<Box sx={styles.userBox}>
												<Avatar
													alt="Remy Sharp"
													src={row.user_avatar}
													style={styles.avatar}
												/>
												<Typography variant="h5" ml={1}>
													{row.user_full_name}
												</Typography>
											</Box>
										)}
									</Box>
								</Box>
							</TableCell>
							<TableCell align="left" sx={styles.tableCell}>
								<Box sx={styles.rankBox}>
									<Typography variant="body3" sx={styles.rankText}>
										{row.privilege_access}
									</Typography>
								</Box>
							</TableCell>
							<TableCell align="left" sx={styles.tableCell}>
								<Typography variant="body3" sx={styles.cellContent}>
									{row.user_role}
								</Typography>
							</TableCell>
							<TableCell align="left" sx={styles.tableCell}>
								<Typography variant="body3" sx={styles.cellContent}>
									{row.scenario_total_score}
								</Typography>
							</TableCell>
							<TableCell align="left" sx={styles.tableCell}>
								<Typography variant="body3" sx={styles.cellContent}>
									{row.ctf_total_score}
								</Typography>
							</TableCell>
							<TableCell align="left" sx={styles.tableCell}>
								<Stack direction="row" spacing={2}>
									<Icons.edit
										style={{ fontSize: "24px", color: "#00FFFF" }}
										onClick={() =>
											navigate(`/admin/updateUser/${row.user_id}`)
										}
									/>
									{row.privilege_access !== "Admin" && (
									<Icons.delete
										style={{
										fontSize: "24px",
										color: "#FF3932",
										cursor: "pointer",
										}}
										onClick={() => openDeleteUserHandler(row.user_id)}
									/>
									)}
								</Stack>
							</TableCell>
						</TableRow>

						<CustomModal
							open={modalOpen}
							onClose={handleCloseModal}
							sx={{ width: "35%" }}
						>
							<Stack
								direction="column"
								justifyContent="center"
								alignItems="center"
								spacing={3}
							>
								<img src={trash} alt="trash_icon" />
								<Stack
									direction="column"
									justifyContent="center"
									alignItems="center"
								>
									<Typography variant="h2" sx={{ color: "#EAEAEB !important" }}>
										Delete User?
									</Typography>
									<Typography
										variant="h5"
										sx={{ color: "#9C9EA3 !important" }}
										mt={2}
									>
										Are you sure you want to delete this user from Solo Revmap?
									</Typography>
								</Stack>
								<Stack
									direction="row"
									justifyContent="center"
									alignItems="center"
									mt={3}
									spacing={1}
								>
									<Button variant="outlined" onClick={handleCloseModal}>
										Cancel
									</Button>
									<Button variant="contained" onClick={deleteUserHandler}>
										Delete
									</Button>
								</Stack>
							</Stack>
						</CustomModal>
					</>
				)}

				{template === "liveScore" && (
					<CSSTransition
						key={row.user_id}
						classNames="move-in"
						timeout={1000} // Set the timeout duration
					>
						<TableRow
							key={row.user_id}
							sx={styles.tableRow}
							style={{ backgroundColor: `${row.team}` }}
							onClick={() => handleProfileNavigation(row?.user_id)}
						>
							<TableCell align="left" sx={styles.tableCell}>
								<Box sx={styles.rankBox}>
									<Typography variant="body3" sx={styles.rankText}>
										{index + 1}
									</Typography>
								</Box>
							</TableCell>
							<TableCell align="left" sx={styles.tableCell}>
								<Box sx={styles.userCell}>
									<Box sx={styles.userBox}>
										{/* Conditionally render Tooltip based on the length of user_full_name */}
										{row.user_full_name.length > MAX_CHAR_LENGTH ? (
											<Tooltip title={row.user_full_name} placement="top" arrow>
												<Box sx={styles.rankBox}>
													<Avatar
														alt="Remy Sharp"
														src={row.user_avatar}
														style={styles.avatar}
													/>
													<Typography variant="h5" ml={1}>
														{truncateString(
															row.user_full_name,
															MAX_CHAR_LENGTH
														)}
													</Typography>
												</Box>
											</Tooltip>
										) : (
											<Box sx={styles.userBox}>
												<Avatar
													alt="Remy Sharp"
													src={row.user_avatar}
													style={styles.avatar}
												/>
												<Typography variant="h5" ml={1}>
													{row.user_full_name}
												</Typography>
											</Box>
										)}
									</Box>
								</Box>
							</TableCell>
							<TableCell align="left" sx={styles.tableCell}>
								<Box sx={styles.rankBox}>
									<Typography variant="body3" sx={styles.rankText}>
										{row.user_role}
									</Typography>
								</Box>
							</TableCell>
							<TableCell align="left" sx={styles.tableCell}>
								<Typography variant="h5" sx={styles.cellContent}>
									{row.total_obtained_score}/{row.total_score}
								</Typography>
							</TableCell>
						</TableRow>
					</CSSTransition>
				)}
			</>
		));
	};

return (
  <>
    <Stack pb={3} sx={styles.container}>
      {header && (
        <Typography variant="h2" m={3}>
          {header}
        </Typography>
      )}

      <TableContainer sx={styles.tableContainer}>
        <Table stickyHeader sx={styles.table}>
          <TableHead>{renderTableHeader()}</TableHead>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </TableContainer>
    </Stack>

    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={() => setToast((p) => ({ ...p, open: false }))}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        severity={toast.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  </>
);
}
export default WinningWall;