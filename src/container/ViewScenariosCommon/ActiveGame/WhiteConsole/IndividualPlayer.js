import {
  Backdrop,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from "react-toastify";

import {
  milestoneApprovedVersion2,
  milestoneUnApprovedVersion2,
} from "../../../../APIConfig/version2Scenario";

/* ---------- helpers ---------- */
const fmt = (ts) => (ts ? new Date(ts).toLocaleString() : "");

/* ---------- theme ---------- */
const TEAL = "rgba(20,184,166,0.95)";
const RED = "rgba(239,68,68,0.95)";
const BG = "rgba(2,6,23,0.9)";
const BORDER = "rgba(148,163,184,0.2)";

/* ===================================================== */

export default function IndividualPlayer({ data, reload, setReload }) {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [localOverrides, setLocalOverrides] = useState({});

  if (!data || data.scenario_type !== "MILESTONE") {
    return (
      <Stack p={3}>
        <Typography color="#94a3b8">
          No milestone data available
        </Typography>
      </Stack>
    );
  }

  /* ---------- approve ---------- */
  const approveMilestone = async (m) => {
    try {
      setLoading(true);
      await milestoneApprovedVersion2({
        active_scenario_id: data.active_scenario_id,
        participant_id: data.participant_id,
        milestone_id: m.milestone_id,
      });

      toast.success("Milestone approved");

      setLocalOverrides((p) => ({
        ...p,
        [m.milestone_id]: { is_approved: true },
      }));

      setReload(!reload);
    } catch {
      toast.error("Approve failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- reject ---------- */
  const rejectMilestone = async (m) => {
    try {
      setLoading(true);
      await milestoneUnApprovedVersion2({
        active_scenario_id: data.active_scenario_id,
        participant_id: data.participant_id,
        milestone_id: m.milestone_id,
      });

      toast.info("Milestone rejected");
      setReload(!reload);
    } catch {
      toast.error("Reject failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================================================== */

  return (
    <Stack direction="row" height="95vh" gap={1}>
      <Backdrop open={loading} sx={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* ================= LEFT: MODERATOR PANEL ================= */}
      <Stack
        width="30%"
        sx={{
          background: BG,
          borderRight: `1px solid ${BORDER}`,
          p: 2,
          overflowY: "auto",
        }}
      >
        <Typography fontWeight={900} mb={1}>
          Milestone Review
        </Typography>

        {Object.values(data.itemsByPhase || {}).map((phase) => (
          <Stack key={phase.phase_id} spacing={1.2} mb={2}>
            <Typography fontWeight={800} color="#38bdf8">
              {phase.phase_name}
            </Typography>

            {phase.items.map((m) => {
              const override = localOverrides[m.milestone_id] || {};
              const approved = override.is_approved ?? m.is_approved;
              const submitted = m.is_achieved;

              return (
                <Box
                  key={m.milestone_id}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    border: `1px solid ${
                      approved ? TEAL : BORDER
                    }`,
                    background: "rgba(15,23,42,0.6)",
                  }}
                >
                  {/* HEADER */}
                  <Stack direction="row" alignItems="center">
                    <Typography fontWeight={800} fontSize={13}>
                      {m.milestone_name}
                    </Typography>
                    <Box flex={1} />
                    <Chip size="small" label={`${m.milestone_score} pts`} />
                  </Stack>

                  {/* STATUS */}
                  <Stack direction="row" spacing={1} mt={0.6}>
                    {approved && (
                      <Chip
                        size="small"
                        icon={<CheckCircleIcon />}
                        label="Approved"
                        sx={{ bgcolor: TEAL, color: "#041b1a" }}
                      />
                    )}
                    {!approved && submitted && (
                      <Chip
                        size="small"
                        label="Submitted"
                        sx={{ bgcolor: "rgba(148,163,184,0.15)" }}
                      />
                    )}
                    {!submitted && (
                      <Chip
                        size="small"
                        icon={<LockIcon />}
                        label="Pending"
                      />
                    )}
                  </Stack>

                  {/* SUBMISSION */}
                  {m.submitted_text && (
                    <Typography
                      fontSize={12}
                      color="#cbd5f5"
                      mt={0.8}
                    >
                      {m.submitted_text}
                    </Typography>
                  )}

                  {/* META */}
                  <Typography fontSize={11} color="#94a3b8" mt={0.5}>
                    {m.submitted_at && `Submitted: ${fmt(m.submitted_at)}`}
                  </Typography>

                  {/* ACTIONS */}
                  {!approved && submitted && (
                    <Stack direction="row" spacing={1} mt={1}>
                      <Button
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        sx={{
                          bgcolor: TEAL,
                          color: "#041b1a",
                          fontWeight: 800,
                        }}
                        onClick={() => approveMilestone(m)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        startIcon={<CancelIcon />}
                        sx={{
                          bgcolor: RED,
                          color: "#fff",
                          fontWeight: 800,
                        }}
                        onClick={() => rejectMilestone(m)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Stack>
        ))}
      </Stack>

      {/* ================= RIGHT: CONSOLE ================= */}
      <Stack width="70%" p={1}>
        <iframe
          ref={iframeRef}
          src={data.console_url}
          title="Instance Console"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: 8,
          }}
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </Stack>
    </Stack>
  );
}

