import { Box, Collapse, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TransitionGroup } from "react-transition-group";
import { Icons } from "../../../components/icons";

const ScenarioFlagQuestionsCard = ({
  index,
  teamData,
  updateFieldHandler,
  onDeleteQuestion,
  length
}) => {
  const formatCount = (value) => String(value).padStart(2, "0");

  const onDeleteClick = () => {
    onDeleteQuestion(index);
  };

  // useEffect(() => {
  //   console.log('Question card data:', teamData);
  // }, [teamData]);

  const fieldChangeHandler = (field, value) => {
    updateFieldHandler(index, field, value);
  };

  const isDeleteButtonVisible = () => {
    return (
      teamData.question &&
      teamData.answer &&
      teamData.score !== undefined
    );
  };

  return (
    <Stack gap={1.5} sx={{ minWidth: "90%" }}>
      <input
        value={teamData.question || ""}
        placeholder={`${length}. Enter Flag Name`}
        onChange={(event) =>
          fieldChangeHandler("question", event.target.value.trimStart())
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
        placeholder="Add Flag Answer"
        value={teamData.answer || ""}
        onChange={(event) => fieldChangeHandler("answer", event.target.value)}
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
        value={teamData.hint || ""}
        onChange={(event) => fieldChangeHandler("hint", event.target.value)}
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
            value={formatCount(teamData.score || 1)}
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
              if ((teamData.score || 1) <= 100)
                fieldChangeHandler("score", (teamData.score || 1) + 1);
            }}
          >
            {(teamData.score || 1) >= 100 ? "" : "+"}
          </Typography>
        </Stack>
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
            Delete question
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

const ScenarioFlagQuestions = ({
  team,
  updateFieldHandler,
  onDeleteQuestion,
}) => {
  const [activeTeam, setActiveTeam] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // console.log('ScenarioFlagQuestions - Team data received:', team);

    if (team && team.length > 0) {
      // Find active team or default to first team
      let currentActiveTeam = team.find((t) => t.active);

      // If no active team found, set first team as active and update parent
      if (!currentActiveTeam && team.length > 0) {
        currentActiveTeam = { ...team[0], active: true };
        // console.log('No active team found, setting first team as active:', currentActiveTeam);
      }

      setActiveTeam(currentActiveTeam);
      // console.log('Active team data set:', currentActiveTeam);
    }

    setIsInitialized(true);
  }, [team]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <Stack justifyContent="center" alignItems="center" height="100px">
        <Typography>Initializing questions...</Typography>
      </Stack>
    );
  }

  // Show message if no team data is available
  if (!activeTeam || !activeTeam.questionInformation) {
    return (
      <Stack justifyContent="center" alignItems="center" height="100px">
        <Typography>No questions available. Start by adding a flag.</Typography>
      </Stack>
    );
  }

  // Show message if no questions in active team
  if (!activeTeam.questionInformation || activeTeam.questionInformation.length === 0) {
    return (
      <Stack justifyContent="center" alignItems="center" height="100px">
        <Typography>No questions found for this team.</Typography>
      </Stack>
    );
  }

  return (
    <>
      <Stack gap={4} sx={{ width: "100%" }}>
        <TransitionGroup>
          {activeTeam.questionInformation.map((item, index) => (
            <Collapse key={`${activeTeam.title}-${index}`}>
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
                    justifyContent: "center",
                    alignContent: "center",
                    textAlign: "center",
                    flexWrap: "wrap",
                    px: "6px",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                  }}
                >
                  <Typography sx={{ display: "flex", flexDirection: "column" }}>
                    <Icons.location style={{ fontSize: "32px" }} />
                    {activeTeam.questionInformation.length - index < 10
                      ? `0${activeTeam.questionInformation.length - index}`
                      : activeTeam.questionInformation.length - index}
                  </Typography>
                </Box>
                <ScenarioFlagQuestionsCard
                  length={activeTeam.questionInformation.length - index}
                  key={`${activeTeam.title}-card-${index}`}
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

export default ScenarioFlagQuestions;