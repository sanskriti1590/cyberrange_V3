import React from "react";
import { Stack, Typography } from "@mui/material";

const formatCount = (value) => String(value).padStart(2, "0");

const TeamCard = ({ title, questionCount, titleColor, status, cta }) => (
  <Stack
    sx={{
      cursor: "pointer",
      width: "150px",
      padding: "12px 16px",
      backgroundColor: status ? "#1C1F28" : "transparent",
      borderBottom: status ? "1px solid #0FF" : "none",
      borderRadius: "12px 12px 0px 0px",
      transition: "all 0.3s ease-in-out",
      ":hover": {
        backgroundColor: status ? "#1C1F28" : "#1C1F28",
      },
    }}
    onClick={() => cta(titleColor)}
  >
    <Typography variant="h5" sx={{ color: `${titleColor} !important` }}>
      {title}
    </Typography>
    <Typography variant="h5" sx={{ color: `${titleColor} !important` }}>
      {" "}
      ({formatCount(questionCount)} Questions)
    </Typography>
  </Stack>
);

const filterValidObjects = (data) => {
  return data.filter((item) => {
    const nonEmptyKeys = Object.keys(item).filter(
      (key) => key !== "score" && key !== "hint" && key !== "index" && item[key] !== ""
    );
    return (
      nonEmptyKeys.length > 1 ||
      (nonEmptyKeys.length === 1 )
    );
  });
};

const Teams = ({ team, cta }) => (
  <Stack gap={1}>
    {team?.map((teamData, index) => (
      <TeamCard
        key={index}
        title={teamData.title}
        // questionCount={teamData.questionInformation.length}
        questionCount={filterValidObjects(teamData.questionInformation).length}
        titleColor={teamData.color}
        status={teamData.active}
        cta={() => cta(teamData.color)}
      />
    ))}
  </Stack>
);

export default Teams;
