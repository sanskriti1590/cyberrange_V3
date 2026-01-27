import React, { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "../../../APIConfig/axios"; // use your existing axios instance

const Question = ({ setToggle }) => {
  const [phaseInput, setPhaseInput] = useState("");
  const [phases, setPhases] = useState([]);

  const scenarioId = localStorage.getItem("scenario_id"); 
  // ⚠️ Make sure you store scenario_id after CreateCorporate API success

  const addPhase = () => {
    if (!phaseInput.trim()) {
      toast.error("Phase name cannot be empty");
      return;
    }

    setPhases([...phases, { name: phaseInput }]);
    setPhaseInput("");
  };

  const savePhasesAndContinue = async () => {
    if (phases.length === 0) {
      toast.error("Add at least one phase");
      return;
    }

    try {
      await axios.post("/corporate/scenario/phases/", {
        scenario_id: scenarioId,
        phases: phases,
      });

      // Save phases locally for dropdown usage
      localStorage.setItem("scenario_phases", JSON.stringify(phases));

      toast.success("Phases saved");
      setToggle(2); // go to Flag or Milestone page
    } catch (err) {
      toast.error("Failed to save phases");
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={() => setToggle(1)}>Back</Button>
        <Button onClick={savePhasesAndContinue}>Continue</Button>
      </Stack>

      <Typography variant="h1">Create Phases</Typography>

      <Stack spacing={2} mt={3}>
        <TextField
          label="Phase Name (e.g. Identification)"
          value={phaseInput}
          onChange={(e) => setPhaseInput(e.target.value)}
        />

        <Button variant="outlined" onClick={addPhase}>
          Add Phase
        </Button>

        {phases.map((p, i) => (
          <Typography key={i}>• {p.name}</Typography>
        ))}
      </Stack>
    </>
  );
};

export default Question;
