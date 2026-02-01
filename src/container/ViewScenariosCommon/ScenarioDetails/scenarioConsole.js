// src/pages/.../MachineProfileSenario.jsx
//player console or participant console + right console iframe and left sidebar UI
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
  Chip,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getScenarioWalkthroughs} from "../../../APIConfig/version2Scenario";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LanOutlinedIcon from "@mui/icons-material/LanOutlined";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Icons } from "../../../components/icons";
import CustomModal from "../../../components/ui/CustomModal";
import ErrorHandler from "../../../ErrorHandler";
import { GetIP } from "../../../components/GetIP";

import ScenarioWalkthrough from "./ScenarioWalkthrough";
import Flags from "./PhaseFlags";
import Milestone from "./PhaseMilestones";
import KillChainPhase from "./killChainProgress";


/** ✅ Version-2 APIs (as requested) */
import {
  getConsoleVersion2,
  endGameV2,
  switchMachineVersion2
} from "../../../APIConfig/version2Scenario";

import "./index.css";
import KillChainProgress from "./killChainProgress";

/* -------------------------------------------------- */

function copy(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(
    () => toast.success("Copied"),
    () => toast.error("Copy failed")
  );
}

/* -------------------------------------------------- */

function MachineProfileSenario() {
  const navigate = useNavigate();
  const { id: activeScenarioId } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [data, setData] = useState(null);
  const [full, setFull] = useState(true);
  const [compact, setCompact] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [walkthroughDocs, setWalkthroughDocs] = useState([]);


  /* -------------------------------------------------- */
  /* Fetch Console (V2) */
  /* -------------------------------------------------- */
  const fetchConsole = async () => {
  try {
    setLoading(true);

    const res = await getConsoleVersion2(activeScenarioId);

    // ✅ V2 RESPONSE NORMALIZATION
    const payload = res?.data || res;

    if (!payload || payload?.errors) {
      toast.error(payload?.errors || "Failed to load console");
      return;
    }

    setData(payload);

    /* ===============================
       🔥 ADD WALKTHROUGH FETCH HERE
       =============================== */
    try {
      const phaseIds =
        payload?.kill_chain_progress?.map((p) => p.phase_id) || [];

      if (phaseIds.length > 0) {
        const wtRes = await getScenarioWalkthroughs({
          scenario_id: payload.scenario_id || payload.id,
          team: payload.team,
          phase_ids: phaseIds,
        });

        setWalkthroughDocs(wtRes?.data || []);
      } else {
        setWalkthroughDocs([]);
      }
    } catch (e) {
      console.warn("Scenario walkthrough not available");
      setWalkthroughDocs([]);
    }

  } catch (err) {
    ErrorHandler(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchConsole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScenarioId]);

  useEffect(() => {
  if (
    data &&
    !data.selected_instance_id &&
    Array.isArray(data.consoles) &&
    data.consoles.length > 0
  ) {
    handleSwitchMachine(data.consoles[0].instance_id);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]);


  /* -------------------------------------------------- */
  /* Machine Switch */
  /* -------------------------------------------------- */

const handleSwitchMachine = async (instanceId) => {
  if (!instanceId) return;

  try {
    setSwitching(true);

    await switchMachineVersion2({
      active_scenario_id: activeScenarioId,
      instance_id: instanceId,
    });

    // re-fetch AFTER backend update
    await fetchConsole();
  } catch (err) {
    ErrorHandler(err);
  } finally {
    setSwitching(false);
  }
};



  /* -------------------------------------------------- */
  if (loading) {
    return (
      <Backdrop open sx={{ color: "#fff", zIndex: 1300 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!data) return null;

 const {
  name,
  severity,
  team,
  consoles = [],
  console_url,
  selected_instance_id,
  username,
  password,
  scenario_type,
  items_by_phase = {},
  kill_chain_progress = [],
  total_score = 0,
  total_obtained_score = 0,
} = data || {};

console.log("CONSOLE PAYLOAD", {
  selected_instance_id: data?.selected_instance_id,
  consoles: data?.consoles,
  console_url: data?.console_url,
});
  /* -------------------------------------------------- */
return (
  <Box
    sx={{
      height: "100vh",
      width: "100vw",
      backgroundColor: "#000",
      overflow: "hidden",
    }}
  >
    {/* ================= MAIN LAYOUT ================= */}
    <Stack direction="row" height="100%" width="100%">

      {/* ================= SIDEBAR ================= */}
      {showSidebar && (
        <Box
          sx={{
            width: 400,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "rgba(2,6,23,0.97)",
            borderRight: "1px solid #1e293b",
            zIndex: 2,
          }}
        >
          {/* Scrollable Content */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1.5 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Button
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>

              <Box sx={{ flex: 1 }} />

              <Tooltip title="Refresh">
                <IconButton size="small" onClick={fetchConsole}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Scenario Header Card */}
            <Box
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: 2,
                background:
                  "linear-gradient(180deg, #020617 0%, #020617cc 100%)",
                border: "1px solid #1e293b",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#e5e7eb",
                  mb: 1,
                }}
              >
                {name}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  size="small"
                  label={severity}
                  sx={{
                    backgroundColor: "rgba(148,163,184,0.15)",
                    color: "#e5e7eb",
                  }}
                />

                {scenario_type === "FLAG" && (
                  <Chip
                    size="small"
                    label={`${kill_chain_progress.filter(p => p.is_complete).length}/${kill_chain_progress.length} Flags`}
                    sx={{
                      backgroundColor: "rgba(56,189,248,0.18)",
                      color: "#7dd3fc",
                    }}
                  />
                )}

                {scenario_type === "MILESTONE" && (
                  <Chip
                    size="small"
                    label="Milestone Scenario"
                    sx={{
                      backgroundColor: "rgba(168,85,247,0.18)",
                      color: "#c4b5fd",
                    }}
                  />
                )}

                <Chip
                  size="small"
                  label={`${total_score} Points`}
                  sx={{
                    backgroundColor: "#00ffffb8",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                />
              </Stack>
            </Box>

            {/* Kill Chain */}
            <KillChainProgress
              killChainProgress={kill_chain_progress}
              currentPhaseId={
                kill_chain_progress?.find(p => !p.is_complete)?.phase_id
              }
            />

            {/* Flags / Milestones */}
            <Box mt={2}>
              {scenario_type === "FLAG" ? (
                <Flags
                  activeScenarioId={activeScenarioId}
                  itemsByPhase={items_by_phase}
                  refresh={fetchConsole}
                />
              ) : (
                <Milestone
                  activeScenarioId={activeScenarioId}
                  itemsByPhase={items_by_phase}
                  refresh={fetchConsole}
                />
              )}
            </Box>

            {/* Walkthrough */}
            <Box mt={2}>
              <ScenarioWalkthrough
                walkthroughDocs={walkthroughDocs}
                killChainProgress={kill_chain_progress}
              />
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 1.5,
              borderTop: "1px solid #1e293b",
              display: "flex",
              gap: 1,
            }}
          >
            {data?.active_scenario_id && (
              <GetIP active_scenario_id={data.active_scenario_id} />
            )}

            <Button
              variant="contained"
              size="small"
              startIcon={<ChatBubbleOutlineIcon />}
              onClick={() =>
                navigate(`/scenario-chat/${data.active_scenario_id}`)
              }
              sx={{
                flex: 1,
                border: "3px solid #00FFFF",
                borderRadius: 4.5,
                background:
                  "linear-gradient(135deg, #222E37, #22d3ee)",
                color: "#020617",
                fontWeight: 600,
              }}
            >
              Team Chat
            </Button>
          </Box>
        </Box>
      )}

      {/* ================= CONSOLE AREA ================= */}
      <Stack flex={1} height="100%" width="100%">

        {/* Top Bar */}
        <Box
          sx={{
            height: 48,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1,
            background: "rgba(2,6,23,0.9)",
            borderBottom: "1px solid #1e293b",
          }}
        >
  {/* LEFT: Sidebar toggle (ICON ONLY) */}
  <Tooltip title={showSidebar ? "Hide details" : "Show details"}>
    <IconButton
      size="small"
      onClick={() => setShowSidebar((p) => !p)}
      sx={{
        color: "#e5e7eb",
        border: "1px solid #1e293b",
        borderRadius: 1,
      }}
    >
      {showSidebar ? (
        <Icons.doubleLeftArrow />
      ) : (
        <Icons.doubleRightArrow />
      )}
    </IconButton>
  </Tooltip>

  <Box sx={{ flex: 1 }} />

  {/* RIGHT: Machine switch */}
  {consoles.length > 0 && (
    <Select
      size="small"
      value={selected_instance_id || ""}
      onChange={(e) => handleSwitchMachine(e.target.value)}
      disabled={switching}
      sx={{
        minWidth: 260,
        backgroundColor: "rgba(15,23,42,0.9)",
        color: "#e5e7eb",
        borderRadius: 1,
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1e293b",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#38bdf8",
        },
        "& .MuiSvgIcon-root": {
          color: "#e5e7eb",
        },
      }}
    >
      {consoles.map((c) => (
        <MenuItem key={c.instance_id} value={c.instance_id}>
          {c.instance_id}
        </MenuItem>
      ))}
    </Select>
  )}
</Box>

        {/* Console iframe */}
        <Box sx={{ flex: 1, backgroundColor: "#000" }}>
          <iframe
            src={console_url}
            title="Scenario Console"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </Box>
      </Stack>
    </Stack>
  </Box>
);
}

export default MachineProfileSenario;
