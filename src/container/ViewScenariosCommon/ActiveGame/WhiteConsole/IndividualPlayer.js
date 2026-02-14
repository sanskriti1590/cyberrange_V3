import {
  Backdrop,
  Stack,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import {
  milestoneApprovedVersion2,
  milestoneUnApprovedVersion2,
} from "../../../../APIConfig/version2Scenario";

import { Icons } from "../../../../components/icons";

/* ===================== HELPERS ===================== */

const fmt = (ts) => {
  if (!ts) return "—";
  return new Date(ts).toLocaleString();
};

/*WHITE TEAM PANELL  */

const CISOModerationPanel = ({ data, refresh }) => {
  const phases = Object.values(data?.itemsByPhase || {}).sort(
    (a, b) => (a.phase_index || 0) - (b.phase_index || 0)
  );

  const approve = async (m) => {
    try {
      await milestoneApprovedVersion2({
        active_scenario_id: data.active_scenario_id,
        milestone_id: m.milestone_id,
        participant_id: data.participant_id,
      });
      toast.success("Milestone approved");
      refresh();
    } catch (e) {
      toast.error("Approval failed");
    }
  };

  const reject = async (m) => {
    try {
      await milestoneUnApprovedVersion2({
        active_scenario_id: data.active_scenario_id,
        milestone_id: m.milestone_id,
        participant_id: data.participant_id,
      });
      toast.error("Milestone rejected");
      refresh();
    } catch (e) {
      toast.error("Rejection failed");
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {/* HEADER */}
      <Stack spacing={0.5}>
        <Typography fontSize={15} fontWeight={900}>
          CISO Review Panel
        </Typography>
        <Typography fontSize={12} color="#94a3b8">
          Participant: {data.participant_id}
        </Typography>
      </Stack>

      {phases.map((phase) => (
        <Box key={phase.phase_id}>
          {/* PHASE HEADER */}
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 900,
              color: "#38bdf8",
              mb: 1,
            }}
          >
            {phase.phase_name}
          </Typography>

          {phase.items.map((m) => {
            const status = m.is_approved
              ? "APPROVED"
              : m.is_achieved
              ? "SUBMITTED"
              : "PENDING";

            return (
              <Box
                key={m.milestone_id}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #020617, #0f172a)",
                  border: "1px solid rgba(148,163,184,0.25)",
                }}
              >
                {/* TITLE */}
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={800}>
                    {m.milestone_name}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${m.milestone_score} pts`}
                  />
                </Stack>

                {/* STATUS */}
                <Stack direction="row" spacing={1} mt={0.5}>
                  {status === "APPROVED" && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Approved"
                      color="success"
                      size="small"
                    />
                  )}
                  {status === "SUBMITTED" && (
                    <Chip
                      icon={<TaskAltIcon />}
                      label="Submitted"
                      color="warning"
                      size="small"
                    />
                  )}
                  {status === "PENDING" && (
                    <Chip
                      icon={<CancelIcon />}
                      label="Not Submitted"
                      size="small"
                    />
                  )}
                </Stack>

                {/* SCORE */}
                {m.is_approved && (
                  <Typography
                    sx={{ mt: 0.5, fontSize: 12, color: "#22c55e" }}
                  >
                    Final Score: +{m.obtained_score} pts
                  </Typography>
                )}

                {/* TEXT */}
                {m.submitted_text && (
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 12,
                      color: "#e5e7eb",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.submitted_text}
                  </Typography>
                )}

                {/* EVIDENCE */}
                {Array.isArray(m.evidence_files) &&
                  m.evidence_files.length > 0 && (
                    <Stack spacing={0.5} mt={1}>
                      <Typography fontSize={11} color="#94a3b8">
                        Attachments
                      </Typography>

                      {m.evidence_files.map((f, idx) => (
                        <a
                          key={idx}
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 11,
                            color: "#60a5fa",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {f.name}
                        </a>
                      ))}
                    </Stack>
                )}

                {/* META */}
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 11,
                    color: "#94a3b8",
                  }}
                >
                  Submitted: {fmt(m.submitted_at)} <br />
                  Approved: {fmt(m.approved_at)}
                </Typography>

                {/* ACTIONS */}
                {status === "SUBMITTED" && (
                  <Stack direction="row" spacing={1} mt={1}>
                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      onClick={() => approve(m)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => reject(m)}
                    >
                      Reject
                    </Button>
                  </Stack>
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Stack>
  );
};

const FlagModerationPanel = ({ data }) => {
  const phases = Object.values(data?.itemsByPhase || {});

  if (!phases.length) {
    return (
      <Stack sx={{ p: 3 }}>
        <Typography color="#94a3b8" fontSize={13}>
          No flags available for this participant.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      {/* HEADER */}
      <Stack spacing={0.5}>
        <Typography fontSize={15} fontWeight={900}>
          CISO Review Panel (Flags)
        </Typography>
        <Typography fontSize={12} color="#94a3b8">
          Participant: {data?.participant_id}
        </Typography>
      </Stack>

      {phases.map((phase) => (
        <Box key={phase.phase_id}>
          {/* PHASE HEADER */}
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 900,
              color: "#38bdf8",
              mb: 1,
            }}
          >
            {phase.phase_name}
          </Typography>

          {phase.items.map((f) => {
            const status = f.is_approved
              ? "APPROVED"
              : f.is_submitted
              ? "SUBMITTED"
              : "PENDING";

            return (
              <Box
                key={f.flag_id}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #020617, #0f172a)",
                  border: "1px solid rgba(148,163,184,0.25)",
                }}
              >
                {/* TITLE */}
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={800}>
                    {f.flag_name}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${f.flag_score} pts`}
                  />
                </Stack>

                {/* STATUS */}
                <Stack direction="row" spacing={1} mt={0.5}>
                  {status === "APPROVED" && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Approved"
                      color="success"
                      size="small"
                    />
                  )}
                  {status === "SUBMITTED" && (
                    <Chip
                      icon={<TaskAltIcon />}
                      label="Submitted"
                     sx={{
                      backgroundColor: "rgba(56, 189, 248, 0.15)",
                      color: "#38bdf8",
                      border: "1px solid rgba(56, 189, 248, 0.4)",
                    }}
                      size="small"
                    />
                  )}
                  {status === "PENDING" && (
                    <Chip
                      icon={<CancelIcon />}
                      label="Not Submitted"
                      size="small"
                    />
                  )}
                </Stack>

                {/* CORRECT / INCORRECT */}
                {f.is_submitted && (
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 12,
                      color: f.is_correct
                        ? "#22c55e"
                        : "#ef4444",
                    }}
                  >
                    {f.is_correct
                      ? "Correct Submission"
                      : "Incorrect Submission"}
                  </Typography>
                )}

                {/* SCORE */}
                {f.is_submitted && (
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 12,
                      fontWeight: 600,
                      color: f.obtained_score > 0 ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {f.is_approved ? "Final Score" : "Obtained Score"}:{" "}
                    {f.obtained_score > 0 ? `+${f.obtained_score}` : f.obtained_score} pts
                  </Typography>
                )}

                {/* ATTEMPTS */}
                {typeof f.attempt_count !== "undefined" && (
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    Attempts: {f.attempt_count}
                  </Typography>
                )}

                {/* META */}
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: 11,
                    color: "#94a3b8",
                  }}
                >
                  Submitted: {fmt(f.submitted_at)} <br />
                </Typography>
              </Box>
            );
          })}
        </Box>
      ))}
    </Stack>
  );
};

