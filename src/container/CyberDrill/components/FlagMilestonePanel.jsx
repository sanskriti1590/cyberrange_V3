import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";

import Teams from "./Teams";
import ScenarioWalkthrough from "./scenarioWalkthrough";
import { all } from "axios";

/* ================= TEAM CONFIG ================= */

const TEAMS = [
  { key: "BLUE", title: "Blue Team Flags", color: "#7A5AF8" },
  { key: "RED", title: "Red Team Flags", color: "#CC2E28" },
  { key: "PURPLE", title: "Purple Team Flags", color: "#9747FF" },
  { key: "YELLOW", title: "Yellow Team Flags", color: "#F79D28" },
];

const buildTeamDataFromDraft = (items = []) => {
  const base = {};

  TEAMS.forEach((t) => {
    base[t.key] = {
      walkthrough: [],
      items: [],
    };
  });

  items.forEach((it) => {
    const team = (it.team || "").toUpperCase();
    if (!base[team]) return;

    base[team].items.push({
      id: it.id || crypto.randomUUID(),

      // ✅ FIXED FIELD MAPPING
      phase_id: it.phase_id || "",

      // FLAG uses "question", milestone uses "name"
      name: it.question || it.name || "",

      answer: it.answer || "",
      hint: it.hint || "",

      // backend uses score, UI uses points
      points: it.score ?? it.points ?? 100,
      hint_penalty: it.hint_penalty ?? 0,

      placeholder: it.placeholder || "",
      show_placeholder: it.show_placeholder ?? true,
      is_locked: it.is_locked ?? false,
    });
  });

  // ensure at least one item per team
  Object.keys(base).forEach((k) => {
    if (!base[k].items.length) {
      base[k].items.push(createEmptyItem());
    }
  });

  return base;
};
/* ================= DEFAULT FLAG ================= */

const createEmptyItem = () => ({
  id: crypto.randomUUID(),
  phase_id: "",
  name: "",
  answer: "",
  hint: "",
  points: 100,
  hint_penalty: 0,
  placeholder: "",
  show_placeholder: true,
  is_locked: false,
});

/* ================= MAIN ================= */

