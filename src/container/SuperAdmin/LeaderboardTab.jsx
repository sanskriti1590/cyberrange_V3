import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Chip,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip as MuiTooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TimelineIcon from "@mui/icons-material/Timeline";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { getSuperAdminLeaderboard } from "../../APIConfig/SuperAdminConfig";

/* =========================
   Theme helpers (no hard-coded MUI theme needed)
========================= */

const ROLE_COLORS = {
  RED: "#ef4444",
  BLUE: "#3b82f6",
  YELLOW: "#facc15",
  PURPLE: "#a855f7",
};

const TEAM_COLORS = [
  "#22d3ee",
  "#34d399",
  "#60a5fa",
  "#f59e0b",
  "#a78bfa",
  "#fb7185",
];


const glassCard = (borderColor = "rgba(34,211,238,0.20)") => ({
  p: 3,
  borderRadius: 4,
  background:
    "linear-gradient(180deg, rgba(2,6,23,0.92), rgba(15,23,42,0.65))",
  border: `1px solid ${borderColor}`,
  boxShadow: "0 0 18px rgba(0,0,0,0.45)",
});

const sectionTitle = (color = "#22d3ee") => ({
  color,
  fontWeight: 900,
  letterSpacing: 0.3,
});

const muted = { color: "#94a3b8" };
const bright = { color: "#e5e7eb" };

const fmtTS = (ts) => {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return String(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    const ms = String(d.getMilliseconds()).padStart(3, "0");
    return `${hh}:${mm}:${ss}.${ms}`;
  } catch {
    return String(ts);
  }
};

const safeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const formatDuration = (ms) => {
 if (!ms) return "—";
 const minutes = Math.floor(ms / 60000);
 const seconds = Math.floor((ms % 60000) / 1000);
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
 };

const badgeChipSx = (color) => ({
  height: 22,
  fontSize: 11,
  fontWeight: 800,
  borderRadius: 999,
  color,
  border: `1px solid ${color}`,
  backgroundColor: `${color}1a`,
  "& .MuiChip-label": { px: 1.2 },
});

const smallHeadCell = {
  ...muted,
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

const rowCell = {
  color: "#e5e7eb",
  fontSize: 12.5,
  borderColor: "rgba(148,163,184,0.10)",
};

const clickableRow = {
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(34,211,238,0.06)",
  },
};

const normalizeBreakdown = (items, scenarioType) => {
  return (items || []).map((it) => {
    if (scenarioType === "FLAG") {
      return {
        type: "FLAG",
        item_id: it.flag_id,
        name: it.flag_name,
        description: "",
        score: it.obtained_score || 0,
        penalty: 0,
        bonus_delta: 0,
        retries: it.retries || it.retires || 0,
        hint_used: it.hint_used || false,
        submitted_at: it.submitted_at,
        approved_at: it.approved_at,
        evidence: [],
      };
    }

    // MILESTONE
    return {
      type: "MILESTONE",
      item_id: it.milestone_id,
      name: it.milestone_name,
      description: it.milestone_description || "",
      score: it.obtained_score || 0,
      penalty: 0,
      bonus_delta: 0,
      retries: 0,
      hint_used: it.hint_used || false,
      submitted_at: it.submitted_at,
      approved_at: it.approved_at,
      evidence: it.evidence_files || [],
    };
  });
};

