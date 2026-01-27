import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import ScenarioFlagQuestions from "./ScenarioFlagQuestions";
import Teams from "./Teams";
import ScenarioWalkthrough from "../scenarioWalkthrough";
import FullScreenDialog from "../CreateCorporate/scenarioDialog";
import ErrorHandler from "../../../ErrorHandler";
import { Icons } from "../../../components/icons";
import { toast, ToastContainer } from "react-toastify";

// Move getDefaultQuestion inside the component scope
const getDefaultQuestion = () => {
  return {
    question: "",
    answer: "",
    hint: "",
    score: 1,
    index: 0,
  };
};

const initialTeamData = [
  {
    title: "Blue Team Flags",
    walkthrough: [],
    questionInformation: [getDefaultQuestion()],
    color: "#7A5AF8",
    active: true,
  },
  {
    title: "Red Team Flags",
    walkthrough: [],
    questionInformation: [getDefaultQuestion()],
    color: "#CC2E28",
    active: false,
  },
  {
    title: "Purple Team Flags",
    walkthrough: [],
    questionInformation: [getDefaultQuestion()],
    color: "#9747FF",
    active: false,
  },
  {
    title: "Yellow Team Flags",
    walkthrough: [],
    questionInformation: [getDefaultQuestion()],
    color: "#F79D28",
    active: false,
  },
];