export default function FlagMilestonePanel({
  draft,
  setDraft,
  onBack,
  onNext,
}) {
  
  const phases = React.useMemo(() => {
  if (!Array.isArray(draft.phases)) return [];
  return draft.phases.map((p, idx) => ({
    id: p.local_id ?? p.id ?? `phase-${idx}`,
    name: p.phase_name ?? p.name ?? "",
  }));
}, [draft.phases]);


  const mode = draft.mode || "FLAG";

  const [activeTeam, setActiveTeam] = useState("BLUE");

 const [teamData, setTeamData] = useState(() =>
    buildTeamDataFromDraft(draft.items)
  );
  /* ========== HELPERS ========== */

  const updateItem = (index, field, value) => {
    setTeamData((prev) => ({
      ...prev,
      [activeTeam]: {
        ...prev[activeTeam],
        items: prev[activeTeam].items.map((it, i) =>
          i === index ? { ...it, [field]: value } : it
        ),
      },
    }));
  };

  const addItem = () => {
    setTeamData((prev) => ({
      ...prev,
      [activeTeam]: {
        ...prev[activeTeam],
        items: [createEmptyItem(), ...prev[activeTeam].items],
      },
    }));
  };

  const deleteItem = (index) => {
    setTeamData((prev) => ({
      ...prev,
      [activeTeam]: {
        ...prev[activeTeam],
        items:
          prev[activeTeam].items.length === 1
            ? [createEmptyItem()]
            : prev[activeTeam].items.filter((_, i) => i !== index),
      },
    }));
  };

  /* ========== NEXT ========== */

  const handleNext = () => {
    const allItems = [];

    Object.entries(teamData).forEach(([team, data]) => {
      data.items.forEach((it) => {
        if (!it.name) return;

        allItems.push({
          ...it,
          team,
        });
      });
    });
    setDraft((prev) => ({
      ...prev,
      items: allItems,
    }));

    onNext(allItems);
  };

  React.useEffect(() => {
  if (Array.isArray(draft.items)) {
    setTeamData(buildTeamDataFromDraft(draft.items));
  }
}, [draft.items]);
  /* ================= UI ================= */

  return (
    <Stack spacing={3}>
      {/* HEADER */}
<Stack
  direction="row"
  alignItems="center"
  justifyContent="space-between"
  sx={{ mb: 2 }}
>
  {/* LEFT: BACK */}
  <Button onClick={onBack}>
    Back
  </Button>


  {/* RIGHT: NEXT */}
  <Button
    variant="contained"
    onClick={handleNext}
  >
    Next
  </Button>
</Stack>

      {/* CARD */}
      <Stack alignItems="center">
        <Stack
          sx={{
            width: "780px",
            backgroundColor: "#16181F",
            borderRadius: "16px",
            p: 2,
          }}
        >
          <Box display="flex" gap={2}>
            {/* TEAMS */}
            <Teams
              team={TEAMS.map((t) => ({
                title: t.title,
                color: t.color,
                active: activeTeam === t.key,
                questionInformation: teamData[t.key].items,
              }))}
              cta={(color) =>
                setActiveTeam(
                  TEAMS.find((t) => t.color === color)?.key
                )
              }
            />

            {/* CONTENT */}
            <Stack width="100%" gap={2}>
              <ScenarioWalkthrough
                walkthrough={teamData[activeTeam].walkthrough}
                onFileUpload={(files) =>
                  setTeamData((prev) => ({
                    ...prev,
                    [activeTeam]: {
                      ...prev[activeTeam],
                      walkthrough: [
                        ...prev[activeTeam].walkthrough,
                        ...files,
                      ],
                    },
                  }))
                }
                deleteFileHandler={(idx) =>
                  setTeamData((prev) => ({
                    ...prev,
                    [activeTeam]: {
                      ...prev[activeTeam],
                      walkthrough: prev[activeTeam].walkthrough.filter(
                        (_, i) => i !== idx
                      ),
                    },
                  }))
                }
              />

              <Button onClick={addItem} sx={{ width: "fit-content" }}>
                + Add More {mode}
              </Button>

              {teamData[activeTeam].items.map((item, index) => (
                <Stack
                  key={item.id}
                  gap={1.5}
                  sx={{
                    backgroundColor: "#0F1117",
                    borderRadius: "12px",
                    p: 2,
                  }}
                >
                  {/* PHASE */}
                  <Select
                    value={item.phase_id}
                    onChange={(e) =>
                      updateItem(index, "phase_id", e.target.value)
                    }
                    displayEmpty
                  >
                    <MenuItem disabled value="">
                      Select Phase
                    </MenuItem>
                    {phases.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <input
                    placeholder="Flag / Milestone Name"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(index, "name", e.target.value)
                    }
                    style={inputStyle}
                  />

                  {mode === "FLAG" && (
                    <input
                      placeholder="Flag Answer"
                      value={item.answer}
                      onChange={(e) =>
                        updateItem(index, "answer", e.target.value)
                      }
                      style={inputStyle}
                    />
                  )}

                  <input
                    placeholder="Hint (optional)"
                    value={item.hint}
                    onChange={(e) =>
                      updateItem(index, "hint", e.target.value)
                    }
                    style={inputStyle}
                  />

                  <input
                    placeholder="Placeholder (flag{xxxx})"
                    value={item.placeholder}
                    onChange={(e) =>
                      updateItem(index, "placeholder", e.target.value)
                    }
                    style={inputStyle}
                  />

                <Stack direction="row" gap={3}>
                  {/* POINTS */}
                  <Stack gap={0.5}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#9C9EA3", fontSize: "12px" }}
                    >
                      Points
                    </Typography>
                    <input
                      type="number"
                      value={item.points}
                      onChange={(e) =>
                        updateItem(index, "points", Number(e.target.value))
                      }
                      style={smallInput}
                    />
                  </Stack>

                  {/* HINT PENALTY */}
                  <Stack gap={0.5}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#9C9EA3", fontSize: "12px" }}
                    >
                      Hint Penalty
                    </Typography>
                    <input
                      type="number"
                      value={item.hint_penalty}
                      onChange={(e) =>
                        updateItem(index, "hint_penalty", Number(e.target.value))
                      }
                      style={smallInput}
                    />
                  </Stack>
                </Stack>

                  <Stack direction="row" gap={3}>
                    <label>
                      <Checkbox
                        checked={item.show_placeholder}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "show_placeholder",
                            e.target.checked
                          )
                        }
                      />
                      Show Placeholder
                    </label>

                    <label>
                      <Checkbox
                        checked={item.is_locked}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "is_locked",
                            e.target.checked
                          )
                        }
                      />
                      Locked
                    </label>
                  </Stack>

                  <Button
                    color="error"
                    onClick={() => deleteItem(index)}
                  >
                    Delete
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

/* ================= STYLES ================= */

const inputStyle = {
  width: "100%",
  backgroundColor: "#1C1F28",
  border: "none",
  borderRadius: "8px",
  padding: "12px",
  color: "#eaeaea",
};

const smallInput = {
  width: "120px",
  backgroundColor: "#1C1F28",
  border: "none",
  borderRadius: "8px",
  padding: "8px",
  color: "#eaeaea",
};
