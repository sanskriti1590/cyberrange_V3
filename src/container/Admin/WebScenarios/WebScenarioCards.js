import React, { useState } from 'react';
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HTMLRenderer from "../../../components/HtmlRendering";

const WebScenarioCards = ({ item, CTAButton }) => {
	const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
	const navigate = useNavigate();



	const toggleDescription = () => {
		setIsDescriptionCollapsed(!isDescriptionCollapsed);
	};

	const renderDescription = () => {
		if (isDescriptionCollapsed) {
			return (
				<Stack sx={{ width: "100%" }}>
					<Typography variant="h5" sx={{ color: "#BCBEC1" }}>
						{item.description?.replace(/(<([^>]+)>)/gi, "").substring(0, 250)}
					</Typography>
					<Typography
						variant="h5"
						sx={{ color: "#0FF !important", cursor: "pointer" }}
						onClick={toggleDescription}
					>
						Read More
					</Typography>
				</Stack>
			);
		} else {
			return (
				<Stack sx={{ width: "100%" }}>
					<HTMLRenderer htmlContent={item.description} />
					<Typography
						variant="h5"
						sx={{ color: "#0FF !important", cursor: "pointer" }}
						onClick={toggleDescription}
					>
						Read Less
					</Typography>
				</Stack>
			);
		}
	};

	return (
		<Stack
			direction="row"
			mb={3}
			gap={3}
			sx={{
				width: "100%",
				backgroundColor: "#16181F",
				borderRadius: "12px",
				filter: item?.display === false ? 'blur(0.8px)' : 'none',
			}}
		>
			<img
				src={item?.thumbnail}
				alt="Web Scenario Thumbnail"
				style={{
					height: "170px",
					aspectRatio: "2/3",
					borderRadius: "12px 0 0 12px",
					objectFit: "cover",
					cursor: "pointer",
				}}
			// onClick={handleNavigate}
			/>
			<Stack justifyContent="space-around" p={1.5}
				sx={{
					flex: 1,
					minWidth: 0,
					wordBreak: "break-word"
				}}>
				<Stack direction="row" alignItems="center" gap={2} sx={{ marginY: 2 }}>
					<Typography variant="h2">{item.name}</Typography>
					<Typography
						variant="body3"
						sx={{
							backgroundColor: "#242833",
							borderRadius: "16px",
							padding: "4px 16px",
							color: "#BCBEC1",
						}}
					>
						{item.assigned_severity}
					</Typography>
					<Typography
						variant="body3"
						sx={{
							backgroundColor: "#242833",
							borderRadius: "16px",
							padding: "4px 16px",
							color: "#BCBEC1",
							whiteSpace: "nowrap",
						}}
					>
						{item.time_limit} Hour
					</Typography>
				</Stack>
				{renderDescription()}
			</Stack>
			{CTAButton}
		</Stack>
	);
};

export default WebScenarioCards;