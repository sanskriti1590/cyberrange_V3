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
import { toast } from "react-toastify";

import fuse_bulb from "../../../assests/fuse bulb.svg";
import hove_bulb from "../../../assests/State=Hover.svg";
import { flagSubmitApi, milestoneHintVersion2 } from "../../../APIConfig/version2Scenario";

/* ================= CONSTANTS ================= */

const TEAL = "rgba(20,184,166,0.95)";
const TEAL_TEXT = "#041b1a";

/* ================= HELPERS ================= */

const fmt = (ts) => {
  if (!ts) return "";
  return new Date(ts).toLocaleString();
};

/* ================= COMPONENT ================= */

export default function PhaseFlag({
  activeScenarioId,
  itemsByPhase = {},
  killChainProgress = [],
  refresh,
}) {
  const phaseOrder = useMemo(
    () => (Array.isArray(killChainProgress) ? killChainProgress.map(p => p.phase_id) : []),
    [killChainProgress]
  );

  const phases = useMemo(() => {
    const ids = phaseOrder.length ? phaseOrder : Object.keys(itemsByPhase);
    return ids.map(id => ({ phase_id: id, ...(itemsByPhase[id] || {}) }));
  }, [itemsByPhase, phaseOrder]);

  const [expanded, setExpanded] = useState(phases?.[0]?.phase_id || false);
  const [answers, setAnswers] = useState({});
  const [hintOpen, setHintOpen] = useState({});
  const [loading, setLoading] = useState({});
  const [localOverrides, setLocalOverrides] = useState({}); // 🔥 instant UI updates

  /* ================= SUBMIT ================= */

  const handleSubmit = async (flag) => {
    const fid = flag.flag_id;
    const val = (answers[fid] || "").trim();
    if (!val) return toast.error("Enter flag value first");

    setLoading(p => ({ ...p, [fid]: true }));

    try {
      const fd = new FormData();
      fd.append("active_scenario_id", activeScenarioId);
      fd.append("flag_id", fid);
      fd.append("submitted_answer", val);

      const res = await flagSubmitApi(fd);
      const data = await flagSubmitApi(fd);

      if (data?.is_correct) {
        toast.success("Correct Answer");

        // 🔥 instant UI mark as submitted
        setLocalOverrides(p => ({
          ...p,
          [fid]: {
            is_correct: true,
            obtained_score: data.awarded_score,
            submitted_at: new Date().toISOString(),
          },
        }));
      } else {
        toast.error("Wrong Answer");
      }

      refresh?.();
    } catch {
      toast.error("Submit failed");
    } finally {
      setLoading(p => ({ ...p, [fid]: false }));
    }
  };

  /* ================= HINT ================= */

  const handleHint = async (flag) => {
    const fid = flag.flag_id;

    if (flag.locked || flag.locked_by_admin) {
      toast.error("This question is locked");
      return;
    }

    // toggle if already shown
    if (flag.hint_used && flag.hint_string) {
      setHintOpen(p => ({ ...p, [fid]: !p[fid] }));
      return;
    }

    try {
      const res = await milestoneHintVersion2(activeScenarioId, fid, "FLAG");
      const penalty = flag.hint_penalty ?? 0;

      toast.warning(`Hint revealed. Penalty applied: -${penalty} pts`);
      setHintOpen(p => ({ ...p, [fid]: true }));

      refresh?.();
    } catch {
      toast.error("Failed to fetch hint");
    }
  };

  /* ================= RENDER ================= */

  return (
    <Stack spacing={1.5}>
      <Typography fontSize={13} fontWeight={700}>
        Flag Submission
      </Typography>

      {phases.map((phase) => {
        const items = phase.items || [];
        const completed = items.filter(i => i.is_correct).length;
        const total = items.length;
        const phaseDone = total > 0 && completed === total;

        return (
          <Accordion
            key={phase.phase_id}
            expanded={expanded === phase.phase_id}
            onChange={() =>
              setExpanded(expanded === phase.phase_id ? false : phase.phase_id)
            }
            sx={{
              border: `1px solid ${phaseDone ? TEAL : "#1e293b"}`,
              borderRadius: 3,
              background: "rgba(2,6,23,0.85)",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" width="100%" alignItems="center">
                <Typography fontWeight={700}>{phase.phase_name}</Typography>
                <Box flex={1} />
                <Chip
                  label={`${completed}/${total}`}
                  sx={{
                    bgcolor: phaseDone ? TEAL : "transparent",
                    color: phaseDone ? TEAL_TEXT : "#e5e7eb",
                    fontWeight: 800,
                  }}
                />
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={1.2}>
                {items.map((flag) => {
                  const fid = flag.flag_id;
                  const override = localOverrides[fid] || {};
                  const isCorrect = override.is_correct ?? flag.is_correct;
                  const score = override.obtained_score ?? flag.obtained_score;
                  const submittedAt = override.submitted_at ?? flag.submitted_at;
                  const locked = flag.locked || flag.locked_by_admin;

                  return (
                    <Box
                      key={fid}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: `1px solid ${isCorrect ? TEAL : "#1e293b"}`,
                        background: "rgba(15,23,42,0.6)",
                      }}
                    >
                      {/* HEADER */}
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography fontWeight={700}>
                          {flag.question}
                        </Typography>

                        <Box flex={1} />

                        {isCorrect && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Submitted"
                            sx={{
                              bgcolor: TEAL,
                              color: TEAL_TEXT,
                              fontWeight: 900,
                            }}
                          />
                        )}

                        <Chip label={`${flag.score} pts`} />

                        <Tooltip title="Use Hint">
                          <Box
                            component="span"
                            onClick={() => handleHint(flag)}
                            sx={{ cursor: locked ? "not-allowed" : "pointer" }}
                          >
                            <img
                              src={flag.hint_used ? fuse_bulb : hove_bulb}
                              alt=""
                              style={{ width: 26, opacity: locked ? 0.4 : 1 }}
                            />
                          </Box>
                        </Tooltip>

                        {locked && <LockIcon sx={{ color: "#94a3b8" }} />}
                      </Stack>

                      {/* INPUT */}
                      {!locked && !isCorrect && (
                        <Stack direction="row" spacing={1} mt={1}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter flag value..."
                            value={answers[fid] || ""}
                            onChange={(e) =>
                              setAnswers(p => ({ ...p, [fid]: e.target.value }))
                            }
                          />
                          <Button
                            onClick={() => handleSubmit(flag)}
                            disabled={loading[fid]}
                            sx={{ minWidth: 44 }}
                          >
                            <SendIcon fontSize="small" />
                          </Button>
                        </Stack>
                      )}

                      {/* HINT */}
                      {hintOpen[fid] && flag.hint_string && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1,
                            borderRadius: 2,
                            border: `1px solid ${TEAL}`,
                            color: TEAL,
                            fontWeight: 700,
                          }}
                        >
                          Hint (penalty applied): {flag.hint_string}
                        </Box>
                      )}

                      {/* META */}
                      {submittedAt && (
                        <Typography fontSize={11} mt={0.8} color="#94a3b8">
                          Submitted: {fmt(submittedAt)}
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
