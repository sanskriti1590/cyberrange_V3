import React, { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import reImg from "../ActiveGame/2671.png";
import Card from "../../components/Card";
import BreadCrumbs from "../../components/navbar/BreadCrumb";
import { activeGameListwebScenario } from "../../APIConfig/webScenarioConfig";

export default function ActiveWebScenario() {
	const navigate = useNavigate();
	const [activeWebScenariosData, setActiveWebScenariosData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchActiveWebScenarios = async () => {
		try {
			const response = await activeGameListwebScenario();
			setActiveWebScenariosData(response?.data || []);
		} catch (error) {
			console.error("Failed to fetch active web scenarios", error);
		}
	};

	useEffect(() => {
		fetchActiveWebScenarios();
	}, [isLoading]);

	const breadcrumbs = [
		{ name: "Dashboard", link: "/" },
		{ name: "Web Scenarios", link: "/webScenarios/categories" },
		{ name: "Active Web Scenarios", link: "/webScenarios/active" },
	];

	const handlePlayNowClick = () => {
		navigate("/webScenarios/categories");
	};

	return (
		<Stack>
			<BreadCrumbs breadcrumbs={breadcrumbs} />
			<Stack spacing={2} margin={5} width="96%">
				<Typography variant="h2">Active Web Scenario</Typography>

				<Stack>
					{activeWebScenariosData.length > 0 ? (
						activeWebScenariosData.map((item, index) => {
							const scenario = {
								scenarioName: item?.game?.name,
								category: item?.game?.category?.category_name,
								time: item?.game?.time_limit,
								description: item?.game?.description,
								points: item?.game?.game_points,
								severity: item?.game?.assigned_severity,
								img: item?.game?.thumbnail,
								gameId: item?.game?.game_id,
								uniqeId: item?._id,
							};

							return (
								<Card
									key={scenario.uniqueId || index}
									screen="activegame_webscenario"
									items={scenario}
									load={isLoading}
									setLoad={setIsLoading}
								/>
							);
						})
					) : (
						<Stack justifyContent="center" alignItems="center" width="100%">
							<img src={reImg} alt="No active games" draggable={false} />
							<Typography variant="body1" textAlign="center" style={{ color: "#ACACAC" }}>
								There are no active running Web Scenarios at the moment. When you participate in any Web
								Scenario,
								<br />
								that Web Scenario will be listed here. If you wish to play now, you can start
								by clicking on the 'Play Now' button.
							</Typography>
							<Button variant="contained" color="secondary" onClick={handlePlayNowClick} sx={{ marginTop: "24px" }}>
								Play Now
							</Button>
						</Stack>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
}