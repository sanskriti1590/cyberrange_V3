import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import MilestoneFlag from "./MilestoneFlag";
import Teams from "./Teams";

import FullScreenDialog from "../CreateCorporate/scenarioDialog";
import ScenarioWalkthrough from "../scenarioWalkthrough";
import { Icons } from "../../../components/icons";
import { toast } from "react-toastify";

// Local storage key (bump version when shape changes)
const STORAGE_KEY = "milestoneFormDraft_v1";

// Returns a default question object
function getDefaultQuestion() {
  return {
    name: "",
    description: "",
    hint: "",
    score: 1,
    index: 0,
  };
}

// Initial team data with default questions
const initialTeamData = [
  {
    title: "Blue Team Milestone",
    walkthrough: [],
    questionInformation: [getDefaultQuestion()],
    color: "#7A5AF8",
    active: true,
  },
  {
    title: "Red Team Milestone",
    walkthrough: [],
    questionInformation: [getDefaultQuestion()],
    color: "#CC2E28",
    active: false,
  },
  {
    title: "Purple Team Milestone",
    walkthrough: [],
    questionInformation: [getDefaultQuestion()],
    color: "#9747FF",
    active: false,
  },
  {
    title: "Yellow Team Milestone",
    walkthrough: [],
    questionInformation: [getDefaultQuestion()],
    color: "#F79D28",
    active: false,
  },
];

const getFreshMilestoneTeams = () =>
  initialTeamData.map(team => ({
    ...team,
    walkthrough: [],
    questionInformation: team.questionInformation
      ? team.questionInformation.map(question => ({ ...question }))
      : [getDefaultQuestion()],
  }));