const ScenarioFlags = ({ setFlag, handleApi, setToggle, initialData }) => {
  // Use initialData prop if provided, otherwise use initialTeamData
  const [data, setData] = useState(initialData || initialTeamData);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const isInitialMount = useRef(true);

  // Load saved data from localStorage AND use initialData prop
  useEffect(() => {
    // console.log('ScenarioFlags mounting - initialData:', initialData);

    const savedData = localStorage.getItem('scenarioCreationData');
    // console.log('Raw saved data from localStorage:', savedData);

    let finalData = initialTeamData;

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // console.log('Parsed data:', parsedData);

        if (parsedData.flag) {
          let flagDataToLoad;

          if (parsedData.flag.flagData) {
            flagDataToLoad = parsedData.flag.flagData;
            // console.log('Loading from flag.flagData:', flagDataToLoad);
          } else {
            flagDataToLoad = parsedData.flag;
            // console.log('Loading from direct flag data:', flagDataToLoad);
          }

          if (flagDataToLoad && Array.isArray(flagDataToLoad)) {
            const validatedData = flagDataToLoad.map(team => ({
              ...team,
              walkthrough: [],
              questionInformation: team.questionInformation || [getDefaultQuestion()],
              active: team.active || false
            }));


            finalData = validatedData;
          }
        }
      } catch (error) {
        console.error('Error parsing saved flag data:', error);
      }
    }

    // Also check if we have initialData from parent
    if (initialData && Array.isArray(initialData) && initialData.length > 0) {
      // console.log('Using initialData from parent:', initialData);
      finalData = initialData;
    }

    // console.log('Final data to set:', finalData);
    setData(finalData);
    setIsDataLoaded(true);
  }, [initialData]);

  // Save flag data to parent state only when needed (debounced)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // console.log('Saving flag data to parent:', data);
    const timeoutId = setTimeout(() => {
      // Send the team data array directly to parent
      setFlag(data);
      // console.log('Updated parent flag state with team data');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [data, setFlag]);


  const validation = (data) => {
    // Return true if validation fails (fields are missing)
    // Return false if validation passes (all fields are filled)
    if (!data.question || !data.answer || !data.hint || !data.score) {
      return true; // Validation failed - some fields are missing
    }
    return false; // Validation passed - all fields are filled
  };

  const handleData = async () => {
    try {
      let blueWalkthrough = [];
      let redWalkthrough = [];
      let purpleWalkthrough = [];
      let yellowWalkthrough = [];
      let blueTeam = [];
      let redTeam = [];
      let purpleTeam = [];
      let yellowTeam = [];

      // Check if at least one properly filled question exists in any team
      let hasValidQuestion = false;

      data?.forEach((item) => {
        item.questionInformation.forEach((question) => {
          if (!validation(question)) { // If validation passes (all fields filled)
            hasValidQuestion = true;
          }
        });
      });

      if (!hasValidQuestion) {
        toast.error("At least one properly filled question is required in any team. Please fill all fields: question, answer, score, and hint.");
        return false;
      }

      // Process each team's data
      data?.forEach((item) => {
        // Filter out incomplete questions, keep only fully filled ones
        const validQuestions = item.questionInformation.filter(q =>
          q.question && q.answer && q.hint && q.score
        );

        if (item?.title === "Blue Team Flags") {
          blueTeam = validQuestions;
          blueWalkthrough = item?.walkthrough;
        } else if (item?.title === "Red Team Flags") {
          redTeam = validQuestions;
          redWalkthrough = item?.walkthrough;
        } else if (item?.title === "Purple Team Flags") {
          purpleTeam = validQuestions;
          purpleWalkthrough = item?.walkthrough;
        } else if (item?.title === "Yellow Team Flags") {
          yellowTeam = validQuestions;
          yellowWalkthrough = item?.walkthrough;
        }
      });

      const milestoneObj = JSON.stringify({
        red_team: redTeam,
        blue_team: blueTeam,
        yellow_team: yellowTeam,
        purple_team: purpleTeam,
      });

      return await handleApi(
        milestoneObj,
        blueWalkthrough,
        redWalkthrough,
        purpleWalkthrough,
        yellowWalkthrough
      );

    } catch (error) {
      ErrorHandler(error);
    }
  };

  const isAddMoreFlagButtonDisabled = () => {
    const activeTeam = data.find((team) => team.active);

    if (activeTeam) {
      const firstQuestion = activeTeam.questionInformation[0];

      // Check if first question has all required fields filled
      const isFullyFilled = firstQuestion.question &&
        firstQuestion.answer &&
        firstQuestion.hint &&
        firstQuestion.score;

      // Allow adding more flags only if first question is fully filled
      return !isFullyFilled;
    }

    return true;
  };

  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    { name: "Scenario", link: "/users" },
    { name: "Create ", link: "/createCorporate" },
  ];

  const teamChangeHandler = (value) => {
    const updatedData = data.map((team) => ({
      ...team,
      active: team.color === value,
    }));
    setData(updatedData);
  };

  const addMoreFlagButtonHandler = () => {
    const activeTeam = data.find((team) => team.active);
    const index = activeTeam?.questionInformation.length;

    if (activeTeam) {
      const newQuestionInformation = getDefaultQuestion();
      newQuestionInformation.index = index;

      const updatedData = data.map((team) =>

        team.active
          ? {
            ...team,
            walkthrough: team.walkthrough || [],
            questionInformation: [
              newQuestionInformation,
              ...team.questionInformation,
            ],
          }
          : team
      );

      setData(updatedData);
    }
  };

  const updateFieldHandler = (index, field, value) => {
    const updatedData = [...data];
    updatedData.forEach((team) => {
      if (team.active) {
        team.questionInformation[index][field] = value;
      }
    });
    setData(updatedData);
  };

  const onSubmit = async () => {
    try {
      return await handleData();
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const onDeleteQuestionHandler = (questionIndex) => {
    const updatedData = data.map((team) => {
      if (team.active) {
        if (team.questionInformation.length === 1) {
          return {
            ...team,
            walkthrough: [],
            questionInformation: [getDefaultQuestion()],
          };
        } else {
          return {
            ...team,
            questionInformation: team.questionInformation.filter(
              (_, index) => index !== questionIndex
            ),
          };
        }
      } else {
        return team;
      }
    });

    setData(updatedData);
  };

  const onFileUpload = (files) => {
    const activeTeam = data.find((team) => team.active);

    if (activeTeam) {
      const updatedData = data.map((team) => {
        if (team.active) {
          return {
            ...team,
            walkthrough: [...team?.walkthrough, ...files],
          };
        } else {
          return team;
        }
      });

      setData(updatedData);
    }
  };

  const deleteFileHandler = (fileIndex) => {
    const activeTeamIndex = data.findIndex((team) => team.active);

    if (activeTeamIndex !== -1) {
      const updatedData = [...data];
      const activeTeam = updatedData[activeTeamIndex];

      if (fileIndex >= 0 && fileIndex < activeTeam.walkthrough.length) {
        activeTeam.walkthrough = activeTeam.walkthrough.filter(
          (_, index) => index !== fileIndex
        );

        updatedData[activeTeamIndex] = activeTeam;
        setData(updatedData);
      }
    }
  };

  const toggleButton = () => {
    setToggle(0);
  };

  // Show loading state while data is being restored
  if (!isDataLoaded) {
    return (
      <Stack justifyContent="center" alignItems="center" height="200px">
        <Typography>Loading saved data...</Typography>
      </Stack>
    );
  }



  return (
    <>
      <ToastContainer />
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack px={2} py={4}>
        <Button
          color="secondary"
          sx={{
            width: "80px",
          }}
          onClick={toggleButton}
        >
          <Icons.leftArrow />
          Back
        </Button>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography component="h1" variant="h1">
            Create
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
          >
            <FullScreenDialog
              onSubmit={onSubmit}
              scenarioId={null}
              datas="Save & Continue"
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Stack
          p={2}
          sx={{
            borderRadius: "16px",
            backgroundColor: "#16181F",
            width: "772px",
          }}
        >
          <Box
            gap={2}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "start",
            }}
          >
            <Teams team={data} cta={teamChangeHandler} />
            <Stack gap={1} sx={{ width: "100%" }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#9C9EA3 !important",
                  fontWeight: "500",
                  order: 0,
                }}
              >
                Flag Walkthrough
              </Typography>
              <ScenarioWalkthrough
                walkthrough={
                  data.find((team) => team.active)?.walkthrough || []
                }
                onFileUpload={onFileUpload}
                deleteFileHandler={deleteFileHandler}
              />
              <Box my={3} sx={{ border: "1px solid #282C38" }}></Box>
              <button
                style={{
                  width: "fit-content",
                  fontSize: "12px !important",
                  fontWeight: "600 !important",
                  lineHeight: "16px !important",
                  borderRadius: "4px",
                  border: "none",
                  padding: "2px 16px",
                  cursor: isAddMoreFlagButtonDisabled()
                    ? "not-allowed"
                    : "pointer",
                  color: isAddMoreFlagButtonDisabled() ? "#005252" : "#00FFFF",
                  backgroundColor: isAddMoreFlagButtonDisabled()
                    ? "#1C1F28"
                    : "#002929",
                  marginBottom: "16px",
                }}
                onClick={addMoreFlagButtonHandler}
                disabled={isAddMoreFlagButtonDisabled()}
              >
                Add More Flag
              </button>

              <ScenarioFlagQuestions
                team={data}
                updateFieldHandler={updateFieldHandler}
                onDeleteQuestion={onDeleteQuestionHandler}
              />
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default ScenarioFlags;

