import React from "react";
import WebScenarioWithCategories from "./webScenariosWithCategories";
import { useNavigate } from "react-router-dom";

const WebScenarioUserCategories = () => {
  const navigate = useNavigate();

  const handleGetPointsClick = (id) => {
    navigate(`/webScenarios/webScenarioDetails/${id?.game_id}`);
  };

  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    { name: "Web Scenario Categories", link: "/webScenarios/categories" },
  ];

  return (
    <WebScenarioWithCategories
      actionLabel="Get Points"
      actionHandler={handleGetPointsClick}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default WebScenarioUserCategories;