const MileStone = ({ setToggle, setMileData, handleApi, mile }) => {
  const [data, setData] = useState(() => getFreshMilestoneTeams());

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Defensive: ensure shape and don't restore files
        const restored = parsed.map((team) => ({
          ...team,
          walkthrough: [],
          questionInformation:
            team.questionInformation && team.questionInformation.length
              ? team.questionInformation
              : [getDefaultQuestion()],
        }));
        setData(restored);
        toast.info("Loaded saved draft");
      }
    } catch (err) {
      console.warn("Failed to load milestone draft:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save to localStorage whenever `data` changes.
  // IMPORTANT: we explicitly strip out any file data (walkthrough) so only text is stored.
  useEffect(() => {
    try {
      const toSave = data.map((team) => ({
        title: team.title,
        color: team.color,
        active: Boolean(team.active),
        // Save only the questionInformation (text fields + score/index). Remove any file references.
        questionInformation: team.questionInformation
          ? team.questionInformation.map((q) => ({
            // Only keep textual fields and score/index
            name: q.name || "",
            description: q.description || "",
            hint: q.hint || "",
            score: q.score || 1,
            index: q.index || 0,
          }))
          : [getDefaultQuestion()],
        // do not save walkthrough/files
        walkthrough: [],
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      console.warn("Failed to save milestone draft:", err);
    }
  }, [data]);

  useEffect(() => { }, [mile]); // Empty effect, could be used if mile changes

  // Clear draft from localStorage and reset form to initial
  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(getFreshMilestoneTeams());
    toast.success("Draft cleared");
  };

  // Validation for individual questions: all fields must be filled (new)
  const validation = (data) => {
    if (!data.name || !data.description || !data.hint || !data.score) {
      return true;
    }
  };

  // Validation for the first question: allow empty first question (new)
  const validationFirst = (data) => {
    if (!data.name && !data.description && !data.hint) {
      return true;
    }
  };


  // Handles data validation and prepares team arrays before API submission (updated)
  // Handles data validation and prepares team arrays before API submission (updated: always include team keys)
  const handleData = async () => {
    // helper: does this question have any meaningful text?
    const questionHasContent = (q) =>
      Boolean((q.name && q.name.trim()) || (q.description && q.description.trim()) || (q.hint && q.hint.trim()));

    // helper: does this team contain at least one meaningful question?
    const teamHasEntries = (team) => {
      if (!team?.questionInformation || team.questionInformation.length === 0) return false;
      return team.questionInformation.some((q) => questionHasContent(q));
    };

    // Quick check: require at least one team to have an entry
    const teamsWithAnyEntryCount = data.reduce((acc, team) => (teamHasEntries(team) ? acc + 1 : acc), 0);
    if (teamsWithAnyEntryCount === 0) {
      toast.error("Atleast one question is required");
      return false;
    }

    // Validate all questions for each team (unchanged)
    for (let j = 0; j < data.length; j++) {
      const team = data[j];
      if (team.questionInformation.length === 0) continue;

      for (let k = 0; k < team.questionInformation.length; k++) {
        const question = team.questionInformation[k];
        if (k === 0 && validationFirst(question)) continue;

        if (validation(question)) {
          toast.error(`All field are required in ${team.title}`);
          return false;
        }
      }
    }

    // Build cleaned team arrays (only include questions that have content)
    const cleanedTeams = {
      blue: [],
      red: [],
      purple: [],
      yellow: [],
    };

    data.forEach((team) => {
      const cleanedQuestions = (team.questionInformation || []).filter((q) => questionHasContent(q));
      if (team.title === "Blue Team Milestone") cleanedTeams.blue = cleanedQuestions;
      if (team.title === "Red Team Milestone") cleanedTeams.red = cleanedQuestions;
      if (team.title === "Purple Team Milestone") cleanedTeams.purple = cleanedQuestions;
      if (team.title === "Yellow Team Milestone") cleanedTeams.yellow = cleanedQuestions;
    });

    // Keep parent setter call (same order as before)
    setMileData(cleanedTeams.red, cleanedTeams.blue, cleanedTeams.yellow, cleanedTeams.purple);

    // ALWAYS include keys in the payload (empty arrays allowed)
    const milestonePayload = {
      red_team: cleanedTeams.red,
      blue_team: cleanedTeams.blue,
      yellow_team: cleanedTeams.yellow,
      purple_team: cleanedTeams.purple,
    };

    const milestoneObj = JSON.stringify(milestonePayload);

    // Prepare walkthrough arrays — include walkthroughs only if team has entries, else empty array
    const findTeam = (title) => data.find((t) => t.title === title) || { walkthrough: [] };

    const blueWalkthrough = teamHasEntries(findTeam("Blue Team Milestone"))
      ? findTeam("Blue Team Milestone").walkthrough || []
      : [];
    const redWalkthrough = teamHasEntries(findTeam("Red Team Milestone"))
      ? findTeam("Red Team Milestone").walkthrough || []
      : [];
    const purpleWalkthrough = teamHasEntries(findTeam("Purple Team Milestone"))
      ? findTeam("Purple Team Milestone").walkthrough || []
      : [];
    const yellowWalkthrough = teamHasEntries(findTeam("Yellow Team Milestone"))
      ? findTeam("Yellow Team Milestone").walkthrough || []
      : [];

    // Call API to save milestone data
    return await handleApi(
      milestoneObj,
      blueWalkthrough,
      redWalkthrough,
      purpleWalkthrough,
      yellowWalkthrough
    );
  };


  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    { name: "Scenario", link: "/users" },
    { name: "Create ", link: "/createscenarios" },
  ];

  // Handles team selection changes
  const teamChangeHandler = (value) => {
    const updatedData = data.map((team) => ({
      ...team,
      active: team.color === value,
    }));
    setData(updatedData);
  };

  // Adds a new question to the active team
  const addMoreFlagButtonHandler = () => {
    const activeTeam = data?.find((team) => team.active);
    const index = activeTeam?.questionInformation.length;

    if (activeTeam) {
      const newQuestionInformation = {
        name: "",
        description: "",
        hint: "",
        score: 1,
        index: index,
      };

      const updatedData = data.map((team) => {
        if (team.active) {
          return {
            ...team,
            questionInformation: [newQuestionInformation, ...team.questionInformation],
          };
        } else return team;
      });

      setData(updatedData);
    }
  };

  // Updates a field for a specific question in the active team
  const updateFieldHandler = (index, field, value) => {
    const updatedData = [...data];
    updatedData.forEach((team) => {
      if (team.active) team.questionInformation[index][field] = value;
    });
    setData(updatedData);
  };

  // Handles milestone form submission
  const onSubmit = async () => {
    return await handleData();
  };

  // Deletes a specific question from the active team
  const onDeleteQuestionHandler = (questionIndex) => {
    const updatedData = data.map((team) => {
      if (team.active) {
        if (team.questionInformation.length === 1) {
          // Reset to default if only one question exists (new)
          return {
            ...team,
            questionInformation: [getDefaultQuestion()],
          };
        } else {
          return {
            ...team,
            questionInformation: team.questionInformation.filter((_, index) => index !== questionIndex),
          };
        }
      }
      return team;
    });
    setData(updatedData);
  };

  // Handles file uploads for milestone walkthroughs
  const onFileUpload = (files) => {
    const activeTeam = data.find((team) => team.active);

    if (activeTeam) {
      const updatedData = data.map((team) => {
        if (team.active) return { ...team, walkthrough: [...team.walkthrough, ...files] };
        return team;
      });

      setData(updatedData);
    }
  };

  // Deletes a file from the active team's walkthrough
  const deleteFileHandler = (fileIndex) => {
    const activeTeamIndex = data.findIndex((team) => team.active);

    if (activeTeamIndex !== -1) {
      const updatedData = [...data];
      const activeTeam = updatedData[activeTeamIndex];

      if (fileIndex >= 0 && fileIndex < activeTeam.walkthrough.length) {
        activeTeam.walkthrough = activeTeam.walkthrough.filter((_, index) => index !== fileIndex);
        updatedData[activeTeamIndex] = activeTeam;
        setData(updatedData);
      }
    }
  };

  // Determines if "Add More Milestone" button should be disabled (new)
  const isAddMoreFlagButtonDisabled = () => {
    const activeTeam = data?.find((team) => team?.active);
    if (activeTeam.questionInformation.length !== 0) {
      const firstQuestion = activeTeam?.questionInformation[0];
      const keysToCheck = Object.keys(firstQuestion).filter((key) => key !== "hint");
      return !keysToCheck.every((key) => firstQuestion[key] !== undefined && firstQuestion[key] !== "");
    }
    return true;
  };

  // Toggles back to previous view
  const toggleButton = () => {
    setToggle(0);
  };

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack px={2} py={4}>
        <Button color="secondary" sx={{ width: "80px" }} onClick={toggleButton}>
          <Icons.leftArrow />
          Back
        </Button>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography component="h1" variant="h1">
            Create
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
            {/* <Button color='error' onClick={clearDraft} sx={{ width: "160px", p: 2, borderRadius: "8px", fontWeight: 700, color: 'red' }}>
              Clear
            </Button> */}
            <FullScreenDialog onSubmit={onSubmit} scenarioId={null} datas="Save & Continue" />

          </Stack>
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="center" alignItems="center">
        <Stack p={2} sx={{ borderRadius: "16px", backgroundColor: "#16181F", width: "772px" }}>
          <Box gap={2} sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "start" }}>
            <Teams team={data} cta={teamChangeHandler} />
            <Stack gap={1} sx={{ width: "100%" }}>
              <Typography variant="h4" sx={{ color: "#9C9EA3 !important", fontWeight: "500", order: 0 }}>
                Milestone Walkthrough
              </Typography>
              <ScenarioWalkthrough
                walkthrough={data.find((team) => team.active)?.walkthrough || []}
                onFileUpload={onFileUpload}
                deleteFileHandler={deleteFileHandler}
              />
              <Box my={3} sx={{ border: "1px solid #282C38" }}></Box>

              <Button
                variant="contained"
                style={{
                  width: "fit-content",
                  fontSize: "12px !important",
                  fontWeight: "600 !important",
                  lineHeight: "16px !important",
                  borderRadius: "4px",
                  border: "none",
                  padding: "2px 16px",
                  cursor: isAddMoreFlagButtonDisabled() ? "not-allowed" : "pointer",
                  color: isAddMoreFlagButtonDisabled() ? "#005252" : "#00FFFF",
                  backgroundColor: isAddMoreFlagButtonDisabled() ? "#1C1F28" : "#002929",
                  marginBottom: "16px",
                }}
                onClick={addMoreFlagButtonHandler}
                disabled={isAddMoreFlagButtonDisabled()}
              >
                Add More Milestone
              </Button>

              <MilestoneFlag team={data} updateFieldHandler={updateFieldHandler} onDeleteQuestion={onDeleteQuestionHandler} />
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default MileStone;
