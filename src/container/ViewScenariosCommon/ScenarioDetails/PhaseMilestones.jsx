import React, { useMemo, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";

import fuse_bulb from "../../../assests/fuse bulb.svg";
import hove_bulb from "../../../assests/State=Hover.svg";

import {
  achieveCorporateScenarioMilestone,
  milestoneHintVersion2,
} from "../../../APIConfig/version2Scenario";

import { toast } from "react-toastify";

/* ---------- helpers ---------- */
function fmtSmall(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "";
  }
}

/* ---------- theme ---------- */
const TEAL = "rgba(20,184,166,0.95)";
const TEAL_BG = "rgba(20,184,166,0.14)";
const TEAL_BORDER = "rgba(20,184,166,0.55)";
const BORDER = "rgba(148,163,184,0.18)";
const SURFACE = "rgba(2,6,23,0.75)";

/**
 * PhaseMilestoen (Milestones grouped by Phase)
 * ✅ Inputs ONLY for milestones (text + evidence)
 * ✅ Hint uses milestoneHintVersion2(..., "MILESTONE") + correct toast
 * ✅ Completed/Approved milestones hide inputs instantly (optimistic override)
 * ✅ Locked milestones show no input + hint disabled
 * ✅ Local time display for submitted/approved timestamps
 *
 * Expected milestone item shape:
 * {
 *   milestone_id, milestone_name, milestone_description,
 *   milestone_score, obtained_score,
 *   is_achieved, is_approved,
 *   locked, locked_by_admin,
 *   hint_used, hint_string, hint_penalty,
 *   submitted_at, approved_at
 * }
 */
