import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { getSuperAdminScenarioOverview } from "../../APIConfig/SuperAdminConfig";
import { endGameV2 } from "../../APIConfig/version2Scenario";

import LeaderboardTab from "./LeaderboardTab";
import ConfigTab from "./ConfigTab";

export default function ActiveScenarioDetails() {
  const { activeScenarioId } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [overview, setOverview] = useState(null);

  // confirmation dialog states
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loadingEnd, setLoadingEnd] = useState(false);

  useEffect(() => {
    fetchOverview();
  }, [activeScenarioId]);

const fetchOverview = async () => {
  try {
    const res = await getSuperAdminScenarioOverview(activeScenarioId);

    if (!res || !res.data) {
      navigate("/superadmin/scenario/active");
      return;
    }

    setOverview(res.data);
  } catch (err) {
    console.error("Overview fetch failed:", err);

    // If scenario no longer exists → redirect
    navigate("/superadmin/scenario/active");
  }
};

  // =========================
  // END GAME HANDLER
  // =========================
 const handleEndGame = async () => {
  if (confirmText !== overview?.scenario_name) return;

  try {
    setLoadingEnd(true);
    await endGameV2(activeScenarioId);

    // Immediately redirect
    navigate("/superadmin", { replace: true });

  } catch (err) {
    console.error(err);
    alert("Failed to end scenario.");
  }
};

if (!overview) {
  return (
    <Box
      sx={{
        p: 4,
        background: "#020617",
        minHeight: "100vh",
        color: "#94a3b8",
      }}
    >
      Loading...
    </Box>
  );
}
  return (
    <Box sx={{ p: 4, background: "#020617", minHeight: "100vh" }}>
      
      {/* ================= HEADER ================= */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={900} color="#38bdf8">
          {overview?.scenario_name}
        </Typography>

        <Button
          startIcon={<WarningAmberIcon />}
          variant="contained"
          onClick={() => setOpenConfirm(true)}
          sx={{
            background: "linear-gradient(90deg,#dc2626,#b91c1c)",
            fontWeight: 800,
          }}
        >
          End Game
        </Button>
      </Stack>

      {/* ================= TABS ================= */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ mt: 2 }}
      >
        <Tab label="Leaderboard" />
        <Tab label="Scenario Config" />
      </Tabs>

      <Box mt={3}>
        {tab === 0 && (
          <LeaderboardTab activeScenarioId={activeScenarioId} />
        )}
        {tab === 1 && (
          <ConfigTab activeScenarioId={activeScenarioId} />
        )}
      </Box>

      {/* ================= DOUBLE CONFIRM DIALOG ================= */}

{/* ================= DOUBLE CONFIRM DIALOG ================= */}
        <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        PaperProps={{
            sx: {
            background: "#0f172a",
            color: "#e5e7eb",
            border: "1px solid rgba(56,189,248,0.25)",
            boxShadow: "0 0 30px rgba(0,0,0,0.6)",
            borderRadius: 3,
            },
        }}
        >
        <DialogTitle
            sx={{
            color: "#ef4444",
            fontWeight: 900,
            borderBottom: "1px solid rgba(148,163,184,0.15)",
            }}
        >
            ⚠ End Scenario Permanently
        </DialogTitle>

        <DialogContent sx={{ minWidth: 420, mt: 2 }}>
            <Typography sx={{ color: "#cbd5e1", mb: 2 }}>
            This action will permanently end this active scenario.
            <br />
            All running sessions will be closed.
            </Typography>

            <Typography sx={{ fontWeight: 800, mb: 1, color: "#38bdf8" }}>
            Type the scenario name to confirm:
            </Typography>

            <TextField
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={overview?.scenario_name}
            sx={{
                "& .MuiOutlinedInput-root": {
                backgroundColor: "#020617",
                color: "#e5e7eb",
                "& fieldset": {
                    borderColor: "rgba(148,163,184,0.3)",
                },
                "&:hover fieldset": {
                    borderColor: "#38bdf8",
                },
                "&.Mui-focused fieldset": {
                    borderColor: "#38bdf8",
                },
                },
                "& input": {
                color: "#e5e7eb",
                },
            }}
            />
        </DialogContent>

        <DialogActions
            sx={{
            borderTop: "1px solid rgba(148,163,184,0.15)",
            px: 3,
            py: 2,
            }}
        >
            <Button
            onClick={() => setOpenConfirm(false)}
            sx={{
                color: "#94a3b8",
                fontWeight: 700,
            }}
            >
            Cancel
            </Button>

            <Button
            variant="contained"
            disabled={
                loadingEnd ||
                confirmText !== overview?.scenario_name
            }
            onClick={handleEndGame}
            sx={{
            background: "linear-gradient(90deg,#22d3ee,#06b6d4)",
            color: "#000000",
            fontWeight: 800,
            "&:hover": {
                background: "#0891b2",
            },
            "&.Mui-disabled": {
                color: "#0f172a",
                opacity: 0.4,
                background: "linear-gradient(90deg,#22d3ee,#06b6d4)",
            },
            }}
            >
            {loadingEnd ? "Ending..." : "Confirm End Game"}
            </Button>
        </DialogActions>
        </Dialog>
    </Box>
  );
}