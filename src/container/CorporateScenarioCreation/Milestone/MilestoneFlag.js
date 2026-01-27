import { Box, Collapse, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { Icons } from "../../../components/icons";

const ScenarioFlagQuestionsCard = ({
  index,
  teamData,
  updateFieldHandler,
  onDeleteQuestion,
  length,
}) => {
  const formatCount = (value) => String(value).padStart(2, "0");

  // const handleCategoryChange = (event) => {
  //   setSelectedCategory(event.target.value);
  // };

  const onDeleteClick = () => {
    onDeleteQuestion(index);
  };

  const fieldChangeHandler = (field, value) => {
    updateFieldHandler(index, field, value);
  };

  const isDeleteButtonVisible = () => {
    return (
      teamData.name &&
      teamData.description &&
      // teamData.hint &&
      teamData.score !== undefined
    );
  };

  return (
    <Stack gap={1.5} sx={{ width: "100%" }}>
      <input
        value={teamData.name}
        placeholder={`${length}. Enter Milestone Name`}
        onChange={(event) =>
          fieldChangeHandler("name", event.target.value.replace(/^\s+/, '').replace(/\s+/g, ' '))
        }
        style={{
          width: "100%",
          backgroundColor: "#1C1F28",
          borderRadius: "8px",
          height: "48px",
          color: "#acacac",
          border: "none",
          padding: "12px 14px",
        }}
      />
      <input
        placeholder="Add Milestone description"
        value={teamData.description}
        onChange={(event) =>
          fieldChangeHandler("description", event.target.value.replace(/^\s+/, '').replace(/\s+/g, ' '))
        }
        style={{
          width: "100%",
          backgroundColor: "#1C1F28",
          borderRadius: "8px",
          height: "48px",
          color: "#acacac",
          border: "none",
          padding: "12px 14px",
        }}
      />
      <input
        placeholder="Add Hint"
        value={teamData.hint}
        onChange={(event) => fieldChangeHandler("hint", event.target.value.replace(/^\s+/, '').replace(/\s+/g, ' '))}
        style={{
          width: "100%",
          backgroundColor: "#1C1F28",
          borderRadius: "8px",
          height: "48px",
          color: "#acacac",
          border: "none",
          padding: "12px 14px",
        }}
      />

      <Stack sx={{ flexDirection: "row", gap: "12px" }}>
        <Stack
          style={{
            width: "22%",
            backgroundColor: "#1C1F28",
            borderRadius: "12px",
            height: "48px",
            border: "none",
            color: "#18985E",
            flexDirection: "row",
            gap: "8px",
            padding: "16px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#EAEAEB",
              cursor: "pointer",
            }}
            onClick={() => {
              if (teamData.score > 0)
                fieldChangeHandler("score", teamData.score - 1);
            }}
          >
            {teamData.score <= 1 ? "" : "-"}
          </Typography>
          <input
            value={formatCount(teamData.score)}
            onChange={(event) => {
              const enteredValue = event.target.value;
              if (!isNaN(enteredValue) && enteredValue !== "") {
                const newValue = parseInt(enteredValue, 10);
                fieldChangeHandler(
                  "score",
                  Math.min(Math.max(newValue, 1), 100)
                );
              }
            }}
            style={{
              width: "100%",
              backgroundColor: "#1C1F28",
              borderRadius: "8px",
              height: "48px",
              color: "#18985E",
              border: "none",
              padding: "8px 8px",
              textAlign: "center",
            }}
          />

          <Typography
            sx={{
              color: "#EAEAEB",
              cursor: "pointer",
            }}
            onClick={() => {
              if (teamData.score <= 100)
                fieldChangeHandler("score", teamData.score + 1);
            }}
          >
            {teamData.score >= 100 ? "" : "+"}
          </Typography>
        </Stack>

        {/* <Box
          gap={1}
          style={{
            position: "relative",
            backgroundColor: "#1C1F28",
            borderRadius: "12px",
            height: "48px",
            padding: "12px 14px",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          <select
            name="Select Category"
            id="role"
            value={teamData.category}
            onChange={(event) => fieldChangeHandler("category", event.target.value)}
            style={{
              backgroundColor: "#1C1F28",
              color: "#6F727A",
              border: "none",
              padding: "0",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <option
              value=""
              style={{ cursor: "pointer" }}
              disabled
              selected
              hidden
            >
              Select Category
            </option>
            <option value="RED TEAM" style={{ cursor: "pointer" }}>
              Red Team
            </option>
            <option value="WHITE TEAM" style={{ cursor: "pointer" }}>
              White Team
            </option>
            <option value="PINK TEAM" style={{ cursor: "pointer" }}>
              Pink Team
            </option>
            <option value="YELLOW TEAM" style={{ cursor: "pointer" }}>
              Yellow Team
            </option>
          </select>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "4px",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#acacac",
            }}
          ></div>
        </Box> */}
        {isDeleteButtonVisible() && (
          <Box
            onClick={onDeleteClick}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 14px",
              borderRadius: "8px",
              color: "#FA2256",
              backgroundColor: "#1C1F28",
              cursor: "pointer",
            }}
          >
            Delete name
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

const MilestoneFlag = ({ team, updateFieldHandler, onDeleteQuestion }) => {
  const [activeTeam, setActiveTeam] = useState();

  useEffect(() => {
    setActiveTeam(team.find((t) => t.active));
  }, [team]);

  return (
    <>
      <Stack gap={4} sx={{ width: "100%" }}>
        <TransitionGroup>
          {activeTeam &&
            activeTeam.questionInformation.map((item, index) => (
              <Collapse>
                <Box
                  sx={{
                    display: "flex",
                    gap: "4px",
                    my: 1,
                  }}
                >
                  <Box
                    px={1}
                    sx={{
                      display: "flex",
                      // border: "1px solid white",
                      justifyContent: "center",
                      alignContent: "center",
                      textAlign: "center",
                      flexWrap: "wrap",
                      px: "6px",
                      backgroundColor: "#1C1F28",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Icons.location style={{ fontSize: "32px" }} />
                      {activeTeam.questionInformation.length - index < 10
                        ? `0${activeTeam.questionInformation.length - index}`
                        : activeTeam.questionInformation.length - index}
                    </Typography>
                  </Box>
                  <ScenarioFlagQuestionsCard
                    length={activeTeam.questionInformation.length}
                    key={index}
                    index={index}
                    teamData={item}
                    onDeleteQuestion={onDeleteQuestion}
                    updateFieldHandler={updateFieldHandler}
                  />
                </Box>
              </Collapse>
            ))}
        </TransitionGroup>
      </Stack>
    </>
  );
};

export default MilestoneFlag;
