// WhitePlayer.jsx — Advanced Futuristic Moderator (White Team) Dashboard
// ✅ Adds: Team Group switch (Team A/Team B/All), Role navigation, Milestone+Flag support,
// ✅ CISO Executive View tab (All Teams + Team-wise KPIs), keeps current dark theme style.
// NOTE: LiveScore is reused (existing). Detailed per-player console stays same route.

import React, { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Backdrop,
  CircularProgress,
  Tab,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { endGameV2, whiteTeamVersion2 } from "../../../APIConfig/version2Scenario";
import reImg from "../ActiveGame/2671.png";
import CustomModal from "../../../components/ui/CustomModal";
import ErrorHandler from "../../../ErrorHandler";
import LiveScore from "./LiveScore";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";


const SURFACE = "#16181F";
const SURFACE_2 = "#1C1F28";
const BORDER = "#282c38";
const TXT = "#EAEAEB";
const TXT_MUTED = "#BCBEC1";

const Glass = styled(Box)({
  background: "linear-gradient(180deg, rgba(28,31,40,0.92) 0%, rgba(22,24,31,0.92) 100%)",
  border: `1px solid rgba(255,255,255,0.06)`,
  boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  backdropFilter: "blur(10px)",
  borderRadius: 14,
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 999,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 999,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

function normalizeParticipants(src = {}) {
  return {
    red_team: Array.isArray(src.red_team) ? src.red_team : [],
    blue_team: Array.isArray(src.blue_team) ? src.blue_team : [],
    purple_team: Array.isArray(src.purple_team) ? src.purple_team : [],
    yellow_team: Array.isArray(src.yellow_team) ? src.yellow_team : [],
  };
}

function safeNum(n, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

function pct(n, d) {
  const N = safeNum(n);
  const D = safeNum(d);
  if (!D) return 0;
  return Math.max(0, Math.min(100, (N / D) * 100));
}

function isoToLocal(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  } catch {
    return "-";
  }
}

function minutesBetween(a, b) {
  if (!a || !b) return null;
  const da = new Date(a);
  const db = new Date(b);
  if (isNaN(da.getTime()) || isNaN(db.getTime())) return null;
  return Math.round((da.getTime() - db.getTime()) / 60000);
}

const ExecKpiCard = ({ title, value, sub, chip, accent = "#6ee7ff" }) => (
  <Glass sx={{ p: 2.25 }}>
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
      <Stack>
        <Typography sx={{ color: TXT_MUTED, fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase" }}>
          {title}
        </Typography>
        <Typography sx={{ color: TXT, fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
          {value}
        </Typography>
        {sub ? (
          <Typography sx={{ color: TXT_MUTED, fontSize: 12, mt: 0.5 }}>
            {sub}
          </Typography>
        ) : null}
      </Stack>
      {chip ? (
        <Chip
          label={chip}
          size="small"
          sx={{
            bgcolor: "rgba(110,231,255,0.08)",
            color: accent,
            border: "1px solid rgba(110,231,255,0.22)",
            fontWeight: 600,
          }}
        />
      ) : null}
    </Stack>
  </Glass>
);

const RolePill = ({ label, count, active, color, onClick }) => (
  <Button
    onClick={onClick}
    variant="text"
    sx={{
      px: 1.6,
      py: 0.9,
      borderRadius: "999px",
      textTransform: "none",
      color: active ? TXT : TXT_MUTED,
      background: active ? "rgba(255,255,255,0.06)" : "transparent",
      border: active ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.06)",
      "&:hover": { background: "rgba(255,255,255,0.08)" },
      display: "flex",
      gap: 1,
      alignItems: "center",
    }}
  >
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "999px",
        bgcolor: color,
        boxShadow: `0 0 0 6px rgba(255,255,255,0.02)`,
      }}
    />
    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{label}</Typography>
    <Chip
      size="small"
      label={count}
      sx={{
        height: 20,
        bgcolor: "rgba(255,255,255,0.06)",
        color: TXT_MUTED,
        border: "1px solid rgba(255,255,255,0.08)",
        fontWeight: 700,
      }}
    />
  </Button>
);

const PlayerRow = ({
  item,
  scenarioId,
  onOpenConsole,
  isMilestone,
  startTime,
}) => {
  const totalMilestones = safeNum(item.total_milestone);
  const approved = safeNum(item.milestone_approved);
  const totalHints = safeNum(item.total_hint);
  const hintUsed = safeNum(item.hint_used_count);

  const milestoneProgress = pct(approved, totalMilestones);
  const hintProgress = pct(hintUsed, totalHints);

  // Optional: show the earliest achieved/approved time among milestones
  const timeline = useMemo(() => {
    const ms = Array.isArray(item.milestone_data) ? item.milestone_data : [];
    const achievedTimes = ms.map(m => m.achieved_at).filter(Boolean).map(t => new Date(t).getTime()).filter(Number.isFinite);
    const approvedTimes = ms.map(m => m.approved_at).filter(Boolean).map(t => new Date(t).getTime()).filter(Number.isFinite);
    const firstAchieved = achievedTimes.length ? new Date(Math.min(...achievedTimes)).toISOString() : null;
    const lastApproved = approvedTimes.length ? new Date(Math.max(...approvedTimes)).toISOString() : null;

    const mttdMin = firstAchieved && startTime ? minutesBetween(firstAchieved, startTime) : null;
    const reviewLagMin = firstAchieved && lastApproved ? minutesBetween(lastApproved, firstAchieved) : null;

    return { firstAchieved, lastApproved, mttdMin, reviewLagMin };
  }, [item, startTime]);

  return (
    <Stack direction="row" gap={2} width="100%" sx={{ py: 1.2 }}>
      <Avatar alt={item?.participant_name} src={item?.participant_avatar} />
      <Stack width="100%" gap={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Stack>
            <Typography sx={{ color: TXT, fontWeight: 700 }}>
              {item.participant_name}
            </Typography>
            <Typography sx={{ color: TXT_MUTED, fontSize: 12 }}>
              Score: <span style={{ color: TXT }}>{safeNum(item?.total_obtained_score)}/{safeNum(item?.total_score)}</span>
              {timeline.mttdMin !== null ? (
                <>
                  {"  "}•{" "}
                  <span style={{ color: "#6ee7ff", fontWeight: 700 }}>
                    MTTD {timeline.mttdMin}m
                  </span>
                </>
              ) : null}
              {timeline.reviewLagMin !== null ? (
                <>
                  {"  "}•{" "}
                  <span style={{ color: "#a78bfa", fontWeight: 700 }}>
                    Review Lag {timeline.reviewLagMin}m
                  </span>
                </>
              ) : null}
            </Typography>
          </Stack>

          <Button
            onClick={() => onOpenConsole(scenarioId, item.participant_id)}
            sx={{
              textTransform: "none",
              borderRadius: 999,
              px: 1.8,
              bgcolor: "rgba(110,231,255,0.08)",
              border: "1px solid rgba(110,231,255,0.18)",
              color: "#6ee7ff",
              "&:hover": { bgcolor: "rgba(110,231,255,0.12)" },
            }}
          >
            View Console
          </Button>
        </Stack>

        {isMilestone ? (
          <>
            <Stack direction="row" gap={1} alignItems="center">
              <Typography sx={{ color: TXT_MUTED, fontSize: 12, minWidth: 140 }}>
                Milestones Approved
              </Typography>
              <Typography sx={{ color: TXT, fontSize: 12, fontWeight: 700 }}>
                {approved}/{totalMilestones || 0}
              </Typography>
            </Stack>
            <BorderLinearProgress variant="determinate" value={milestoneProgress} />

            <Stack direction="row" gap={1} alignItems="center">
              <Typography sx={{ color: TXT_MUTED, fontSize: 12, minWidth: 140 }}>
                Hints Used
              </Typography>
              <Typography sx={{ color: TXT, fontSize: 12, fontWeight: 700 }}>
                {hintUsed}/{totalHints || 0}
              </Typography>
            </Stack>
            <BorderLinearProgress variant="determinate" value={hintProgress} />
          </>
        ) : (
          <Stack direction="row" gap={1} alignItems="center">
            <Typography sx={{ color: TXT_MUTED, fontSize: 12 }}>
              Flag-based scenario • Track via Leaderboard & console timeline
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

const TeamPanel = ({
  title,
  color,
  players,
  scenarioId,
  onOpenConsole,
  isMilestone,
  startTime,
}) => {
  const count = Array.isArray(players) ? players.length : 0;

  return (
    <Glass sx={{ p: 2.25 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack direction="row" alignItems="center" gap={1.2}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: 999,
              bgcolor: color,
              boxShadow: "0 0 24px rgba(255,255,255,0.06)",
            }}
          />
          <Typography sx={{ color: TXT, fontSize: 16, fontWeight: 800 }}>
            {title}
          </Typography>
          <Chip
            size="small"
            label={`${count} players`}
            sx={{
              bgcolor: "rgba(255,255,255,0.06)",
              color: TXT_MUTED,
              border: "1px solid rgba(255,255,255,0.08)",
              fontWeight: 700,
            }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ borderColor: BORDER, mb: 1.25 }} />

      {count === 0 ? (
        <Typography sx={{ color: TXT_MUTED, fontSize: 12 }}>
          No participants in this team.
        </Typography>
      ) : (
        <Stack gap={0.6}>
          {players.map((p, idx) => (
            <React.Fragment key={`${p.participant_id || idx}`}>
              <PlayerRow
                item={p}
                scenarioId={scenarioId}
                onOpenConsole={onOpenConsole}
                isMilestone={isMilestone}
                startTime={startTime}
              />
              {idx !== players.length - 1 ? (
                <Divider sx={{ borderColor: BORDER }} />
              ) : null}
            </React.Fragment>
          ))}
        </Stack>
      )}
    </Glass>
  );
};

const WhitePlayer = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  // Main tabs:
  // 1 = Detailed (milestone only)
  // 2 = Live leaderboard (existing)
  // 3 = Executive view (new)
  const [val, setVal] = useState("2");

  // Team Group switch: All / TeamA / TeamB ...
  const [groupVal, setGroupVal] = useState("ALL");

  // Role filter inside Detailed + Exec
  const [roleVal, setRoleVal] = useState("ALL"); // ALL/RED/BLUE/PURPLE/YELLOW

  useEffect(() => {
    getValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getValue = async () => {
    try {
      setIsActive(true);
      const res = await whiteTeamVersion2();
      const payload = res?.data || {};

      // default landing tab: leaderboard
      setVal(payload.type === "milestone" ? "2" : "2");
      setData(payload);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsActive(false);
    }
  };

  const isMilestone = useMemo(() => data?.type !== "flag_data", [data]);
  const scenarioTypeLabel = useMemo(
    () => (data?.type === "flag_data" ? "Flag based" : "Milestone based"),
    [data]
  );

  const title = data?.name || "Active Scenario";
  const startTime = data?.start_time;

  const teamGroups = useMemo(() => {
    const tg = data?.team_groups || {};
    const keys = Object.keys(tg || {});
    // If backend later returns created_team_groups, prefer that for ordering/visibility.
    const created = Array.isArray(data?.created_team_groups) ? data.created_team_groups : null;
    const finalKeys = created?.length ? created.filter(k => keys.includes(k)) : keys;
    return finalKeys;
  }, [data]);

  const visibleParticipants = useMemo(() => {
    if (groupVal === "ALL") {
      return normalizeParticipants(data?.participants_data);
    }
    return normalizeParticipants(data?.team_groups?.[groupVal]);
  }, [data, groupVal]);

  const roleCounts = useMemo(() => {
    const pd = normalizeParticipants(visibleParticipants);

    return {
      RED: pd.red_team.length,
      BLUE: pd.blue_team.length,
      PURPLE: pd.purple_team.length,
      YELLOW: pd.yellow_team.length,
      ALL:
        pd.red_team.length +
        pd.blue_team.length +
        pd.purple_team.length +
        pd.yellow_team.length,
    };
  }, [visibleParticipants]);

  const roleFiltered = useMemo(() => {
    const pd = normalizeParticipants(visibleParticipants);

    if (roleVal === "RED") {
      return {
        red_team: pd.red_team,
        blue_team: [],
        purple_team: [],
        yellow_team: [],
      };
    }

    if (roleVal === "BLUE") {
      return {
        red_team: [],
        blue_team: pd.blue_team,
        purple_team: [],
        yellow_team: [],
      };
    }

    if (roleVal === "PURPLE") {
      return {
        red_team: [],
        blue_team: [],
        purple_team: pd.purple_team,
        yellow_team: [],
      };
    }

    if (roleVal === "YELLOW") {
      return {
        red_team: [],
        blue_team: [],
        purple_team: [],
        yellow_team: pd.yellow_team,
      };
    }

    // ALL roles — return EVERYTHING, explicitly
    return {
      red_team: pd.red_team,
      blue_team: pd.blue_team,
      purple_team: pd.purple_team,
      yellow_team: pd.yellow_team,
    };
  }, [visibleParticipants, roleVal]);

  const executiveMetrics = useMemo(() => {
    // Aggregate across visibleParticipants (already filtered by groupVal)
    const pd = roleFiltered || {};
    const allPlayers = []
      .concat(pd.red_team || [])
      .concat(pd.blue_team || [])
      .concat(pd.purple_team || [])
      .concat(pd.yellow_team || []);

    const totalPlayers = allPlayers.length;

    const totalScore = allPlayers.reduce((acc, p) => acc + safeNum(p.total_score), 0);
    const totalObtained = allPlayers.reduce((acc, p) => acc + safeNum(p.total_obtained_score), 0);
    const scorePct = totalScore ? Math.round((totalObtained / totalScore) * 100) : 0;

    const totalMilestones = allPlayers.reduce((acc, p) => acc + safeNum(p.total_milestone), 0);
    const totalApproved = allPlayers.reduce((acc, p) => acc + safeNum(p.milestone_approved), 0);

    const totalHints = allPlayers.reduce((acc, p) => acc + safeNum(p.total_hint), 0);
    const hintsUsed = allPlayers.reduce((acc, p) => acc + safeNum(p.hint_used_count), 0);

    // Timeline metrics (if achieved_at exists)
    let firstAchieved = null;
    let lastApproved = null;

    allPlayers.forEach((p) => {
      const ms = Array.isArray(p.milestone_data) ? p.milestone_data : [];
      ms.forEach((m) => {
        if (m?.achieved_at) {
          const t = new Date(m.achieved_at).getTime();
          if (Number.isFinite(t)) {
            if (!firstAchieved || t < firstAchieved) firstAchieved = t;
          }
        }
        if (m?.approved_at) {
          const t = new Date(m.approved_at).getTime();
          if (Number.isFinite(t)) {
            if (!lastApproved || t > lastApproved) lastApproved = t;
          }
        }
      });
    });

    const mttd = firstAchieved && startTime ? minutesBetween(new Date(firstAchieved).toISOString(), startTime) : null;
    const execLag =
      firstAchieved && lastApproved ? Math.max(0, Math.round((lastApproved - firstAchieved) / 60000)) : null;

    return {
      totalPlayers,
      totalScore,
      totalObtained,
      scorePct,
      totalMilestones,
      totalApproved,
      milestonePct: totalMilestones ? Math.round((totalApproved / totalMilestones) * 100) : 0,
      totalHints,
      hintsUsed,
      hintPct: totalHints ? Math.round((hintsUsed / totalHints) * 100) : 0,
      mttd,
      execLag,
    };
  }, [visibleParticipants, startTime]);

  const handleClickOpen = () => navigate("/squad/scenarioCategory");

  const onOpenConsole = (scenarioId, participantId) => {
    navigate(`/activeGameScenario/consolePage/${scenarioId}/${participantId}`);
  };

  const endGameConsole = async () => {
    try {
      setIsActive(true);
      const value = await endGameV2(data?.active_scenario_id);
      if (value) setIsEnd(true);
    } catch (e) {
      ErrorHandler(e);
    } finally {
      setIsActive(false);
    }
  };

  const handleMainTabChange = (event, newValue) => setVal(newValue);

  const handleGroupChange = (event, newValue) => {
    setGroupVal(newValue);
    setRoleVal("ALL");
  };

  const headerMetaLeft = ["Severity", "Scenario Type", "Started At"];
  const headerMetaRight = [
    data?.severity || "-",
    scenarioTypeLabel,
    isoToLocal(data?.start_time),
  ];

  // For the detailed grid layout (two columns), keep your current structure but with better cards
  const teamCards = [
    { key: "red_team", name: "Red Team", color: "red", players: roleFiltered.red_team || [] },
    { key: "blue_team", name: "Blue Team", color: "dodgerblue", players: roleFiltered.blue_team || [] },
    { key: "purple_team", name: "Purple Team", color: "violet", players: roleFiltered.purple_team || [] },
    { key: "yellow_team", name: "Yellow Team", color: "gold", players: roleFiltered.yellow_team || [] },
  ].filter((c) => {
    if (roleVal === "ALL") return true;
    if (roleVal === "RED") return c.key === "red_team";
    if (roleVal === "BLUE") return c.key === "blue_team";
    if (roleVal === "PURPLE") return c.key === "purple_team";
    if (roleVal === "YELLOW") return c.key === "yellow_team";
    return true;
  });

  return (
    <Stack width="95%" alignContent="center" justifyContent="center">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isActive}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <CustomModal
        open={isEnd}
        sx={{ py: 5.5, maxWidth: "650px" }}
        hideCloseIcon
        disableExternalClick
      >
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h2" color={TXT}>
            Your Game Ended Successfully.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "40px", justifyContent: "center", mt: "56px" }}>
          <Button onClick={() => { setIsEnd(false); navigate("/"); }}>
            Close Window
          </Button>
        </Box>
      </CustomModal>

      {!data?.thumbnail_url ? (
        <Glass sx={{ p: 5, mt: 2 }}>
          <Stack justifyContent="center" alignContent="center">
            <Stack alignItems="center" justifyContent="center" padding={6}>
              <img src={reImg} alt="No active scenario" style={{ width: 269, height: 179 }} />
              <Typography sx={{ fontSize: 15, color: "#ACACAC", mb: 1 }} variant="h6">
                There are no active running Squad games at the moment. Start a scenario to view live telemetry and executive KPIs.
              </Typography>
            </Stack>
            <Stack justifyContent="center" alignItems="center">
              <Button
                sx={{ display: "flex", fontWeight: "bold", width: 180, borderRadius: 999 }}
                variant="contained"
                color="secondary"
                onClick={handleClickOpen}
              >
                Play Now
              </Button>
            </Stack>
          </Stack>
        </Glass>
      ) : (
        <Stack justifyContent="center" alignItems="center" padding={3} width="100%">
          <Glass sx={{ width: "92%", p: 3 }}>
            {/* Header */}
            <Stack sx={{ borderBottom: `1px solid ${BORDER}`, pb: 2.5 }} gap={2}>
              <Stack direction="row" gap={2.5} alignItems="center">
                <Box
                  component="img"
                  sx={{
                    height: 220,
                    width: 180,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
                  }}
                  src={data?.thumbnail_url}
                />

                <Stack gap={1.2} width="100%">
                  <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                    <Stack>
                      <Typography variant="h2" sx={{ color: TXT, fontWeight: 900, letterSpacing: 0.2 }}>
                        {title}
                      </Typography>
                      <Stack direction="row" gap={1} mt={0.5} flexWrap="wrap">
                        <Chip
                          label={scenarioTypeLabel}
                          size="small"
                          sx={{
                            bgcolor: "rgba(110,231,255,0.08)",
                            color: "#6ee7ff",
                            border: "1px solid rgba(110,231,255,0.18)",
                            fontWeight: 800,
                          }}
                        />
                        <Chip
                          label={`Severity: ${data?.severity || "-"}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.06)",
                            color: TXT_MUTED,
                            border: "1px solid rgba(255,255,255,0.08)",
                            fontWeight: 800,
                          }}
                        />
                        <Chip
                          label={`Started: ${isoToLocal(data?.start_time)}`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.06)",
                            color: TXT_MUTED,
                            border: "1px solid rgba(255,255,255,0.08)",
                            fontWeight: 800,
                          }}
                        />
                      </Stack>
                    </Stack>

                    <Tooltip title="Ends the active scenario session for this moderator">
                      <Button
                        onClick={endGameConsole}
                        variant="outlined"
                        endIcon={<PowerSettingsNewIcon />}
                        sx={{
                          borderRadius: 999,
                          borderColor: "rgba(255,255,255,0.18)",
                          color: TXT,
                          "&:hover": { borderColor: "rgba(255,255,255,0.28)" },
                        }}
                      >
                        End Game
                      </Button>
                    </Tooltip>
                  </Stack>

                  {/* Meta grid */}
                  <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                    <Glass sx={{ p: 1.6, flex: 1 }}>
                      <Stack direction="row" gap={2}>
                        <Stack gap={0.6}>
                          {headerMetaLeft.map((t, idx) => (
                            <Typography key={idx} sx={{ color: TXT_MUTED, fontSize: 12 }}>
                              {t}
                            </Typography>
                          ))}
                        </Stack>
                        <Stack gap={0.6}>
                          {headerMetaRight.map((t, idx) => (
                            <Typography key={idx} sx={{ color: TXT, fontSize: 12, fontWeight: 700 }}>
                              {t}
                            </Typography>
                          ))}
                        </Stack>
                      </Stack>
                    </Glass>

                  <Glass sx={{ p: 1.6, flex: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      {/* Scenario Info */}
                      <Stack>
                        <Typography
                          sx={{
                            color: TXT_MUTED,
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: 0.6,
                          }}
                        >
                          Active Scenario
                        </Typography>
                        <Typography sx={{ color: TXT, fontSize: 12, fontWeight: 800 }}>
                          {data?.active_scenario_id}
                        </Typography>
                      </Stack>


                      {/* 🔥 WHITE TEAM CHAT BUTTON */}
                      <Button
                        size="small"
                        startIcon={<ChatBubbleOutlineIcon />}
                        onClick={() => {
                          if (!data?.active_scenario_id) return;

                          window.open(
                            `/scenario-chat/${data.active_scenario_id}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        sx={{
                          ml: 2,
                          px: 2,
                          borderRadius: 3,
                          border: "2px solid #22d3ee",
                          background: "linear-gradient(135deg, #0f172a, #22d3ee)",
                          color: "#020617",
                          fontWeight: 900,
                          "&:hover": {
                            background: "linear-gradient(135deg, #22d3ee, #0f172a)",
                          },
                        }}
                      >
                        White Team Chat
                      </Button>
                    </Stack>
                  </Glass>
                  </Stack>
                </Stack>
              </Stack>

              {/* Team group switch */}
              <TabContext value={groupVal}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ mt: 2 }}>
                  <Typography sx={{ color: TXT, fontWeight: 800 }}>
                    Team Groups
                  </Typography>
                  <TabList
                    onChange={handleGroupChange}
                    aria-label="Team groups"
                    sx={{
                      "& .MuiTab-root": {
                        textTransform: "none",
                        color: TXT_MUTED,
                        fontWeight: 800,
                        borderRadius: 999,
                        minHeight: 36,
                      },
                      "& .Mui-selected": {
                        color: TXT,
                      },
                      "& .MuiTabs-indicator": {
                        height: 0,
                      },
                    }}
                  >
                    <Tab
                      label="All Teams"
                      value="ALL"
                      sx={{
                        bgcolor: groupVal === "ALL" ? "rgba(255,255,255,0.06)" : "transparent",
                        border: "1px solid rgba(255,255,255,0.10)",
                        px: 2.2,
                        mr: 1,
                      }}
                    />
                    {teamGroups.map((g) => (
                      <Tab
                        key={g}
                        label={g}
                        value={g}
                        sx={{
                          bgcolor: groupVal === g ? "rgba(255,255,255,0.06)" : "transparent",
                          border: "1px solid rgba(255,255,255,0.10)",
                          px: 2.2,
                          mr: 1,
                        }}
                      />
                    ))}
                  </TabList>
                </Stack>
              </TabContext>

              {/* Role filter pills */}
              <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                <RolePill
                  label="All Roles"
                  count={roleCounts.ALL}
                  active={roleVal === "ALL"}
                  color="#6ee7ff"
                  onClick={() => setRoleVal("ALL")}
                />
                <RolePill
                  label="Red"
                  count={roleCounts.RED}
                  active={roleVal === "RED"}
                  color="red"
                  onClick={() => setRoleVal("RED")}
                />
                <RolePill
                  label="Blue"
                  count={roleCounts.BLUE}
                  active={roleVal === "BLUE"}
                  color="dodgerblue"
                  onClick={() => setRoleVal("BLUE")}
                />
                <RolePill
                  label="Purple"
                  count={roleCounts.PURPLE}
                  active={roleVal === "PURPLE"}
                  color="violet"
                  onClick={() => setRoleVal("PURPLE")}
                />
                <RolePill
                  label="Yellow"
                  count={roleCounts.YELLOW}
                  active={roleVal === "YELLOW"}
                  color="gold"
                  onClick={() => setRoleVal("YELLOW")}
                />
              </Stack>
            </Stack>

            {/* Main tabs */}
            <Box sx={{ width: "100%", typography: "body1", mt: 2.25 }}>
              <TabContext value={val}>
                <Stack
                  direction="row"
                  sx={{
                    borderBottom: `1px solid ${BORDER}`,
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    pb: 1.2,
                  }}
                >
                  <Typography sx={{ color: TXT, fontWeight: 800 }}>
                    Moderator Console
                  </Typography>

                  <TabList
                    onChange={handleMainTabChange}
                    aria-label="Moderator tabs"
                    sx={{
                      "& .MuiTab-root": {
                        textTransform: "none",
                        color: TXT_MUTED,
                        fontWeight: 800,
                        borderRadius: 999,
                        minHeight: 36,
                      },
                      "& .Mui-selected": { color: TXT },
                      "& .MuiTabs-indicator": { height: 0 },
                    }}
                  >
                    {isMilestone && (
                      <Tab
                        label="Detailed View"
                        value="1"
                        sx={{
                          bgcolor: val === "1" ? "rgba(255,255,255,0.06)" : "transparent",
                          border: "1px solid rgba(255,255,255,0.10)",
                          px: 2.2,
                          mr: 1,
                        }}
                      />
                    )}

                    <Tab
                      label="All Leaderboards"
                      value="2"
                      sx={{
                        bgcolor: val === "2" ? "rgba(255,255,255,0.06)" : "transparent",
                        border: "1px solid rgba(255,255,255,0.10)",
                        px: 2.2,
                        mr: 1,
                      }}
                    />

                    <Tab
                      label="CISO Executive View"
                      value="3"
                      sx={{
                        bgcolor: val === "3" ? "rgba(255,255,255,0.06)" : "transparent",
                        border: "1px solid rgba(255,255,255,0.10)",
                        px: 2.2,
                      }}
                    />
                  </TabList>
                </Stack>

                {/* Detailed View (Milestone only) */}
                {isMilestone && (
                  <TabPanel value="1" sx={{ px: 0, pt: 2.5 }}>
                    <Grid container spacing={2}>
                      {teamCards.map((t) => (
                        <Grid item xs={12} md={6} key={t.key}>
                          <TeamPanel
                            title={t.name}
                            color={t.color}
                            players={t.players}
                            scenarioId={data?.active_scenario_id}
                            onOpenConsole={onOpenConsole}
                            isMilestone={true}
                            startTime={startTime}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </TabPanel>
                )}

                {/* All Leaderboards Tab */}
                <TabPanel value="2" sx={{ px: 0, pt: 2.5 }}>
                  <Grid container spacing={2}>
                    {/* Global leaderboard (all visible by groupVal) */}
                    <Grid item xs={12}>
                      <Glass sx={{ p: 2.25 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography sx={{ color: TXT, fontWeight: 900 }}>
                            Live Leaderboard — {groupVal === "ALL" ? "All Teams" : groupVal}
                          </Typography>
                          <Chip
                            label={scenarioTypeLabel}
                            size="small"
                            sx={{
                              bgcolor: "rgba(110,231,255,0.08)",
                              color: "#6ee7ff",
                              border: "1px solid rgba(110,231,255,0.18)",
                              fontWeight: 800,
                            }}
                          />
                        </Stack>
                        <Divider sx={{ borderColor: BORDER, mb: 1.5 }} />

                        {/* Reuse your existing LiveScore component. If later you add group filter, pass it here. */}
                        <Stack width="100%">
                          <LiveScore
                            group={data?.active_scenario_id}
                            gameType={scenarioTypeLabel !== "Milestone based" ? scenarioTypeLabel : null}
                            scenarioId={data?.active_scenario_id}
                          />
                        </Stack>
                      </Glass>
                    </Grid>

                    {/* Quick role snapshots */}
                    {/* Quick role snapshots */}
                    {[
                      { key: "red", label: "Red Team Snapshot", color: "red", list: roleFiltered.red_team },
                      { key: "blue", label: "Blue Team Snapshot", color: "dodgerblue", list: roleFiltered.blue_team },
                      { key: "purple", label: "Purple Team Snapshot", color: "violet", list: roleFiltered.purple_team },
                      { key: "yellow", label: "Yellow Team Snapshot", color: "gold", list: roleFiltered.yellow_team },
                    ]
                      .filter(t => t.list && t.list.length > 0)
                      .map(t => (
                        <Grid item xs={12} md={6} key={t.key}>
                          <TeamPanel
                            title={t.label}
                            color={t.color}
                            players={t.list}
                            scenarioId={data?.active_scenario_id}
                            onOpenConsole={onOpenConsole}
                            isMilestone={isMilestone}
                            startTime={startTime}
                          />
                        </Grid>
                    ))}
                  </Grid>
                </TabPanel>

                {/* CISO Executive View */}
                <TabPanel value="3" sx={{ px: 0, pt: 2.5 }}>
                  <Stack gap={2.2}>
                    {/* KPI strip */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <ExecKpiCard
                          title="Participants"
                          value={executiveMetrics.totalPlayers}
                          sub={
                            roleVal === "ALL"
                              ? groupVal === "ALL"
                                ? "Across all team groups"
                                : `Within ${groupVal}`
                              : `${roleVal} role only`
                          }                          chip="LIVE"
                          accent="#6ee7ff"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <ExecKpiCard
                          title="Overall Score"
                          value={`${executiveMetrics.scorePct}%`}
                          sub={`${executiveMetrics.totalObtained}/${executiveMetrics.totalScore} points`}
                          chip="Outcome"
                          accent="#6ee7ff"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <ExecKpiCard
                          title="Milestone Progress"
                          value={isMilestone ? `${executiveMetrics.milestonePct}%` : "—"}
                          sub={isMilestone ? `${executiveMetrics.totalApproved}/${executiveMetrics.totalMilestones} approved` : "Flag-based exercise"}
                          chip="Execution"
                          accent="#a78bfa"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <ExecKpiCard
                          title="Hint Dependency"
                          value={isMilestone ? `${executiveMetrics.hintPct}%` : "—"}
                          sub={isMilestone ? `${executiveMetrics.hintsUsed}/${executiveMetrics.totalHints} hints used` : "Flag-based exercise"}
                          chip="Capability"
                          accent="#f472b6"
                        />
                      </Grid>
                    </Grid>

                    {/* Time KPIs */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Glass sx={{ p: 2.25 }}>
                          <Typography sx={{ color: TXT, fontWeight: 900, mb: 0.5 }}>
                            Incident Timeline KPIs
                          </Typography>
                          <Typography sx={{ color: TXT_MUTED, fontSize: 12, mb: 1.5 }}>
                            Derived from achieved_at / approved_at timestamps (gap assessment ready)
                          </Typography>

                          <Divider sx={{ borderColor: BORDER, mb: 1.5 }} />

                          <Stack direction="row" justifyContent="space-between" sx={{ py: 0.8 }}>
                            <Typography sx={{ color: TXT_MUTED }}>Start Time</Typography>
                            <Typography sx={{ color: TXT, fontWeight: 800 }}>{isoToLocal(startTime)}</Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" sx={{ py: 0.8 }}>
                            <Typography sx={{ color: TXT_MUTED }}>MTTD (first achieved)</Typography>
                            <Typography sx={{ color: "#6ee7ff", fontWeight: 900 }}>
                              {executiveMetrics.mttd === null ? "—" : `${executiveMetrics.mttd} min`}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" sx={{ py: 0.8 }}>
                            <Typography sx={{ color: TXT_MUTED }}>Governance Review Lag</Typography>
                            <Typography sx={{ color: "#a78bfa", fontWeight: 900 }}>
                              {executiveMetrics.execLag === null ? "—" : `${executiveMetrics.execLag} min`}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" sx={{ py: 0.8 }}>
                            <Typography sx={{ color: TXT_MUTED }}>Scenario Type</Typography>
                            <Typography sx={{ color: TXT, fontWeight: 800 }}>{scenarioTypeLabel}</Typography>
                          </Stack>
                        </Glass>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Glass sx={{ p: 2.25 }}>
                          <Typography sx={{ color: TXT, fontWeight: 900, mb: 0.5 }}>
                            Executive Summary View
                          </Typography>
                          <Typography sx={{ color: TXT_MUTED, fontSize: 12, mb: 1.5 }}>
                            Use this tab for leadership briefings — high-signal, minimal noise.
                          </Typography>

                          <Divider sx={{ borderColor: BORDER, mb: 1.5 }} />

                          <Stack gap={1}>
                            <Typography sx={{ color: TXT_MUTED, fontSize: 12 }}>
                              • Compare Team Groups using the selector above (All Teams / Team A / Team B).
                            </Typography>
                            <Typography sx={{ color: TXT_MUTED, fontSize: 12 }}>
                              • MTTD reflects time-to-first-achievement from scenario start_time.
                            </Typography>
                            <Typography sx={{ color: TXT_MUTED, fontSize: 12 }}>
                              • Review Lag reflects governance speed (achieved_at → approved_at).
                            </Typography>
                            <Typography sx={{ color: TXT_MUTED, fontSize: 12 }}>
                              • Outcome and Capability KPIs feed your post-exercise gap assessment report.
                            </Typography>
                          </Stack>

                          <Divider sx={{ borderColor: BORDER, my: 1.5 }} />

                          <Stack direction="row" gap={1} flexWrap="wrap">
                            <Chip
                              label="Board-ready"
                              size="small"
                              sx={{ bgcolor: "rgba(34,197,94,0.10)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.18)", fontWeight: 900 }}
                            />
                            <Chip
                              label="SLA KPIs"
                              size="small"
                              sx={{ bgcolor: "rgba(110,231,255,0.08)", color: "#6ee7ff", border: "1px solid rgba(110,231,255,0.18)", fontWeight: 900 }}
                            />
                            <Chip
                              label="Gap Assessment"
                              size="small"
                              sx={{ bgcolor: "rgba(167,139,250,0.08)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.18)", fontWeight: 900 }}
                            />
                          </Stack>
                        </Glass>
                      </Grid>
                    </Grid>

                    {/* Executive leaderboard section */}
                    <Glass sx={{ p: 2.25 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack>
                          <Typography sx={{ color: TXT, fontWeight: 900 }}>
                            Executive Leaderboard (Live)
                          </Typography>
                          <Typography sx={{ color: TXT_MUTED, fontSize: 12 }}>
                            High-level ranking view for leadership; drill-down via console per player.
                          </Typography>
                        </Stack>
                        <Chip
                          label={groupVal === "ALL" ? "All Teams" : groupVal}
                          size="small"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.06)",
                            color: TXT_MUTED,
                            border: "1px solid rgba(255,255,255,0.08)",
                            fontWeight: 900,
                          }}
                        />
                      </Stack>

                      <Divider sx={{ borderColor: BORDER, my: 1.5 }} />

                      {/* Reuse existing LiveScore (you can later extend it to accept a team_group filter) */}
                      <LiveScore
                        group={data?.active_scenario_id}
                        gameType={scenarioTypeLabel !== "Milestone based" ? scenarioTypeLabel : null}
                        scenarioId={data?.active_scenario_id}
                      />
                    </Glass>
                  </Stack>
                </TabPanel>
              </TabContext>
            </Box>
          </Glass>
        </Stack>
      )}
    </Stack>
  );
};

export default WhitePlayer;
