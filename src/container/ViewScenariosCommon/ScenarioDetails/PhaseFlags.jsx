//cyberdrill flag submission page
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
import SendIcon from "@mui/icons-material/Send";

import fuse_bulb from "../../../assests/fuse bulb.svg";
import hove_bulb from "../../../assests/State=Hover.svg";

import { flagSubmitApi, milestoneHintVersion2 } from "../../../APIConfig/version2Scenario";
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

const TEAL = "rgba(20,184,166,0.95)"; 
const TEAL_BG = "rgba(20,184,166,0.14)";
const TEAL_BORDER = "rgba(20,184,166,0.55)";


export default function PhaseFlag({
  activeScenarioId,
  itemsByPhase = {},
  killChainProgress = [],
  refresh,
}) {
  const phaseOrder = useMemo(() => {
    const arr = Array.isArray(killChainProgress) ? killChainProgress : [];
    return arr.map((p) => p.phase_id);
  }, [killChainProgress]);

  const phases = useMemo(() => {
    const map = itemsByPhase || {};
    const ids = phaseOrder.length ? phaseOrder : Object.keys(map);
    return ids.map((pid) => ({ phase_id: pid, ...(map[pid] || {}) }));
  }, [itemsByPhase, phaseOrder]);

  const [expanded, setExpanded] = useState(phases?.[0]?.phase_id || false);
  const [answers, setAnswers] = useState({});
  const [hintOpen, setHintOpen] = useState({});
  const [loadingFlag, setLoadingFlag] = useState({});
  const [localHints, setLocalHints] = useState({});


  /* ---------- submit ---------- */
  const handleSubmit = async (flag) => {
    const fid = flag.flag_id;
    const val = (answers[fid] || "").trim();
    if (!val) return toast.error("Enter flag value first.");

    try {
      setLoadingFlag((p) => ({ ...p, [fid]: true }));

      const fd = new FormData();
      fd.append("active_scenario_id", activeScenarioId);
      fd.append("flag_id", fid);
      fd.append("submitted_answer", val);

      // 🔥 res IS the data
      const data = await flagSubmitApi(fd);

      console.log("FLAG SUBMIT RESPONSE:", data);

      if (data?.is_correct === true) {
        toast.success(data.message || "Correct Answer");
      } else if (data?.is_correct === false) {
        toast.error(data.message || "Wrong Answer");
      } else {
        toast.error("Invalid server response");
      }

      await refresh?.();
    } catch (e) {
      toast.error("Submit failed");
    } finally {
      setLoadingFlag((p) => ({ ...p, [fid]: false }));
    }
  };

  const resolveActiveScenarioId = (val) => {
    if (typeof val === "string" && val.length > 10) return val;
    return "";
  };

  /* ---------- hint ---------- */
  const handleHint = async (flag) => {
    const fid = flag.flag_id;

    if (!activeScenarioId || typeof activeScenarioId !== "string") {
      toast.error("Active scenario ID missing");
      return;
    }

    // toggle if already opened
    if (flag.hint_used && (flag.hint_string || localHints[fid])) {
      setHintOpen((p) => ({ ...p, [fid]: !p[fid] }));
      return;
    }

    try {
      const res = await milestoneHintVersion2(
        activeScenarioId,
        fid,
        "FLAG"
      );

      const hintText = res?.data?.hint;
      const penalty = Number(res?.data?.hint_penalty ?? 0); // ✅ FIX

      if (!hintText) {
        toast.error("Hint received but empty");
        return;
      }

      // store hint locally
      setLocalHints((p) => ({
        ...p,
        [fid]: hintText,
      }));

      setHintOpen((p) => ({ ...p, [fid]: true }));

      toast.warning(
        penalty > 0
          ? `Hint revealed. Penalty applied: -${penalty} points`
          : "Hint revealed. No penalty applied",
        { autoClose: 3500 }
      );

      refresh?.(); // background refresh
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
        "Failed to fetch hint"
      );
    }
  };


  return (
    <Stack spacing={1.2} sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#e5e7eb" }}>
        Flag Submission
      </Typography>

      {phases.map((phase) => {
        const total = Number(phase?.total || 0);
        const completed = Number(phase?.completed || 0);
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
            disabled={phaseLocked}
            sx={{
              borderRadius: 3,
              "&:before": { display: "none" },
              border: phaseCompleted
                ? `1px solid ${TEAL_BORDER}`
                : "1px solid rgba(148,163,184,0.18)",
              background: phaseCompleted
                ? `linear-gradient(135deg, ${TEAL_BG}, rgba(2,6,23,0.75))`
                : "rgba(2,6,23,0.75)",
              opacity: phaseLocked ? 0.65 : 1,
              overflow: "hidden",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {phaseLocked && (
                    <LockIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  )}

                  {/* ✅ teal check like screenshot */}
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

                  <Typography fontWeight={800} color="#e5e7eb">
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
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Stack>

                <Box sx={{ flex: 1 }} />

                <Chip
                  size="small"
                  label={`${completed}/${total} Flags`}
                  sx={{
                    bgcolor: "rgba(148,163,184,0.12)",
                    color: "#e5e7eb",
                    border: "1px solid rgba(148,163,184,0.18)",
                    fontWeight: 800,
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
                      fontWeight: 800,
                    }}
                  />
                )}
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <Divider sx={{ mb: 1.5, opacity: 0.18 }} />

              <Stack spacing={1.2}>
                {(phase.items || []).map((flag) => {
                  const fid = flag.flag_id;

                  const isCorrect = !!flag.is_correct;
                  const isLocked = !!flag.locked || !!flag.locked_by_admin;
                  const hintUsed = !!flag.hint_used;
                  const showFakePlaceholder =
                    flag.show_placeholder === true && !isCorrect;

                  const cardBorder = isCorrect
                    ? TEAL_BORDER
                    : "rgba(148,163,184,0.16)";
                  const cardBg = isCorrect
                    ? `linear-gradient(135deg, ${TEAL_BG}, rgba(2,6,23,0.75))`
                    : "linear-gradient(135deg, rgba(2,6,23,0.75), rgba(15,23,42,0.55))";

                  return (
                    <Box
                      key={fid}
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
                          fontWeight={800}
                          color="#e5e7eb"
                          sx={{ maxWidth: "74%" }}
                        >
                          {flag.question || (isLocked ? "Locked Question" : "Question")}
                        </Typography>

                        <Box sx={{ flex: 1 }} />

                        {isCorrect && (
                          <Chip
                            size="small"
                            icon={<CheckCircleIcon sx={{ color: "#000000" }} />}
                            label="Completed"
                            sx={{
                              bgcolor: TEAL,
                              color: "#000000",      
                              fontWeight: 900,
                              "& .MuiChip-label": {
                                color: "#000000",    
                              },
                            }}
                          />
                        )}


                        <Chip
                          size="small"
                          label={`${flag.score || 0} pts`}
                          sx={{
                            ml: 0.5,
                            bgcolor: "rgba(148,163,184,0.12)",
                            color: "#e5e7eb",
                            border: "1px solid rgba(148,163,184,0.18)",
                            fontWeight: 800,
                          }}
                        />

                        {/* ✅ No background behind SVG */}
                        <Tooltip
                          title={
                            hintUsed
                              ? "Hint used (penalty applied)"
                              : "Use hint (score penalty applies)"
                          }
                        >
                          <Box
                            component="span"
                            onClick={() => !isLocked && !phaseLocked && handleHint(flag)}
                            sx={{
                              cursor: isLocked || phaseLocked ? "not-allowed" : "pointer",
                              display: "flex",
                              alignItems: "center",
                              ml: 0.5,
                              userSelect: "none",
                              opacity: isLocked || phaseLocked ? 0.5 : 1,
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

                        {(isLocked || phaseLocked) && (
                          <LockIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                        )}
                      </Stack>

                      {/* INPUT / COMPLETED ROW */}
                      <Box sx={{ mt: 1 }}>
                        {isCorrect ? (
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
                            <Typography sx={{ fontSize: 12, fontWeight: 800, color: TEAL }}>
                              ✓ Completed
                            </Typography>
                            <Chip
                              size="small"
                              label={`+${flag.obtained_score || 0}`}
                              sx={{
                                bgcolor: TEAL,
                                color: "#000000",        
                                fontWeight: 900,
                                "& .MuiChip-label": {
                                  color: "#000000",     
                                },
                              }}
                            />
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          size="small"

                          placeholder={
                            flag.placeholder?.trim()
                              ? flag.placeholder
                              : "Enter flag value..."
                          }

                          value={answers[fid] || ""}

                          onChange={(e) =>
                            setAnswers((p) => ({
                              ...p,
                              [fid]: e.target.value,
                            }))
                          }

                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          }}
                        />

                            <Button
                              variant="contained"
                              onClick={() => handleSubmit(flag)}
                              disabled={isLocked || phaseLocked || loadingFlag[fid]}
                              sx={{
                                minWidth: 64,
                                borderRadius: 2,
                                fontWeight: 900,
                                bgcolor: TEAL,
                                color: "#041b1a",
                                "&:hover": { bgcolor: TEAL },
                                boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                              }}
                            >
                              {loadingFlag[fid] ? "..." : "Submit"}
                            </Button>
                          </Stack>
                        )}
                      </Box>

                      {/* HINT TEXT (✅ teal color) */}
                      {/* 🔴 HINT TEXT (penalty applied) */}
                      {hintOpen[fid] && (flag.hint_string || localHints[fid]) && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.2,
                            borderRadius: 2,
                            border: "1px solid rgba(239,68,68,0.6)", // RED border
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
                            {flag.hint_penalty
                              ? ` (-${flag.hint_penalty} pts)`
                              : ""}
                          </Typography>

                          <Box sx={{ color: "#e5e7eb", fontWeight: 600 }}>
                            {flag.hint_string || localHints[fid]}
                          </Box>
                        </Box>
                      )}


                      {/* META */}
                      {flag.submitted_at && (
                        <Typography sx={{ fontSize: 11, mt: 0.8, color: "#94a3b8" }}>
                          Submitted: {fmtSmall(flag.submitted_at)}
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
