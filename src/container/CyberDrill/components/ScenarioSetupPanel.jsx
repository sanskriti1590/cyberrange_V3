import React, { useMemo } from "react";
import {
  Grid,
  Card,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  Button,
  Divider,
} from "@mui/material";
import RichTextEditor from "./RichTextEditor";

const severities = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];

export default function ScenarioSetupPanel({
  draft,
  setDraft,
  categories = [],
  onNext,
  loading,
}) {
  const cats = useMemo(() => categories || [], [categories]);
  const update = (k, v) => setDraft((p) => ({ ...p, [k]: v }));

  const isDecay = draft.scoring_type === "decay";

  return (
    <Grid container spacing={3}>
      {/* LEFT: Form */}
      <Grid item xs={12} md={7}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            background: "rgba(15,17,23,0.92)",
            border: "1px solid rgba(20,241,255,0.10)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
          }}
        >
          <Stack spacing={2.4}>
            {/* Header */}
            <Stack>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#e5f6ff" }}>
                Scenario Setup
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#93a4b8" }}>
                Configure scenario metadata, scoring behavior and challenge model.
              </Typography>
            </Stack>

            <Divider sx={{ borderColor: "rgba(148,163,184,0.12)" }} />

            {/* Name */}
            <TextField
              label="Scenario Name"
              value={draft.scenario_name || ""}
              onChange={(e) => update("scenario_name", e.target.value)}
              fullWidth
            />

            {/* Category + Severity */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={draft.scenario_category_id || ""}
                    label="Category"
                    onChange={(e) =>
                      update("scenario_category_id", e.target.value)
                    }
                  >
                    {cats.map((cat) => (
                      <MenuItem
                        key={cat.scenario_category_id}
                        value={cat.scenario_category_id}
                      >
                        {cat.scenario_category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={draft.scenario_assigned_severity || "Medium"}
                    label="Severity"
                    onChange={(e) =>
                      update("scenario_assigned_severity", e.target.value)
                    }
                  >
                    {severities.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Scoring Model */}
            <Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#cbd5e1" }}>
                  Scoring Model
                </Typography>
                <Tooltip title="Standard = fixed points. Decay = points reduce over time or attempts.">
                  <Typography sx={{ cursor: "help", color: "#60a5fa" }}>
                    ℹ️
                  </Typography>
                </Tooltip>
              </Stack>

              <RadioGroup
                row
                value={draft.scoring_type || "standard"}
                onChange={(e) => update("scoring_type", e.target.value)}
              >
                <FormControlLabel
                  value="standard"
                  control={<Radio />}
                  label="Standard"
                />
                <FormControlLabel
                  value="decay"
                  control={<Radio />}
                  label="Decay"
                />
              </RadioGroup>
            </Stack>

            {/* Decay Configuration (CONDITIONAL) */}
            {isDecay && (
              <Card
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "rgba(22,24,31,0.9)",
                  border: "1px dashed rgba(251,191,36,0.35)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#fbbf24",
                    mb: 1,
                  }}
                >
                  Decay Scoring Configuration
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Start Decay After (minutes)"
                      type="number"
                      value={draft.decay_start_after_minutes ?? 15}
                      onChange={(e) =>
                        update(
                          "decay_start_after_minutes",
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Penalty per Interval"
                      type="number"
                      value={draft.decay_penalty_per_interval ?? 10}
                      onChange={(e) =>
                        update(
                          "decay_penalty_per_interval",
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Interval Length (minutes)"
                      type="number"
                      value={draft.decay_interval_minutes ?? 10}
                      onChange={(e) =>
                        update(
                          "decay_interval_minutes",
                          Number(e.target.value)
                        )
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      label="Minimum Score"
                      type="number"
                      value={draft.decay_min_score ?? 20}
                      onChange={(e) =>
                        update("decay_min_score", Number(e.target.value))
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Card>
            )}

            {/* Challenge Mode */}
            <Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#cbd5e1" }}>
                  Challenge Mode
                </Typography>
              </Stack>

              <RadioGroup
                row
                value={draft.mode || "FLAG"}
                onChange={(e) => update("mode", e.target.value)}
              >
                <FormControlLabel value="FLAG" control={<Radio />} label="Flag Based" />
                <FormControlLabel
                  value="MILESTONE"
                  control={<Radio />}
                  label="Milestone Based"
                />
              </RadioGroup>
            </Stack>

            {/* Description */}
            <Stack>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#cbd5e1" }}>
                Description
              </Typography>
              <RichTextEditor
                value={draft.scenario_description}
                onChange={(v) => update("scenario_description", v)}
                placeholder="Scenario narrative, storyline, constraints..."
              />
            </Stack>

            {/* Prerequisites */}
            <Stack>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#cbd5e1" }}>
                Prerequisites
              </Typography>
              <RichTextEditor
                value={draft.scenario_prerequisites}
                onChange={(v) => update("scenario_prerequisites", v)}
                placeholder="Access, tools, credentials..."
              />
            </Stack>

            {/* Tools & Technologies */}
            <Stack>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#cbd5e1" }}>
                Tools & Technologies
              </Typography>
              <TextField
                placeholder="e.g. Splunk, ELK, EDR, Kali Linux, PowerShell, SIEM, Firewall logs"
                value={draft.scenario_tools_technologies || ""}
                onChange={(e) =>
                  update("scenario_tools_technologies", e.target.value)
                }
                fullWidth
              />
            </Stack>

            {/* Next */}
            <Button
              variant="contained"
              onClick={onNext}
              disabled={loading}
              sx={{
                borderRadius: 2,
                fontWeight: 900,
                background:
                  "linear-gradient(90deg, rgba(20,241,255,0.85), rgba(0,200,83,0.65))",
                color: "#061015",
              }}
            >
              Next → Phases
            </Button>
          </Stack>
        </Card>
      </Grid>

      {/* RIGHT: Preview */}
      <Grid item xs={12} md={5}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            background: "rgba(22,24,31,0.85)",
            border: "1px solid rgba(148,163,184,0.12)",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#e2e8f0" }}>
            Quick Preview
          </Typography>

          <Stack mt={2} spacing={1}>
            <Typography sx={{ color: "#9aa3b2", fontSize: 12 }}>
              Name
            </Typography>
            <Typography sx={{ color: "#e5e7eb", fontWeight: 800 }}>
              {draft.scenario_name || "—"}
            </Typography>

            <Typography sx={{ color: "#9aa3b2", fontSize: 12, mt: 1 }}>
              Severity · Mode · Scoring
            </Typography>
            <Typography sx={{ color: "#e5e7eb", fontWeight: 800 }}>
              {draft.scenario_assigned_severity || "—"} ·{" "}
              {draft.mode || "—"} ·{" "}
              {draft.scoring_type || "standard"}
            </Typography>

            {isDecay && (
              <Typography sx={{ fontSize: 12, color: "#fbbf24" }}>
                Decay after {draft.decay_start_after_minutes ?? 15}m · −
                {draft.decay_penalty_per_interval ?? 10} pts /
                {draft.decay_interval_minutes ?? 10}m (min{" "}
                {draft.decay_min_score ?? 20})
              </Typography>
            )}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
