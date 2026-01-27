import React, { useMemo } from "react";
import {
  Stack,
  Typography,
  Box,
  Divider,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FlagIcon from "@mui/icons-material/Flag";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

/**
 * NEW PROPS
 * - draft: full draft object from CyberDrill (contains mode, phases, items)
 * - onBack()
 * - onDeleteItem(id)   (optional)
 * - onConfirmCreate()  (calls create scenario api and redirects to infra)
 * - submitting
 */

export default function PreviewPanel({
  draft,
  onBack,
  onDeleteItem,
  onConfirmCreate,
  submitting = false,
}) {
  const mode = draft?.mode || "FLAG";
  const phases = Array.isArray(draft?.phases) ? draft.phases : [];
  const items = Array.isArray(draft?.items) ? draft.items : [];

  /* ---------------- PHASE MAP ---------------- */
  const phaseMap = useMemo(() => {
    const map = {};

    phases.forEach((p, idx) => {
      // supports both phase formats (your PhasePanel vs earlier one)
      const pid = p.local_id ?? p.id ?? `phase-${idx}`;
      const pname = p.phase_name ?? p.name ?? "";
      map[pid] = pname || "Unnamed Phase";
    });

    return map;
  }, [phases]);

  if (!items.length) {
    return (
      <Stack alignItems="center" py={8} spacing={2}>
        <FlagIcon sx={{ fontSize: 42, color: "#3a3f45" }} />
        <Typography sx={{ color: "#9C9EA3" }}>
          No {mode === "FLAG" ? "flags" : "milestones"} created yet
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#6b7075" }}>
          Add phases first, then add {mode === "FLAG" ? "flags" : "milestones"}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">
          {mode === "FLAG" ? "Flags" : "Milestones"} Preview ({items.length})
        </Typography>
        {mode === "FLAG" && (
          <Typography sx={{ fontSize: 12, color: "#9C9EA3" }}>
            Hover answer to reveal
          </Typography>
        )}
      </Stack>

      <Divider sx={{ borderColor: "#1f2a25" }} />

      {/* LIST */}
      <Stack spacing={2}>
        {items.map((it, index) => {
          const title = it.name || "Untitled";
          const phaseName = phaseMap[it.phase_id] || "Unknown Phase";

          return (
            <Box
              key={it.id || `${it.team}-${index}`}
              sx={{
                position: "relative",
                p: 2,
                borderRadius: 2,
                background:
                  "linear-gradient(180deg, #0f1418 0%, #0b0f12 100%)",
                border: "1px solid #1f2a25",
              }}
            >
              {/* LEFT INDICATOR */}
              <Box
                sx={{
                  position: "absolute",
                  left: -12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#00FFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FlagIcon sx={{ fontSize: 14, color: "#000" }} />
              </Box>

              <Stack spacing={1.5} pl={2}>
                {/* HEADER */}
                <Stack direction="row" justifyContent="space-between">
                  <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontWeight: 700 }}>
                        {mode === "FLAG" ? "Flag" : "Milestone"} {index + 1}:{" "}
                        {title}
                      </Typography>

                      <Chip
                        size="small"
                        label={phaseName}
                        sx={{
                          borderRadius: 1,
                          fontSize: 11,
                          backgroundColor: "#0b2226",
                          color: "#00FFFF",
                          border: "1px solid #00FFFF40",
                        }}
                      />

                      {it.team && (
                        <Chip
                          size="small"
                          label={it.team}
                          sx={{
                            borderRadius: 1,
                            fontSize: 11,
                            backgroundColor: "#141722",
                            color: "#9C9EA3",
                            border: "1px solid #2a2f35",
                          }}
                        />
                      )}
                    </Stack>

                    {/* META */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <EmojiEventsIcon
                          sx={{ fontSize: 14, color: "#00ff9a" }}
                        />
                        <Typography sx={{ fontSize: 12, color: "#00ff9a" }}>
                          {Number(it.points || 0)} pts
                        </Typography>
                      </Stack>

                      {it.hint && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LightbulbOutlinedIcon
                            sx={{ fontSize: 14, color: "#9C9EA3" }}
                          />
                          <Typography
                            sx={{
                              fontSize: 12,
                              color:
                                it.hint_penalty > 0
                                  ? "#00ff9a"
                                  : it.hint_penalty < 0
                                  ? "#FA2256"
                                  : "#9C9EA3",
                            }}
                          >
                            {it.hint_penalty > 0 ? "+" : ""}
                            {Number(it.hint_penalty || 0)}
                          </Typography>
                        </Stack>
                      )}

                      {mode === "FLAG" && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {it.show_placeholder ? (
                            <VisibilityOutlinedIcon
                              sx={{ fontSize: 14, color: "#9C9EA3" }}
                            />
                          ) : (
                            <VisibilityOffOutlinedIcon
                              sx={{ fontSize: 14, color: "#9C9EA3" }}
                            />
                          )}
                          <Typography sx={{ fontSize: 11, color: "#9C9EA3" }}>
                            {it.show_placeholder ? "Placeholder visible" : "Hidden"}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>

                  {/* DELETE */}
                  {typeof onDeleteItem === "function" && (
                    <IconButton
                      size="small"
                      onClick={() => onDeleteItem(it.id)}
                      sx={{
                        color: "#FA2256",
                        opacity: 0.2,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>

                {/* ANSWER / DESCRIPTION */}
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: 1.5,
                    background: "#0d0f12",
                    border: "1px solid #1f2a25",
                  }}
                >
                  <Typography sx={{ fontSize: 11, color: "#9C9EA3" }}>
                    {mode === "FLAG" ? "Answer" : "Description"}
                  </Typography>

                  {mode === "FLAG" ? (
                    <Typography
                      sx={{
                        fontFamily: "monospace",
                        fontSize: 13,
                        mt: 0.5,
                        filter: "blur(4px)",
                        "&:hover": { filter: "blur(0px)" },
                        transition: "filter 0.2s",
                        cursor: "pointer",
                      }}
                    >
                      {it.answer || "—"}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: 13 }}>
                      {it.description || it.hint || "—"}
                    </Typography>
                  )}
                </Box>

                {/* HINT */}
                {it.hint && (
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      background: "#16120a",
                      border: "1px solid #8a5a0030",
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#ffcc80" }}>
                      Hint
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>{it.hint}</Typography>
                  </Box>
                )}

                {/* PLACEHOLDER */}
                {mode === "FLAG" && it.show_placeholder && (
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      background: "#0b2226",
                      border: "1px solid #00FFFF30",
                    }}
                  >
                    <Typography sx={{ fontSize: 11, color: "#00FFFF" }}>
                      Placeholder
                    </Typography>
                    <Typography sx={{ fontFamily: "monospace", fontSize: 13 }}>
                      {it.placeholder || "flag{xxxxxxxx}"}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {/* FOOTER */}
      <Divider sx={{ borderColor: "#1f2a25" }} />

      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            borderColor: "#2a2f35",
            color: "#9C9EA3",
            "&:hover": { borderColor: "#9C9EA3" },
          }}
        >
          ← Back
        </Button>

        {/* ✅ NEXT BUTTON: create scenario + save + redirect to infra */}
        <Button
          variant="contained"
          onClick={onConfirmCreate}
          disabled={submitting}
          sx={{
            backgroundColor: "#00FFFF",
            color: "#000",
            fontWeight: 700,
            px: 4,
            "&:hover": { backgroundColor: "#00dede" },
          }}
        >
          {submitting ? "Creating..." : "Next → Infra Setup"}
        </Button>
      </Stack>
    </Stack>
  );
}
