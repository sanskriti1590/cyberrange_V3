import { useNavigate } from "react-router-dom";
import WebScenarioWithCategories from "../../webScenarios/webScenariosWithCategories";

const WebScenarioUpdate = () => {

	const navigate = useNavigate()
	const handleEditClick = (scenario) => {
		console.log(`Edit clicked for scenario: ${scenario.game_id}`);
		navigate(`/admin/webScenarioUpdate/${scenario.game_id}`)
	};

	const breadcrumbs = [
		{ name: 'Dashboard', link: '/' },
		{ name: 'Web Scenario Categories', link: '/admin/webScenarioUpdate' },
	];

	return (
		<WebScenarioWithCategories
			actionLabel="Edit"
			actionHandler={handleEditClick}
			breadcrumbs={breadcrumbs}
		/>
	);
};

export default WebScenarioUpdate;