/* =========================
   Heatmap component (Teams/Roles vs Phases)
========================= */
function Heatmap({ matrix, xLabels, yLabels, title, subtitle }) {
  // matrix[y][x] -> 0..100
  const colorFor = (v) => {
    const val = Math.max(0, Math.min(100, safeNum(v)));
    // cyan intensity
    const a = 0.08 + (val / 100) * 0.42;
    return `rgba(34,211,238,${a})`;
  };

  return (
    <Card sx={glassCard("rgba(34,211,238,0.25)")}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack spacing={0.3}>
          <Typography sx={sectionTitle("#22d3ee")}>{title}</Typography>
          {subtitle ? (
            <Typography sx={{ ...muted, fontSize: 12 }}>{subtitle}</Typography>
          ) : null}
        </Stack>
        <TimelineIcon sx={{ color: "#22d3ee" }} />
      </Stack>

      <Box sx={{ mt: 2, overflowX: "auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `180px repeat(${xLabels.length}, 70px)`,
            gap: 0.8,
            minWidth: 180 + xLabels.length * 70,
          }}
        >
          {/* header row */}
          <Box />
          {xLabels.map((x) => (
            <Box key={x} sx={{ textAlign: "center", ...muted, fontSize: 11 }}>
              {x}
            </Box>
          ))}

          {/* rows */}
          {yLabels.map((y, yi) => (
            <React.Fragment key={y}>
              <Box sx={{ ...bright, fontSize: 12, fontWeight: 800 }}>{y}</Box>
              {xLabels.map((x, xi) => (
                <MuiTooltip
                  key={`${y}-${x}`}
                  title={`${y} × ${x}: ${Math.round(
                    safeNum(matrix?.[yi]?.[xi])
                  )}%`}
                >
                  <Box
                    sx={{
                      height: 34,
                      borderRadius: 1.6,
                      border: "1px solid rgba(148,163,184,0.12)",
                      background: colorFor(matrix?.[yi]?.[xi]),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#e5e7eb",
                      fontSize: 11,
                      fontWeight: 900,
                    }}
                  >
                    {Math.round(safeNum(matrix?.[yi]?.[xi]))}
                  </Box>
                </MuiTooltip>
              ))}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Card>
  );
}

/* =========================
   Main
========================= */

export default function LeaderboardTab({ activeScenarioId }) {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [heatMode, setHeatMode] = useState("TEAM")

  const fetchData = useCallback(async () => {
    if (!activeScenarioId) return;
    const res = await getSuperAdminLeaderboard(activeScenarioId);
    setData(res.data);
  }, [activeScenarioId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

 const playersAll = useMemo(() => {
  if (!data?.players) return [];

  return data.players.map((p) => ({
    ...p,
    team_group: p.team_group || "NO_GROUP",
    role: p.role || "UNKNOWN",
    breakdown: Array.isArray(p.breakdown) ? p.breakdown : [],
  }));
}, [data]);

    const rolesPresent = useMemo(() => {
    return [
        ...new Set(
        playersAll
            .map((p) => p.role)
            .filter((r) => r && r !== "UNKNOWN")
        ),
    ];
    }, [playersAll]);
  const teamsPresent = useMemo(() => data?.teams_present || [], [data]);

  // Right-side filter chips: ALL + each team_group
  const filterTeams = useMemo(() => {
    const unique = [...new Set(playersAll.map((p) => p.team_group).filter(Boolean))];
    unique.sort((a, b) => String(a).localeCompare(String(b)));
    return ["ALL", ...unique];
  }, [playersAll]);

  const players = useMemo(() => {
    if (teamFilter === "ALL") return playersAll;
    return playersAll.filter((p) => String(p.team_group) === String(teamFilter));
  }, [playersAll, teamFilter]);

  // -------------------------
  // OVERALL TOP 5
  // -------------------------
  const overallTop5 = useMemo(() => {
    // backend may provide top5; we still slice from filtered players for correctness
    return players.slice(0, 5);
  }, [players]);

  // -------------------------
  // TOP 3 TEAMS (ranked)
  // expects data.team_comparison: [{team, score, avg_time}]
  // if avg_time missing, compute from players in that team
  // -------------------------
  const teamAgg = useMemo(() => {
    const map = new Map();
    for (const p of playersAll) {
      const t = p.team_group || "NO_TEAM";
      const cur = map.get(t) || {
        team: t,
        score: 0,
        players: 0,
        avgTimeMinsSum: 0,
        avgTimeCount: 0,
      };
      cur.score += safeNum(p.score, 0);
      cur.players += 1;

      // avg_time expected as "12m" etc. Attempt parse.
      const s = String(p.avg_time || "").trim();
      const mins = s.endsWith("m") ? parseInt(s.replace("m", ""), 10) : NaN;
      if (Number.isFinite(mins)) {
        cur.avgTimeMinsSum += mins;
        cur.avgTimeCount += 1;
      }
      map.set(t, cur);
    }

    const arr = [...map.values()].map((x) => ({
      team: x.team,
      score: x.score,
      avg_time:
        x.avgTimeCount > 0
          ? `${Math.round(x.avgTimeMinsSum / x.avgTimeCount)}m`
          : "—",
      players: x.players,
    }));

    arr.sort((a, b) => b.score - a.score);
    return arr;
  }, [playersAll]);

  const top3Teams = useMemo(() => teamAgg.slice(0, 3), [teamAgg]);

  // -------------------------
  // TEAM COMPARISON GRAPH
  // (rank + colored bars)
  // -------------------------
  const teamChart = useMemo(() => {
    return teamAgg.map((t, idx) => ({
      rank: idx + 1,
      team: t.team,
      score: t.score,
    }));
  }, [teamAgg]);
    
const teamColorByName = (name) => {
    const index = teamAgg.findIndex((x) => x.team === name);
    return TEAM_COLORS[index % TEAM_COLORS.length];
    };
  // -------------------------
  // ROLE TOP (bar + top3 table)
  // expects backend role_top[r] = top 5/10 players for that role
  // if not present, compute.
  // -------------------------
  const roleTop = useMemo(() => {
    const out = {};
    if (data?.role_top) return data.role_top;
    for (const r of rolesPresent) {
      out[r] = players.filter((p) => p.role === r).slice(0, 5);
    }
    return out;
  }, [data, rolesPresent, players]);

  // -------------------------
  // COMPLETE LEADERBOARD (table)
  // Columns required by you
  // -------------------------
  const completeLeaderboard = useMemo(() => {
    return players.map((p, i) => ({
      rank: i + 1,
      ...p,
      flags_completed: safeNum(p.flags_completed, 0),
      total_flags: safeNum(p.total_flags, 0),
      completion: safeNum(p.completion, 0),
    }));
  }, [players]);

  // -------------------------
  // HEATMAP
  // Use phases list from backend if provided.
  // We create 2 heatmaps:
  // A) Teams × Phases
  // B) Roles × Phases
  //
  // Backend best format:
  // data.phases = [{phase_id, phase_name}]
  // data.heatmap = { teams: { [team]: { [phase_id]: completionPct } }, roles: { [role]: { [phase_id]: completionPct } } }
  //
  // If missing, we compute roughly from breakdown: count score>0 per phase / total items in that phase.
  // -------------------------
  const phases = useMemo(() => {
    const fromApi = data?.phases || [];
    if (fromApi.length) return fromApi;

    // compute from breakdown
    const map = new Map();
    for (const p of playersAll) {
      for (const b of p.breakdown || []) {
        const pid = b.phase_id || b.phase || "PHASE";
        const pname = b.phase_name || b.phase || pid;
        if (!map.has(pid)) map.set(pid, { phase_id: pid, phase_name: pname });
      }
    }
    return [...map.values()];
  }, [data, playersAll]);

  const phaseLabels = useMemo(
    () => phases.map((x) => x.phase_name || x.phase_id),
    [phases]
  );

  const teamLabels = useMemo(() => {
    const unique = [...new Set(playersAll.map((p) => p.team_group || "NO_TEAM"))];
    unique.sort((a, b) => String(a).localeCompare(String(b)));
    return unique;
  }, [playersAll]);

  const roleLabels = useMemo(() => {
    const unique = [...new Set(playersAll.map((p) => p.role || "UNKNOWN"))];
    unique.sort((a, b) => String(a).localeCompare(String(b)));
    return unique;
  }, [playersAll]);

  const computeHeat = useCallback(
    (groupKey) => {
      // groupKey: "team" or "role"
      // returns {labels, matrix}
      const groups = groupKey === "team" ? teamLabels : roleLabels;
      const matrix = groups.map(() => phases.map(() => 0));

      // build counters
      const counters = new Map(); // group|phase -> {done,total}
      const key = (g, pid) => `${g}||${pid}`;

      for (const p of playersAll) {
        const g = (groupKey === "team" ? p.team_group : p.role) || "UNKNOWN";
        const items = p.breakdown || [];
        for (const it of items) {
          const pid = it.phase_id || it.phase || "PHASE";
          const k = key(g, pid);
          const cur = counters.get(k) || { done: 0, total: 0 };
          cur.total += 1;
          if (safeNum(it.score, 0) > 0) cur.done += 1;
          counters.set(k, cur);
        }
      }

      groups.forEach((g, gi) => {
        phases.forEach((ph, pi) => {
          const pid = ph.phase_id;
          const cur = counters.get(key(g, pid));
          const pct = cur && cur.total ? (cur.done / cur.total) * 100 : 0;
          matrix[gi][pi] = Math.round(pct);
        });
      });

      return { groups, matrix };
    },
    [playersAll, phases, teamLabels, roleLabels]
  );

  const heatTeams = useMemo(() => computeHeat("team"), [computeHeat]);
  const heatRoles = useMemo(() => computeHeat("role"), [computeHeat]);

  /* =========================
     Drawer: Player details
  ========================= */

const selectedBreakdownByPhase = useMemo(() => {
  if (!selected?.breakdown || !Array.isArray(selected.breakdown)) {
    return [];
  }

  const grouped = {};

  selected.breakdown.forEach((item) => {
    const phaseId = item.phase_id || "NO_PHASE";

    // get phase name from global phase list
    const phaseObj = data?.phases?.find(p => p.phase_id === phaseId);

    if (!grouped[phaseId]) {
      grouped[phaseId] = {
        phase_id: phaseId,
        phase_name: phaseObj?.phase_name || phaseId,
        items: [],
      };
    }

    grouped[phaseId].items.push(item);
  });

  return Object.values(grouped);
}, [selected, data]);

  /* =========================
     Render
  ========================= */

  if (!data) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 6 },
        py: 5,
        background: "#020617",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)",
        backgroundSize: "42px 42px",
      }}
    >
      {/* =========================
          TOP ROW: OVERALL TOP 5 + TOP 3 TEAMS
      ========================= */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={glassCard("rgba(34,211,238,0.35)")}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack spacing={0.4}>
                <Typography sx={sectionTitle("#22d3ee")}>
                  Overall Top 5 Performers
                </Typography>
                <Typography sx={{ ...muted, fontSize: 12 }}>
                  Sorted by score; time-priority (ms) can be added when backend provides last_submit_ms
                </Typography>
              </Stack>
              <EmojiEventsIcon sx={{ color: "#22d3ee" }} />
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(148,163,184,0.12)" }} />

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={smallHeadCell}>Rank</TableCell>
                  <TableCell sx={smallHeadCell}>Player</TableCell>
                  <TableCell sx={smallHeadCell}>Team</TableCell>
                  <TableCell sx={smallHeadCell}>Role</TableCell>
                  <TableCell sx={smallHeadCell}>Points</TableCell>
                  <TableCell sx={smallHeadCell}>Avg Response</TableCell>
                  <TableCell sx={smallHeadCell}>Last Submit</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {overallTop5.map((p, idx) => (
                  <TableRow
                    key={p.participant_id || p.user_id || idx}
                    sx={clickableRow}
                    onClick={() => setSelected(p)}
                  >
                    <TableCell sx={{ ...rowCell, color: "#22d3ee", fontWeight: 900 }}>
                      #{idx + 1}
                    </TableCell>
                    <TableCell sx={{ ...rowCell, fontWeight: 800 }}>{p.name}</TableCell>
                    <TableCell sx={rowCell}>{p.team_group}</TableCell>
                    <TableCell sx={rowCell}>
                      <Chip
                        label={p.role || "UNKNOWN"}
                        size="small"
                        sx={badgeChipSx(ROLE_COLORS[p.role] || "#94a3b8")}
                      />
                    </TableCell>
                    <TableCell sx={{ ...rowCell, color: "#22c55e", fontWeight: 900 }}>
                      {safeNum(p.score, 0)}
                    </TableCell>
                    <TableCell sx={rowCell}>
                    {p.avg_response_time_ms
                        ? formatDuration(p.avg_response_time_ms)
                        : "—"}
                    </TableCell>
                    <TableCell sx={{ ...rowCell, ...muted }}>
                      {p.last_submit ? fmtTS(p.last_submit) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={glassCard("rgba(52,211,153,0.35)")}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack spacing={0.4}>
                <Typography sx={sectionTitle("#34d399")}>
                  Top 3 Teams
                </Typography>
                <Typography sx={{ ...muted, fontSize: 12 }}>
                  Aggregated score + avg response
                </Typography>
              </Stack>
              <GroupsIcon sx={{ color: "#34d399" }} />
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(148,163,184,0.12)" }} />

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={smallHeadCell}>Rank</TableCell>
                  <TableCell sx={smallHeadCell}>Team</TableCell>
                  <TableCell sx={smallHeadCell}>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {top3Teams.map((t, i) => (
                  <TableRow key={t.team || i}>
                    <TableCell sx={{ ...rowCell, color: "#34d399", fontWeight: 900 }}>
                      #{i + 1}
                    </TableCell>
                    <TableCell sx={{ ...rowCell, fontWeight: 800 }}>{t.team}</TableCell>
                    <TableCell sx={{ ...rowCell, color: "#22c55e", fontWeight: 900 }}>
                      {safeNum(t.score, 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>

      {/* =========================
          TEAM COMPARISON GRAPH + TEAM RANKS
      ========================= */}
      <Card sx={{ ...glassCard("rgba(34,211,238,0.25)"), mb: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={0.4}>
            <Typography sx={sectionTitle("#22d3ee")}>Team Comparison</Typography>
            <Typography sx={{ ...muted, fontSize: 12 }}>
              Ranked aggregated scores (with visual color mapping)
            </Typography>
          </Stack>
          <FactCheckIcon sx={{ color: "#22d3ee" }} />
        </Stack>

        <Divider sx={{ my: 2, borderColor: "rgba(148,163,184,0.12)" }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={teamChart}>
                <XAxis dataKey="team" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {teamChart.map((entry, idx) => (
                    <Cell key={idx} fill={teamColorByName(entry.team)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 2,
                borderRadius: 3,
                height: "100%",
                background: "rgba(2,6,23,0.65)",
                border: "1px solid rgba(148,163,184,0.14)",
              }}
            >
              <Typography sx={{ ...muted, fontWeight: 900, fontSize: 12, mb: 1 }}>
                Team Ranks
              </Typography>

              <Stack spacing={1}>
                {teamAgg.slice(0, 6).map((t, idx) => (
                  <Stack
                    key={t.team || idx}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      border: "1px solid rgba(148,163,184,0.10)",
                      background: "rgba(15,23,42,0.35)",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: teamColorByName(t.team),
                          boxShadow: `0 0 10px ${teamColorByName(t.team)}66`,
                        }}
                      />
                      <Typography sx={{ ...bright, fontWeight: 900 }}>
                        #{idx + 1} {t.team}
                      </Typography>
                    </Stack>

                    <Typography sx={{ color: "#22c55e", fontWeight: 900 }}>
                      {safeNum(t.score, 0)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Card>

      {/* =========================
          PHASE HEATMAPS
      ========================= */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
            <Card sx={glassCard("rgba(34,211,238,0.30)")}>
            
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2 }}
            >
                <Stack>
                <Typography sx={sectionTitle("#22d3ee")}>
                    Phase Heatmap
                </Typography>
                <Typography sx={{ ...muted, fontSize: 12 }}>
                    Completion % (score &gt; 0)
                </Typography>
                </Stack>

                {/* Toggle */}
                <Stack direction="row" spacing={1}>
                <Chip
                    label="Teams × Phases"
                    onClick={() => setHeatMode("TEAM")}
                    sx={{
                    cursor: "pointer",
                    fontWeight: 800,
                    borderRadius: 999,
                    background:
                        heatMode === "TEAM"
                        ? "rgba(34,211,238,0.18)"
                        : "rgba(15,23,42,0.5)",
                    border:
                        heatMode === "TEAM"
                        ? "1px solid #22d3ee"
                        : "1px solid rgba(148,163,184,0.20)",
                    color: heatMode === "TEAM" ? "#22d3ee" : "#94a3b8",
                    }}
                />
                <Chip
                    label="Roles × Phases"
                    onClick={() => setHeatMode("ROLE")}
                    sx={{
                    cursor: "pointer",
                    fontWeight: 800,
                    borderRadius: 999,
                    background:
                        heatMode === "ROLE"
                        ? "rgba(34,211,238,0.18)"
                        : "rgba(15,23,42,0.5)",
                    border:
                        heatMode === "ROLE"
                        ? "1px solid #22d3ee"
                        : "1px solid rgba(148,163,184,0.20)",
                    color: heatMode === "ROLE" ? "#22d3ee" : "#94a3b8",
                    }}
                />
                </Stack>
            </Stack>

            {/* Heatmap */}
            <Heatmap
                title={
                heatMode === "TEAM"
                    ? "Teams × Phases"
                    : "Roles × Phases"
                }
                xLabels={phaseLabels}
                yLabels={
                heatMode === "TEAM"
                    ? teamLabels
                    : roleLabels
                }
                matrix={
                heatMode === "TEAM"
                    ? heatTeams.matrix
                    : heatRoles.matrix
                }
            />
            </Card>
        </Grid>
        </Grid>

        {/* =========================
            ROLE PANELS (Cross-Team Ranking)
        ========================= */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
        {rolesPresent.map((role) => {
            const color = ROLE_COLORS[role] || "#94a3b8";

            const rolePlayers = playersAll
            .filter((p) => p.role === role)
            .sort((a, b) => safeNum(b.score) - safeNum(a.score))
            .slice(0, 5);

            if (!rolePlayers.length) return null;

            const chartData = rolePlayers.map((p) => ({
            name: p.name,
            score: safeNum(p.score, 0),
            }));

            return (
            <Grid item xs={12} md={6} key={role}>
                <Card
                sx={{
                    ...glassCard(`${color}22`),
                    border: `1px solid ${color}`,
                    boxShadow: `0 0 22px ${color}40`,
                }}
                >
                {/* HEADER */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Typography
                    sx={{
                        color,
                        fontWeight: 900,
                        fontSize: 15,
                        letterSpacing: 0.6,
                    }}
                    >
                    {role} Role — Top Performers
                    </Typography>

                    <Chip
                    size="small"
                    label={`${rolePlayers.length} Players`}
                    sx={badgeChipSx(color)}
                    />
                </Stack>

                {/* BAR CHART */}
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ left: 10, right: 20 }}
                    >
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#94a3b8"
                        width={110}
                    />
                    <Tooltip />
                    <Bar
                        dataKey="score"
                        fill={color}
                        radius={[10, 10, 10, 10]}
                    />
                    </BarChart>
                </ResponsiveContainer>

                <Divider
                    sx={{
                    my: 2,
                    borderColor: "rgba(148,163,184,0.12)",
                    }}
                />

                {/* TABLE */}
                <Table size="small">
                    <TableHead>
                    <TableRow>
                        <TableCell sx={smallHeadCell}>Rank</TableCell>
                        <TableCell sx={smallHeadCell}>Player</TableCell>
                        <TableCell sx={smallHeadCell}>Team</TableCell>
                        <TableCell sx={smallHeadCell}>Score</TableCell>
                    </TableRow>
                    </TableHead>

                    <TableBody>
                    {rolePlayers.map((p, idx) => (
                        <TableRow
                        key={p.participant_id || idx}
                        sx={clickableRow}
                        onClick={() => setSelected(p)}
                        >
                        <TableCell sx={{ ...rowCell, color }}>
                            #{idx + 1}
                        </TableCell>

                        <TableCell
                            sx={{
                            ...rowCell,
                            fontWeight: 900,
                            }}
                        >
                            {p.name}
                        </TableCell>

                        <TableCell sx={rowCell}>
                            <Chip
                            size="small"
                            label={p.team_group}
                            sx={{
                                height: 22,
                                fontSize: 11,
                                fontWeight: 800,
                                borderRadius: 999,
                                color: "#e5e7eb",
                                border: "1px solid rgba(148,163,184,0.25)",
                                backgroundColor: "rgba(148,163,184,0.08)",
                            }}
                            />
                        </TableCell>

                        <TableCell
                            sx={{
                            ...rowCell,
                            color,
                            fontWeight: 900,
                            }}
                        >
                            {safeNum(p.score, 0)}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </Card>
            </Grid>
            );
        })}
        </Grid>
      {/* =========================
          COMPLETE LEADERBOARD + TEAM FILTER (RIGHT)
      ========================= */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Card sx={glassCard("rgba(34,211,238,0.22)")}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Stack spacing={0.4}>
                <Typography sx={sectionTitle("#e5e7eb")}>Complete Leaderboard</Typography>
                <Typography sx={{ ...muted, fontSize: 12 }}>
                  Rank wise players (click any row for detailed submissions)
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "#94a3b8" }}>
                <AccessTimeIcon fontSize="small" />
                <Typography sx={{ ...muted, fontSize: 12 }}>
                  Time-priority sorting supported when backend sends ms timestamps
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(148,163,184,0.12)" }} />

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={smallHeadCell}>Rank</TableCell>
                  <TableCell sx={smallHeadCell}>Name</TableCell>
                  <TableCell sx={smallHeadCell}>Role</TableCell>
                  <TableCell sx={smallHeadCell}>Team Group</TableCell>
                  <TableCell sx={smallHeadCell}>Score</TableCell>
                  <TableCell sx={smallHeadCell}>Flags</TableCell>
                  <TableCell sx={smallHeadCell}>Completion</TableCell>
                  <TableCell sx={smallHeadCell}>Avg Time</TableCell>
                  <TableCell sx={smallHeadCell}>Last Submit</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {completeLeaderboard.map((p) => (
                  <TableRow
                    key={p.participant_id || p.user_id || p.rank}
                    sx={clickableRow}
                    onClick={() => setSelected(p)}
                  >
                    <TableCell sx={{ ...rowCell, color: "#22d3ee", fontWeight: 900 }}>
                      #{p.rank}
                    </TableCell>
                    <TableCell sx={{ ...rowCell, fontWeight: 900 }}>{p.name}</TableCell>
                    <TableCell sx={rowCell}>
                      <Chip
                        label={p.role || "UNKNOWN"}
                        size="small"
                        sx={badgeChipSx(ROLE_COLORS[p.role] || "#94a3b8")}
                      />
                    </TableCell>
                    <TableCell sx={rowCell}>{p.team_group}</TableCell>
                    <TableCell sx={{ ...rowCell, color: "#22c55e", fontWeight: 900 }}>
                      {safeNum(p.score, 0)}
                    </TableCell>
                    <TableCell sx={rowCell}>
                    {safeNum(p.items_completed, 0)}/{safeNum(p.total_items, 0)}
                    </TableCell>
                    <TableCell sx={rowCell}>{safeNum(p.completion, 0)}%</TableCell>
                    <TableCell sx={rowCell}>
                    {formatDuration(p.avg_response_time_ms)}
                    </TableCell>
                    <TableCell sx={{ ...rowCell, ...muted }}>
                      {p.last_submit ? fmtTS(p.last_submit) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Card sx={glassCard("rgba(148,163,184,0.18)")}>
            <Typography sx={{ ...sectionTitle("#94a3b8"), fontSize: 13, mb: 1 }}>
              Filter Teams
            </Typography>
            <Typography sx={{ ...muted, fontSize: 12, mb: 2 }}>
              Choose a team group
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={1.2}>
              {filterTeams.map((t) => {
                const active = teamFilter === t;
                return (
                  <Chip
                    key={t}
                    label={t}
                    onClick={() => setTeamFilter(t)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: 900,
                      borderRadius: 999,
                      border: active
                        ? "1px solid #22d3ee"
                        : "1px solid rgba(148,163,184,0.16)",
                      background: active
                        ? "rgba(34,211,238,0.16)"
                        : "rgba(15,23,42,0.35)",
                      color: active ? "#22d3ee" : "#e5e7eb",
                      "&:hover": {
                        background: active
                          ? "rgba(34,211,238,0.20)"
                          : "rgba(148,163,184,0.10)",
                      },
                    }}
                  />
                );
              })}
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(148,163,184,0.12)" }} />

            <Stack spacing={1.2}>
              <Typography sx={{ ...muted, fontWeight: 900, fontSize: 12 }}>
                Live Roles
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {(rolesPresent || []).map((r) => (
                  <Chip
                    key={r}
                    size="small"
                    label={r}
                    sx={badgeChipSx(ROLE_COLORS[r] || "#94a3b8")}
                  />
                ))}
              </Stack>

              <Typography sx={{ ...muted, fontWeight: 900, fontSize: 12, mt: 2 }}>
                Live Teams
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {(teamsPresent || []).map((t) => (
                  <Chip
                    key={t}
                    size="small"
                    label={t}
                    sx={{
                      height: 22,
                      fontSize: 11,
                      fontWeight: 900,
                      borderRadius: 999,
                      color: "#e5e7eb",
                      border: "1px solid rgba(148,163,184,0.20)",
                      backgroundColor: "rgba(148,163,184,0.08)",
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* =========================
          PLAYER DETAILS DRAWER
      ========================= */}
      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)}>
        <Box sx={{ width: { xs: 360, md: 540 }, height: "100%", background: "#020617" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid rgba(148,163,184,0.14)" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack spacing={0.3}>
                <Typography sx={{ ...sectionTitle("#22d3ee"), fontSize: 16 }}>
                  Player Breakdown
                </Typography>
                <Typography sx={{ ...bright, fontWeight: 900 }}>
                  {selected?.name || "—"}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Chip
                    size="small"
                    label={selected?.role || "UNKNOWN"}
                    sx={badgeChipSx(ROLE_COLORS[selected?.role] || "#94a3b8")}
                  />
                  <Chip
                    size="small"
                    label={selected?.team_group || "NO_TEAM"}
                    sx={{
                      height: 22,
                      fontSize: 11,
                      fontWeight: 900,
                      borderRadius: 999,
                      color: "#e5e7eb",
                      border: "1px solid rgba(34,211,238,0.22)",
                      backgroundColor: "rgba(34,211,238,0.08)",
                    }}
                  />
                  <Chip
                    size="small"
                    icon={<WarningAmberIcon style={{ color: "#f59e0b" }} />}
                    label={`Bonus: ${safeNum(selected?.bonus, 0)}`}
                    sx={{
                      height: 22,
                      fontSize: 11,
                      fontWeight: 900,
                      borderRadius: 999,
                      color: "#f59e0b",
                      border: "1px solid rgba(245,158,11,0.35)",
                      backgroundColor: "rgba(245,158,11,0.10)",
                    }}
                  />
                </Stack>
              </Stack>

              <IconButton onClick={() => setSelected(null)} sx={{ color: "#94a3b8" }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ p: 3, overflowY: "auto", height: "calc(100% - 92px)" }}>
            {(selectedBreakdownByPhase || []).length === 0 ? (
              <Typography sx={{ ...muted }}>
                No submission details found for this player.
              </Typography>
            ) : (
              <Stack spacing={2.2}>
                {selectedBreakdownByPhase.map((ph) => (
                  <Card
                    key={ph.phase_id}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "rgba(15,23,42,0.45)",
                      border: "1px solid rgba(148,163,184,0.14)",
                    }}
                  >
                    <Typography sx={{ ...bright, fontWeight: 900, mb: 1 }}>
                      {ph.phase_name}
                    </Typography>

                    <Stack spacing={1.5}>
                      {ph.items.map((it, idx) => {
                        const isFlag = String(it.type).toUpperCase() === "FLAG";
                        const labelColor = isFlag ? "#22d3ee" : "#a78bfa";

                        const penalty = safeNum(it.penalty, 0);
                        const bonusDelta = safeNum(it.bonus_delta, 0);

                        return (
                          <Box
                            key={`${it.item_id || it.name || idx}`}
                            sx={{
                              p: 1.6,
                              borderRadius: 2.5,
                              border: "1px solid rgba(148,163,184,0.12)",
                              background: "rgba(2,6,23,0.55)",
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Stack spacing={0.4} sx={{ pr: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Chip
                                    size="small"
                                    label={isFlag ? "FLAG" : "MILESTONE"}
                                    sx={{
                                      height: 20,
                                      fontSize: 10,
                                      fontWeight: 900,
                                      borderRadius: 999,
                                      color: labelColor,
                                      border: `1px solid ${labelColor}`,
                                      backgroundColor: `${labelColor}14`,
                                    }}
                                  />
                                  <Typography sx={{ ...bright, fontWeight: 900 }}>
                                    {it.name || it.flag_name || it.milestone_name || "Unnamed Item"}
                                  </Typography>
                                </Stack>

                                {it.description ? (
                                  <Typography sx={{ ...muted, fontSize: 12, whiteSpace: "pre-wrap" }}>
                                    {it.description}
                                  </Typography>
                                ) : null}
                              </Stack>

                              <Stack spacing={0.4} alignItems="flex-end">
                                <Typography sx={{ color: "#22c55e", fontWeight: 900 }}>
                                  +{safeNum(it.score, 0)} pts
                                </Typography>

                                {penalty > 0 ? (
                                  <Typography sx={{ color: "#ef4444", fontWeight: 900, fontSize: 12 }}>
                                    −{penalty} penalty
                                  </Typography>
                                ) : null}

                                {bonusDelta !== 0 ? (
                                  <Typography sx={{ color: "#f59e0b", fontWeight: 900, fontSize: 12 }}>
                                    {bonusDelta > 0 ? "+" : ""}
                                    {bonusDelta} bonus
                                  </Typography>
                                ) : null}
                              </Stack>
                            </Stack>

                            <Divider sx={{ my: 1.2, borderColor: "rgba(148,163,184,0.10)" }} />

                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Typography sx={{ ...muted, fontSize: 11 }}>
                                  Retries
                                </Typography>
                                <Typography sx={{ ...bright, fontWeight: 900 }}>
                                  {safeNum(it.retries, 0)}
                                </Typography>
                              </Grid>

                              <Grid item xs={6}>
                                <Typography sx={{ ...muted, fontSize: 11 }}>
                                  Hint Used
                                </Typography>
                                <Typography sx={{ ...bright, fontWeight: 900 }}>
                                  {it.hint_used ? "Yes" : "No"}
                                </Typography>
                              </Grid>

                              <Grid item xs={6}>
                                <Typography sx={{ ...muted, fontSize: 11 }}>
                                  Submitted At
                                </Typography>
                                <Typography sx={{ ...bright, fontWeight: 900 }}>
                                  {it.submitted_at ? fmtTS(it.submitted_at) : "—"}
                                </Typography>
                              </Grid>

                              {it.submitted_response || it.submitted_text ? (
                                <Box sx={{ mt: 1 }}>
                                  <Typography sx={{ ...muted, fontSize: 11 }}>
                                    Submission
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#38bdf8",
                                      fontSize: 12,
                                      fontWeight: 700,
                                      whiteSpace: "pre-wrap",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {it.submitted_response || it.submitted_text}
                                  </Typography>
                                </Box>
                              ) : null}
                              {data?.scenario_type === "MILESTONE" && (
                                <Grid item xs={6}>
                                  <Typography sx={{ ...muted, fontSize: 11 }}>
                                    Approved At
                                  </Typography>
                                  <Typography sx={{ ...bright, fontWeight: 900 }}>
                                    {it.approved_at ? fmtTS(it.approved_at) : "—"}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>

                            {/* Evidence */}
                            {Array.isArray(it.evidence) && it.evidence.length > 0 ? (
                              <Box sx={{ mt: 1.2 }}>
                                <Typography sx={{ ...muted, fontSize: 11, mb: 0.6 }}>
                                  Evidences
                                </Typography>
                                <Stack spacing={0.6}>
                                  {it.evidence.map((ev, i2) => {
                                    const url = typeof ev === "string" ? ev : ev?.url;
                                    const name =
                                      typeof ev === "string"
                                        ? `Evidence ${i2 + 1}`
                                        : ev?.name || `Evidence ${i2 + 1}`;
                                    if (!url) return null;
                                    return (
                                      <a
                                        key={i2}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                          color: "#22d3ee",
                                          fontWeight: 800,
                                          fontSize: 12,
                                          textDecoration: "underline",
                                        }}
                                      >
                                        {name}
                                      </a>
                                    );
                                  })}
                                </Stack>
                              </Box>
                            ) : null}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
