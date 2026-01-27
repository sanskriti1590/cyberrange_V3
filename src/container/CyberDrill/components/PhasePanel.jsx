import React, { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";

/* ---------------------------------- */
export default function PhasePanel({ draft, setDraft, onNext, onBack }) {
  const [phaseName, setPhaseName] = useState("");
  const [phaseDesc, setPhaseDesc] = useState("");

  const addPhase = () => {
    if (!phaseName.trim()) return;

    const newPhase = {
      local_id: crypto.randomUUID(),
      phase_name: phaseName.trim(),
      description: phaseDesc.trim(),
    };

    setDraft((prev) => ({
      ...prev,
      phases: [...(prev.phases || []), newPhase],
    }));

    setPhaseName("");
    setPhaseDesc("");
  };

  return (
    <Stack spacing={4}>
      {/* ================= CREATE PHASE CARD ================= */}
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          background:
            "radial-gradient(120% 120% at top, #101820 0%, #0b0f14 60%)",
          border: "1px solid rgba(0, 255, 170, 0.35)",
          boxShadow: "0 0 0 1px rgba(0,255,170,0.15)",
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,255,170,0.15)",
              border: "1px solid rgba(0,255,170,0.4)",
            }}
          >
            <Typography color="#69f0ae">▦</Typography>
          </Box>
          <Typography variant="h6" color="white">
            Create Phase
          </Typography>
        </Stack>

        {/* Inputs */}
        <Stack spacing={2.5}>
          <TextField
            label="Phase Name"
            placeholder="e.g., Identification, Detection, Containment"
            value={phaseName}
            onChange={(e) => setPhaseName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description (Optional)"
            placeholder="Describe this phase..."
            multiline
            minRows={3}
            value={phaseDesc}
            onChange={(e) => setPhaseDesc(e.target.value)}
            fullWidth
          />

          <Button
            onClick={addPhase}
            startIcon={<span>+</span>}
            sx={{
              mt: 1,
              height: 44,
              fontWeight: 600,
              textTransform: "none",
              color: "#00110a",
              background:
                "linear-gradient(90deg, #1de9b6, #00e676)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #00e676, #1de9b6)",
              },
            }}
          >
            Add Phase
          </Button>
        </Stack>
      </Box>

      {/* ================= PHASE LIST CARD ================= */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#0b0f14",
          border: "1px solid #1b2a2a",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
          <Typography color="#69f0ae">▦</Typography>
          <Typography variant="h6" color="white">
            Phases ({draft?.phases?.length || 0})
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2, borderColor: "#1f2a2a" }} />

        <Stack spacing={1.5}>
          {(draft.phases || []).map((p, idx) => (
            <Box
              key={p.local_id || p.id || `${p.phase_name || p.name || "phase"}-${idx}`}
              sx={{
                p: 2,
                borderRadius: 2,
                background: "linear-gradient(180deg, #0e141a, #0b0f14)",
                border: "1px solid #1b2a2a",
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* Number badge */}
              <Box
                sx={{
                  minWidth: 34,
                  height: 34,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#69f0ae",
                  background: "rgba(0,255,170,0.15)",
                  border: "1px solid rgba(0,255,170,0.4)",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </Box>

              {/* Content */}
              <Stack spacing={0.3}>
                <Typography fontWeight={600} color="white">
                  {p.name}
                </Typography>
                {p.description && (
                  <Typography
                    variant="body2"
                    color="rgba(255,255,255,0.55)"
                  >
                    {p.description}
                  </Typography>
                )}
              </Stack>
            </Box>
          ))}

          {(!draft.phases || draft.phases.length === 0) && (
            <Typography color="rgba(255,255,255,0.45)">
              No phases added yet
            </Typography>
          )}
        </Stack>
      </Box>

      {/* ================= NAVIGATION ================= */}
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={onBack} sx={{ textTransform: "none" }}>
          ← Back
        </Button>
        <Button
          onClick={onNext}
          variant="contained"
          sx={{
            textTransform: "none",
            background:
              "linear-gradient(90deg, #00c853, #64dd17)",
            color: "#00110a",
            fontWeight: 600,
          }}
        >
          Next → Flags / Milestones
        </Button>
      </Stack>
    </Stack>
  );
}