export default function PhaseMilestoen({
  activeScenarioId,
  itemsByPhase = {},
  killChainProgress = [],
  onRefresh,
}) {
  const safeRefresh = onRefresh || (() => {});

  const phaseOrder = useMemo(() => {
    const arr = Array.isArray(killChainProgress) ? killChainProgress : [];
    return arr.map((p) => p.phase_id);
  }, [killChainProgress]);

  const phases = useMemo(() => {
    const ids = phaseOrder.length ? phaseOrder : Object.keys(itemsByPhase || {});
    return ids.map((pid) => ({ phase_id: pid, ...(itemsByPhase[pid] || {}) }));
  }, [itemsByPhase, phaseOrder]);

  const [expanded, setExpanded] = useState(phases?.[0]?.phase_id || false);

  const [textByMilestone, setTextByMilestone] = useState({});
  const [filesByMilestone, setFilesByMilestone] = useState({});
  const [hintOpen, setHintOpen] = useState({});
  const [loading, setLoading] = useState({});
  const [localHints, setLocalHints] = useState({});
  // ✅ OPTIMISTIC UI for "submitted" state (no refresh needed)
  const [localMilestoneOverrides, setLocalMilestoneOverrides] = useState({});

  /* ---------- evidence ---------- */
  const addFiles = (mid, list) => {
    const next = Array.from(list || []);
    if (!next.length) return;
    setFilesByMilestone((p) => ({
      ...p,
      [mid]: [...(p[mid] || []), ...next],
    }));
  };

  const removeFile = (mid, idx) => {
    setFilesByMilestone((p) => {
      const arr = [...(p[mid] || [])];
      arr.splice(idx, 1);
      return { ...p, [mid]: arr };
    });
  };

  /* ---------- hint ---------- */
  const handleHint = async (m, phaseLocked) => {
    const mid = m.milestone_id;

    if (!activeScenarioId || typeof activeScenarioId !== "string") {
      toast.error("Active scenario ID missing");
      return;
    }

    const isLocked = !!m.locked || !!m.locked_by_admin || !!phaseLocked;
    if (isLocked) {
      toast.error("This milestone is locked");
      return;
    }

    // toggle if already used and we have hint text (server or local)
    if (m.hint_used && (m.hint_string || localHints[mid])) {
      setHintOpen((p) => ({ ...p, [mid]: !p[mid] }));
      return;
    }

    try {
      const res = await milestoneHintVersion2(activeScenarioId, mid, "MILESTONE");

      const hintText = res?.data?.hint;
      const penalty = Number(res?.data?.hint_penalty ?? m?.hint_penalty ?? 0);

      if (!hintText) {
        toast.error("Hint received but empty");
        return;
      }

      setLocalHints((p) => ({ ...p, [mid]: hintText }));
      setHintOpen((p) => ({ ...p, [mid]: true }));

      toast.warning(
        penalty > 0
          ? `Hint revealed. Penalty applied: -${penalty} points`
          : "Hint revealed. No penalty applied",
        { autoClose: 3500 }
      );

      // background refresh (don’t block UI)
      safeRefresh();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to fetch hint");
    }
  };

  /* ---------- submit milestone ---------- */
  const handleSubmit = async (m, phaseLocked) => {
    const mid = m.milestone_id;

    if (!activeScenarioId || typeof activeScenarioId !== "string") {
      toast.error("Active scenario ID missing");
      return;
    }

    const override = localMilestoneOverrides[mid] || {};
    const done = !!override.is_achieved || !!m.is_approved || !!m.is_achieved;
    const isLocked = !!m.locked || !!m.locked_by_admin || !!phaseLocked;

    if (done) return toast.info("Milestone already submitted");
    if (isLocked) return toast.error("This milestone is locked");

    const submitted_text = (textByMilestone[mid] ?? "").trim();
    const evidence_files = filesByMilestone[mid] || [];

    if (!submitted_text && evidence_files.length === 0) {
      return toast.error("Submit either text or at least one evidence file.");
    }

    try {
      setLoading((p) => ({ ...p, [mid]: true }));

      const res = await achieveCorporateScenarioMilestone({
        active_scenario_id: activeScenarioId,
        milestone_id: mid,
        submitted_text,
        evidence_files,
      });

      toast.success(res?.message || "Milestone submitted");

      // ✅ OPTIMISTIC: immediately hide inputs (no refresh needed)
      setLocalMilestoneOverrides((p) => ({
        ...p,
        [mid]: {
          is_achieved: true,
          // show local time immediately
          submitted_at: new Date().toISOString(),
          // keep a score number for the bar (fallbacks included)
          obtained_score:
            res?.obtained_score ??
            res?.awarded_score ?? // in case your API uses this key
            m?.obtained_score ??
            m?.milestone_score ??
            0,
        },
      }));

      // clear local inputs
      setTextByMilestone((p) => ({ ...p, [mid]: "" }));
      setFilesByMilestone((p) => ({ ...p, [mid]: [] }));

      // background refresh to sync server truth (approval, real timestamp, etc.)
      safeRefresh();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Submit failed");
    } finally {
      setLoading((p) => ({ ...p, [mid]: false }));
    }
  };

  /* ---------- render ---------- */
  return (
    <Stack spacing={1.2} sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#e5e7eb" }}>
        Milestone Submission
      </Typography>

      {phases.map((phase) => {
        const phaseItems = Array.isArray(phase?.items) ? phase.items : [];

        // phase stats — include optimistic overrides
        const total =
          Number(phase?.total || 0) || Number(phaseItems.length || 0);

        const completedFromItems = phaseItems.filter((x) => {
          const mid = x?.milestone_id;
          const o = localMilestoneOverrides[mid] || {};
          return !!o.is_achieved || !!x?.is_approved || !!x?.is_achieved;
        }).length;

        const completed =
          Number(phase?.completed || 0) || Number(completedFromItems || 0);

        const pending = Math.max(0, total - completed);

        const phaseLocked = !!phase?.locked_by_admin;
        const phaseCompleted = total > 0 && completed >= total;

        return (
          <Accordion
            key={phase.phase_id}
            expanded={expanded === phase.phase_id}
            onChange={() =>
              setExpanded(expanded === phase.phase_id ? false : phase.phase_id)
            }
            sx={{
              borderRadius: 3,
              "&:before": { display: "none" },
              border: phaseCompleted
                ? `1px solid ${TEAL_BORDER}`
                : `1px solid ${BORDER}`,
              background: phaseCompleted
                ? `linear-gradient(135deg, ${TEAL_BG}, ${SURFACE})`
                : SURFACE,
              overflow: "hidden",
              opacity: phaseLocked ? 0.9 : 1,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#94a3b8" }} />}
            >
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {phaseLocked && (
                    <LockIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  )}

                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "999px",
                      display: "grid",
                      placeItems: "center",
                      border: `1px solid ${
                        phaseCompleted ? TEAL_BORDER : "rgba(148,163,184,0.25)"
                      }`,
                      background: phaseCompleted ? TEAL : "transparent",
                      color: phaseCompleted ? "#041b1a" : "#e5e7eb",
                      fontWeight: 900,
                      fontSize: 13,
                    }}
                  >
                    {phaseCompleted ? "✓" : ""}
                  </Box>

                  <Typography fontWeight={900} color="#e5e7eb">
                    {phase.phase_name || "Phase"}
                  </Typography>

                  {phaseLocked && (
                    <Chip
                      size="small"
                      label="Locked"
                      sx={{
                        ml: 0.5,
                        bgcolor: "rgba(148,163,184,0.12)",
                        color: "#94a3b8",
                        border: "1px solid rgba(148,163,184,0.2)",
                        fontWeight: 800,
                      }}
                    />
                  )}
                </Stack>

                <Box sx={{ flex: 1 }} />

                <Chip
                  size="small"
                  label={`${completed}/${total} Milestones`}
                  sx={{
                    bgcolor: "rgba(148,163,184,0.12)",
                    color: "#e5e7eb",
                    border: "1px solid rgba(148,163,184,0.18)",
                    fontWeight: 900,
                  }}
                />

                {pending > 0 && (
                  <Chip
                    size="small"
                    label={`${pending} Pending`}
                    sx={{
                      ml: 1,
                      bgcolor: "rgba(148,163,184,0.12)",
                      color: "#e5e7eb",
                      border: "1px solid rgba(148,163,184,0.18)",
                      fontWeight: 900,
                    }}
                  />
                )}
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <Divider sx={{ mb: 1.5, opacity: 0.18 }} />

              <Stack spacing={1.2}>
                {phaseItems.map((m) => {
                  const mid = m.milestone_id;

                  const override = localMilestoneOverrides[mid] || {};
                  const done =
                    !!override.is_achieved || !!m.is_approved || !!m.is_achieved;

                  const locked =
                    !!m.locked || !!m.locked_by_admin || !!phaseLocked;

                  const hintUsed = !!m.hint_used;

                  const localFiles = filesByMilestone[mid] || [];

                  const obtainedScore = Number(
                    override.obtained_score ?? m.obtained_score ?? 0
                  );

                  const submittedAt = override.submitted_at || m.submitted_at;
                  const approvedAt = m.approved_at; // approval only from server

                  const pointsLabel = done
                    ? `${obtainedScore || Number(m.milestone_score ?? 0)} pts`
                    : `${Number(m.milestone_score ?? 0)} pts`;

                  const cardBorder = done
                    ? TEAL_BORDER
                    : "rgba(148,163,184,0.16)";
                  const cardBg = done
                    ? `linear-gradient(135deg, ${TEAL_BG}, ${SURFACE})`
                    : "linear-gradient(135deg, rgba(2,6,23,0.75), rgba(15,23,42,0.55))";

                  return (
                    <Box
                      key={mid}
                      sx={{
                        p: 1.35,
                        borderRadius: 2.5,
                        border: `1px solid ${cardBorder}`,
                        background: cardBg,
                      }}
                    >
                      {/* HEADER */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          fontSize={12.8}
                          fontWeight={900}
                          color="#e5e7eb"
                          sx={{ maxWidth: "70%" }}
                        >
                          {m.milestone_name || "Milestone"}
                        </Typography>

                        <Box sx={{ flex: 1 }} />

                        {done && (
                          <Chip
                            size="small"
                            icon={<CheckCircleIcon sx={{ color: "#000000" }} />}
                            label={m.is_approved ? "Approved" : "Submitted"}
                            sx={{
                              bgcolor: TEAL,
                              color: "#000000",
                              fontWeight: 900,
                              "& .MuiChip-label": { color: "#000000" },
                            }}
                          />
                        )}

                        <Chip
                          size="small"
                          label={pointsLabel}
                          sx={{
                            ml: 0.5,
                            bgcolor: "rgba(148,163,184,0.12)",
                            color: "#e5e7eb",
                            border: "1px solid rgba(148,163,184,0.18)",
                            fontWeight: 900,
                          }}
                        />

                        {/* HINT ICON */}
                        <Tooltip
                          title={
                            locked
                              ? "Locked"
                              : hintUsed
                              ? "Hint used (penalty applied)"
                              : "Use hint (score penalty applies)"
                          }
                        >
                          <Box
                            component="span"
                            onClick={() => !locked && handleHint(m, phaseLocked)}
                            sx={{
                              cursor: locked ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              ml: 0.5,
                              userSelect: "none",
                              opacity: locked ? 0.5 : 1,
                            }}
                          >
                            <img
                              src={hintUsed ? fuse_bulb : hove_bulb}
                              alt="hint"
                              width={26}
                              height={26}
                              style={{
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                boxShadow: "none",
                                filter: hintUsed
                                  ? `drop-shadow(0 0 10px ${TEAL})`
                                  : "none",
                              }}
                            />
                          </Box>
                        </Tooltip>

                        {locked && (
                          <LockIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                        )}
                      </Stack>

                      {/* DESCRIPTION */}
                      {!!m.milestone_description && (
                        <Typography
                          sx={{ mt: 0.6, fontSize: 12.2, color: "#cbd5f5" }}
                        >
                          {m.milestone_description}
                        </Typography>
                      )}

                      {/* COMPLETED / LOCKED / INPUTS */}
                      <Box sx={{ mt: 1 }}>
                        {done ? (
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              border: `1px solid ${TEAL_BORDER}`,
                              background: "rgba(2,6,23,0.35)",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: 12, fontWeight: 900, color: TEAL }}
                            >
                              ✓ {m.is_approved ? "Approved" : "Submitted"}
                            </Typography>

                            <Chip
                              size="small"
                              label={`+${obtainedScore}`}
                              sx={{
                                bgcolor: TEAL,
                                color: "#000000",
                                fontWeight: 900,
                                "& .MuiChip-label": { color: "#000000" },
                              }}
                            />
                          </Stack>
                        ) : locked ? (
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              border: "1px solid rgba(148,163,184,0.22)",
                              background: "rgba(2,6,23,0.35)",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: 900,
                                color: "#94a3b8",
                              }}
                            >
                              Locked
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: "#94a3b8",
                              }}
                            >
                              No submission allowed
                            </Typography>
                          </Stack>
                        ) : (
                          <>
                            <TextField
                              multiline
                              minRows={3}
                              fullWidth
                              placeholder="Write your submission / evidence notes..."
                              value={textByMilestone[mid] ?? ""}
                              onChange={(e) =>
                                setTextByMilestone((p) => ({
                                  ...p,
                                  [mid]: e.target.value,
                                }))
                              }
                              sx={{
                                mt: 0.5,
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />

                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              <Button
                                component="label"
                                size="small"
                                startIcon={<UploadFileIcon />}
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 800,
                                  border: "1px solid rgba(148,163,184,0.25)",
                                  color: "#e5e7eb",
                                }}
                              >
                                Add Evidence (PDF / JPG / PNG)
                                <input
                                  hidden
                                  multiple
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => addFiles(mid, e.target.files)}
                                />
                              </Button>

                              <Box sx={{ flex: 1 }} />

                              <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={() => handleSubmit(m, phaseLocked)}
                                disabled={loading[mid]}
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 900,
                                  bgcolor: TEAL,
                                  color: "#041b1a",
                                  "&:hover": { bgcolor: TEAL },
                                  boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                                }}
                              >
                                {loading[mid] ? "..." : "Submit"}
                              </Button>
                            </Stack>

                            {localFiles.length > 0 && (
                              <Stack spacing={0.6} sx={{ mt: 0.8 }}>
                                {localFiles.map((f, idx) => (
                                  <Stack
                                    key={`${mid}-${idx}`}
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{
                                      p: 0.8,
                                      borderRadius: 2,
                                      border:
                                        "1px solid rgba(148,163,184,0.16)",
                                      background: "rgba(2,6,23,0.35)",
                                    }}
                                  >
                                    <Typography fontSize={12} color="#e5e7eb">
                                      {f?.name || `Evidence ${idx + 1}`}
                                    </Typography>
                                    <Box sx={{ flex: 1 }} />
                                    <Box
                                      component="span"
                                      sx={{ cursor: "pointer", opacity: 0.9 }}
                                      onClick={() => removeFile(mid, idx)}
                                    >
                                      <DeleteOutlineIcon fontSize="small" />
                                    </Box>
                                  </Stack>
                                ))}
                              </Stack>
                            )}
                          </>
                        )}
                      </Box>

                      {/* HINT TEXT */}
                      {hintOpen[mid] && (m.hint_string || localHints[mid]) && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.2,
                            borderRadius: 2,
                            border: "1px solid rgba(239,68,68,0.6)",
                            background: "rgba(239,68,68,0.12)",
                            color: "#fecaca",
                            fontSize: 12.5,
                            fontWeight: 700,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 11.5,
                              fontWeight: 900,
                              color: "#ef4444",
                              mb: 0.5,
                            }}
                          >
                            ⚠ Hint used — penalty applied
                            {Number(m.hint_penalty ?? 0) > 0
                              ? ` (-${Number(m.hint_penalty ?? 0)} pts)`
                              : ""}
                          </Typography>

                          <Box sx={{ color: "#e5e7eb", fontWeight: 600 }}>
                            {m.hint_string || localHints[mid]}
                          </Box>
                        </Box>
                      )}

                      {/* META */}
                      {(submittedAt || approvedAt) && (
                        <Typography sx={{ fontSize: 11, mt: 0.8, color: "#94a3b8" }}>
                          {submittedAt ? `Submitted: ${fmtSmall(submittedAt)}` : ""}
                          {submittedAt && approvedAt ? " • " : ""}
                          {approvedAt ? `Approved: ${fmtSmall(approvedAt)}` : ""}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