/* ===================== MAIN ===================== */

const IndividualPlayer = ({ data, reload, setReload, load, gameType }) => {
  const iframeRef = useRef(null);
  const [full, setFull] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const refresh = () => setReload(!reload);

  return (
    <Stack width="100%">
      <Backdrop open={isActive}>
        <CircularProgress />
      </Backdrop>

      <Stack direction="row" gap={1}>
        {/* LEFT PANEL */}
        <Stack
          sx={{
            width: full ? "30%" : "0%",
            transition: "width 0.3s",
            overflowY: "auto",
            height: "95vh",
            background:
              "linear-gradient(180deg, #020617, #020617)",
            borderRight: "1px solid rgba(148,163,184,0.15)",
          }}
        >
        {full && gameType === "MILESTONE" && (
          <CISOModerationPanel
            data={data}
            refresh={refresh}
          />
        )}

        {full && gameType === "FLAG" && (
          <FlagModerationPanel
            data={data}
          />
        )}
        </Stack>

        {/* TOGGLE */}
        <Tooltip title="Toggle Details">
          {gameType && (
            <Icons.doubleRightArrow
              style={{
                fontSize: "36px",
                cursor: "pointer",
                width: full ? "0%" : "99.5%",
              }}
              onClick={() => setFull(!full)}
            />
          )}
        </Tooltip>

        {/* IFRAME (UNCHANGED) */}
        <Stack
          style={{
            paddingTop: 4,
            paddingBottom: 4,
            display: "flex",
            width: !full ? "96%" : "70%",
            height: "95vh",
          }}
        >
          <iframe
            ref={iframeRef}
            src={data?.console_url}
            title="Console"
            style={{ width: "100%", height: "100%" }}
            allow="same-origin"
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default IndividualPlayer;
