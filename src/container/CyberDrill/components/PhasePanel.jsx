import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

/* ========================================================= */
/* ===================== PHASE PANEL ======================= */
/* ========================================================= */

export default function PhasePanel({ draft, setDraft, onNext, onBack }) {
  const [phaseName, setPhaseName] = useState("");
  const [phaseDesc, setPhaseDesc] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  /* ---------------- RELOAD SAFE INIT ---------------- */
  useEffect(() => {
    if (!draft.phases) {
      setDraft((p) => ({ ...p, phases: [] }));
    }
  }, [draft.phases, setDraft]);

  /* ---------------- ADD PHASE ---------------- */
  const addPhase = () => {
    if (!phaseName.trim()) return;

    const newPhase = {
      local_id: crypto.randomUUID(),
      phase_name: phaseName.trim(),
      name: phaseName.trim(), // backend + UI safe
      description: phaseDesc.trim(),
    };

    setDraft((prev) => ({
      ...prev,
      phases: [...(prev.phases || []), newPhase],
    }));

    setPhaseName("");
    setPhaseDesc("");
  };

  /* ---------------- DELETE PHASE ---------------- */
  const deletePhase = (id) => {
    setDraft((prev) => ({
      ...prev,
      phases: prev.phases.filter(
        (p) => (p.local_id || p.id) !== id
      ),
    }));
  };

  /* ---------------- START EDIT ---------------- */
  const startEdit = (phase) => {
    setEditingId(phase.local_id || phase.id);
    setEditName(phase.phase_name || phase.name || "");
    setEditDesc(phase.description || "");
  };

  /* ---------------- SAVE EDIT ---------------- */
  const saveEdit = () => {
    setDraft((prev) => ({
      ...prev,
      phases: prev.phases.map((p) => {
        const pid = p.local_id || p.id;
        if (pid !== editingId) return p;

        return {
          ...p,
          phase_name: editName.trim(),
          name: editName.trim(),
          description: editDesc.trim(),
        };
      }),
    }));

    setEditingId(null);
    setEditName("");
    setEditDesc("");
  };

  /* ========================================================= */

  return (
    <Stack spacing={4}>
      {/* ================= CREATE PHASE ================= */}
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          background:
            "radial-gradient(120% 120% at top, #101820 0%, #0b0f14 60%)",
          border: "1px solid rgba(0,255,170,0.35)",
          boxShadow: "0 0 0 1px rgba(0,255,170,0.15)",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
          <Typography color="#69f0ae" fontSize={20}>
            ⬢
          </Typography>
          <Typography variant="h6" color="white">
            Add Kill-Chain Phase
          </Typography>
        </Stack>

        <Stack spacing={2.5}>
          <TextField
            label="Phase Name"
            value={phaseName}
            onChange={(e) => setPhaseName(e.target.value)}
            placeholder="Identification, Detection, Containment…"
            fullWidth
          />

          <TextField
            label="Description (Optional)"
            multiline
            minRows={3}
            value={phaseDesc}
            onChange={(e) => setPhaseDesc(e.target.value)}
            fullWidth
          />

          <Button
            onClick={addPhase}
            sx={{
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
            + Add Phase
          </Button>
        </Stack>
      </Box>

      {/* ================= PHASE LIST ================= */}
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#0b0f14",
          border: "1px solid #1b2a2a",
        }}
      >
        <Stack direction="row" spacing={1.5} mb={2}>
          <Typography color="#69f0ae">⬢</Typography>
          <Typography variant="h6" color="white">
            Phases ({draft.phases?.length || 0})
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2, borderColor: "#1f2a2a" }} />

        <Stack spacing={1.5}>
          {(draft.phases || []).map((p, idx) => {
            const pid = p.local_id || p.id;
            const isEditing = editingId === pid;

            return (
              <Box
                key={pid}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background:
                    "linear-gradient(180deg, #0e141a, #0b0f14)",
                  border: "1px solid #1b2a2a",
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                }}
              >
                {/* INDEX */}
                <Box
                  sx={{
                    minWidth: 34,
                    height: 34,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 700,
                    color: "#69f0ae",
                    background: "rgba(0,255,170,0.15)",
                    border: "1px solid rgba(0,255,170,0.4)",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </Box>

                {/* CONTENT */}
                <Stack flex={1} spacing={1}>
                  {isEditing ? (
                    <>
                      <TextField
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        size="small"
                        label="Phase Name"
                      />
                      <TextField
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        size="small"
                        label="Description"
                        multiline
                        minRows={2}
                      />
                    </>
                  ) : (
                    <>
                      <Typography fontWeight={600} color="white">
                        {p.phase_name || p.name}
                      </Typography>
                      {p.description && (
                        <Typography
                          variant="body2"
                          color="rgba(255,255,255,0.55)"
                        >
                          {p.description}
                        </Typography>
                      )}
                    </>
                  )}
                </Stack>

                {/* ACTIONS */}
                <Stack direction="row" spacing={0.5}>
                  {isEditing ? (
                    <>
                      <Tooltip title="Save">
                        <IconButton onClick={saveEdit} color="success">
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton
                          onClick={() => setEditingId(null)}
                          color="inherit"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => startEdit(p)}
                          color="info"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => deletePhase(pid)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </Box>
            );
          })}

          {draft.phases?.length === 0 && (
            <Typography color="rgba(255,255,255,0.45)">
              No phases added yet
            </Typography>
          )}
        </Stack>
      </Box>

      {/* ================= NAV ================= */}
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={onBack} sx={{ textTransform: "none" }}>
          ← Back
        </Button>
        <Button
          onClick={onNext}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            background:
              "linear-gradient(90deg, #00c853, #64dd17)",
            color: "#00110a",
          }}
        >
          Next → Flags / Milestones
        </Button>
      </Stack>
    </Stack>
  );
}
