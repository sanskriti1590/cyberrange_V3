import * as React from "react";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Button, } from "@mui/material";
import { activeGameList } from "../../APIConfig/CtfConfig";
import { useNavigate } from "react-router-dom";
// import Card from "../../components/Card";
import Card from "../../components/Card";
import reImg from "../ActiveGame/2671.png";
import BreadCrumbs from "../../components/navbar/BreadCrumb";


export default function ActiveGame() {
	const navigate = useNavigate();
	const [load, setLoad] = React.useState(false);

	const handleClickOpen = () => {
		navigate("/categories/soloCategory")
	};
	const [scenariosDatas, setScenarioDatas] = useState([]);
	useEffect(() => {
		const getData = async () => {
			const data = await activeGameList();
			data?.data && setScenarioDatas(data?.data);
		};
		getData();
	}, [load]);

	const breadcrumbs = [
		{
			name: 'Dashboard',
			link: "/"
		},
		{
			name: 'Solo',
			link: "/categories/soloCategory"
		},
		{
			name: 'Active Game',
			link: "/activeGameScenario/solo"
		}

	];


	return (
		<Stack>
			<BreadCrumbs breadcrumbs={breadcrumbs} />
			<Stack spacing={2} margin={5} display="flex" width="96%">
				<Stack direction="row" justifyContent="space-between">
					<Typography variant="h2">Active Solo Games</Typography>
				</Stack>
				<Stack>
					{scenariosDatas?.length > 0 ? (
						scenariosDatas?.map((item, index) => {
							const items = {
								scenarioName: item.ctf_name,
								description: item.ctf_description,
								category: item.ctf_category_name,
								points: item.ctf_score,
								time: item.ctf_time,
								severity: item.ctf_assigned_severity,
								img: item.ctf_thumbnail,
								gameId: item.ctf_game_id


							}
							return <Card items={items} screen="activegame" setLoad={setLoad} load={load} key={index} />;

						})
					) : (
						<Stack
							justifyContent="center"
							alignContent="center"
							width="100%"
						>
							<Stack alignItems="center" justifyContent="center" padding={8}>
								<img
									src={reImg}
									alt="2671.png"
									style={{ width: "269px", height: "179px" }}
								/>
								<Typography
									style={{ fontSize: 15, color: "#ACACAC" }}
									sx={{ mb: 0.5 }}
									variant="h14"
								>
									There are no active running Solo games at the moment. When you
									participate in any Solo, that game will be listed here. If you wish to
									play now, you can start by clicking on the 'Play Now' button
								</Typography>
							</Stack>
							<Stack justifyContent='center' alignItems='center'>
								<Button
									sx={{ display: "flex", fontWeight: "bold", width: "180px" }}
									variant="contained"
									color="secondary"
									onClick={handleClickOpen}
								>
									Play Now
								</Button>

							</Stack>
						</Stack>
					)}
				</Stack>

			</Stack>
		</Stack>
	);
}
