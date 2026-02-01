import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactToPrint from "react-to-print";
import { useNavigate, useParams } from "react-router-dom";
import ErrorHandler from "../../ErrorHandler";
import {
  getExecutiveScenarioReport,
  getScenarioEvidenceReport,
} from "../../APIConfig/version2Scenario";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* =========================
   Helpers
========================= */

const readinessColor = (level) => {
  if (level === "Strong") return "success";
  if (level === "Moderate") return "warning";
  return "error";
};


const fmt = (v, d = 2) => {
  if (v === null || v === undefined) return "N/A";
  if (Number.isNaN(Number(v))) return "N/A";
  return Number(v).toFixed(d);
};

const formatDuration = (min) => {
  if (min === null || min === undefined) return "N/A";
  const m = Number(min);
  if (Number.isNaN(m)) return "N/A";
  if (m < 60) return `${fmt(m, 1)} min`;
  if (m < 1440) return `${fmt(m / 60, 1)} hrs`;
  return `${fmt(m / 1440, 1)} days`;
};

const safeArr = (v) => (Array.isArray(v) ? v : []);

const getDecayText = (decay) => {
  if (!decay || typeof decay !== "object") return "N/A";
  const mode = decay.mode || "time";
  const startAfter = decay.start_after_minutes ?? 0;
  const penalty = decay.penalty_per_interval ?? 0;
  const interval = decay.interval_minutes ?? 0;
  const minScore = decay.min_score ?? 0;

  return `Mode: ${mode} | Start after: ${startAfter} min | Penalty: ${penalty} / ${interval} min | Minimum Score: ${minScore}`;
};

/* =========================
   Main
========================= */

export default function Report() {
  const { archiveScenarioId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [team, setTeam] = useState("teamA");
  const [loading, setLoading] = useState(true);

  const [meta, setMeta] = useState(null);
  const [teamOverview, setTeamOverview] = useState(null);
  const [phaseAnalysis, setPhaseAnalysis] = useState(null);
  const [executive, setExecutive] = useState(null);

  const [evidencePlayers, setEvidencePlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  const loadReport = async (t) => {
    setLoading(true);
    try {
      const execRes = await getExecutiveScenarioReport(archiveScenarioId, t);
      const evRes = await getScenarioEvidenceReport(archiveScenarioId, t);

      const exec = execRes?.data || {};
      const ev = evRes?.data || {};

      setMeta(exec.scenario_meta || null);
      setTeamOverview(exec.team_overview || null);
      setPhaseAnalysis(exec.phase_analysis || null);
      setExecutive(exec.executive_assessment || null);

      const players = safeArr(ev.players);
      setEvidencePlayers(players);

      // auto select first player
      if (players.length) {
        setSelectedPlayerId(players[0].user_id);
      } else {
        setSelectedPlayerId("");
      }
    } catch (e) {
      ErrorHandler(e, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (archiveScenarioId) loadReport(team);
    // eslint-disable-next-line
  }, [archiveScenarioId, team]);

  const playersList = useMemo(() => safeArr(teamOverview?.players), [teamOverview]);
  const teamMetrics = teamOverview?.team_metrics;

  const selectedEvidencePlayer = useMemo(() => {
    return evidencePlayers.find((p) => p.user_id === selectedPlayerId) || null;
  }, [evidencePlayers, selectedPlayerId]);

  const phaseRows = useMemo(() => safeArr(phaseAnalysis?.phases), [phaseAnalysis]);

  // Charts
  const readinessPie = useMemo(() => {
    const counts = { Strong: 0, Moderate: 0, Weak: 0 };
    playersList.forEach((p) => {
      const r = p?.metrics?.overall_readiness;
      if (counts[r] !== undefined) counts[r] += 1;
    });
    return [
      { name: "Strong", value: counts.Strong },
      { name: "Moderate", value: counts.Moderate },
      { name: "Weak", value: counts.Weak },
    ];
  }, [playersList]);

  const phaseLagChart = useMemo(() => {
    return phaseRows.map((p) => ({
      phase: p.phase_id?.slice(0, 6) || "NA",
      tfa: Number(p.avg_time_to_first_action_min || 0),
      appr: Number(p.avg_approval_delay_min || 0),
    }));
  }, [phaseRows]);

  const phaseScoreChart = useMemo(() => {
    return phaseRows.map((p) => ({
      phase: p.phase_id?.slice(0, 6) || "NA",
      scoreRatio: Math.round((p.score_ratio || 0) * 100),
      notActed: p.not_acted || 0,
    }));
  }, [phaseRows]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="70vh">
        <CircularProgress />
        <Typography mt={2}>Generating CISO report…</Typography>
      </Stack>
    );
  }

  if (!meta) {
    return (
      <Stack alignItems="center" justifyContent="center" height="60vh">
        <Typography>Report data not available.</Typography>
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" sx={{ py: 4, px: 2, background: "#0b1220", minHeight: "100vh" }}>
      {/* Action Bar */}
      <Stack direction="row" gap={2} className="no-print" sx={{ mb: 2, width: "1100px", justifyContent: "flex-end" }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: "#cbd5e1" }}>Team</InputLabel>
          <Select
            value={team}
            label="Team"
            onChange={(e) => setTeam(e.target.value)}
            sx={{
              color: "#e2e8f0",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#22d3ee" },
            }}
          >
            <MenuItem value="teamA">Team A</MenuItem>
            <MenuItem value="teamB">Team B</MenuItem>
          </Select>
        </FormControl>

        <ReactToPrint
          trigger={() => (
            <Button
              variant="outlined"
              sx={{
                borderColor: "#22d3ee",
                color: "#22d3ee",
                "&:hover": { borderColor: "#67e8f9", color: "#67e8f9" },
              }}
            >
              Print / Export PDF
            </Button>
          )}
          content={() => printRef.current}
          pageStyle={`
            @page { size: A4; margin: 14mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
          `}
        />
      </Stack>

      {/* Printable Area */}
      <Box ref={printRef} sx={{ width: "1100px" }}>
        {/* =========================
            PAGE 1 — Team Overview
        ========================== */}
        <HeroHeader meta={meta} team={team} executive={executive} />

        <CardSection title="Exercise Summary (Team Overview)">
          <Stack direction="row" spacing={2} alignItems="stretch">
            <MetricTile title="Team Duration" value={formatDuration(teamMetrics?.team_duration_min)} />
            <MetricTile title="Overall Readiness" value={executive?.overall_readiness || "N/A"} chipColor={readinessColor(executive?.overall_readiness)} />
            <MetricTile title="Team Score" value={`${teamMetrics?.final_score ?? 0} / ${teamMetrics?.base_score ?? 0}`} />
            <MetricTile title="Avg First Action" value={formatDuration(teamMetrics?.average_time_to_first_action_min)} />
            <MetricTile title="Avg Approval Lag" value={formatDuration(teamMetrics?.average_approval_delay_min)} />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2}>
            <Card sx={{ flex: 1, p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: "#0f172a", fontWeight: 700 }}>
                Player Readiness Distribution
              </Typography>
              <Box sx={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={readinessPie} dataKey="value" nameKey="name" outerRadius={80} label>
                      <Cell />
                      <Cell />
                      <Cell />
                    </Pie>
                    <ReTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="caption" sx={{ color: "#475569" }}>
                Executive note: distribution shows operational resilience spread across the team.
              </Typography>
            </Card>

            <Card sx={{ flex: 2, p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ color: "#0f172a", fontWeight: 700 }}>
                Players (Readiness + Score)
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><b>Player</b></TableCell>
                    <TableCell align="center"><b>Readiness</b></TableCell>
                    <TableCell align="center"><b>Score</b></TableCell>
                    <TableCell align="center"><b>Avg First Action</b></TableCell>
                    <TableCell align="center"><b>Hint %</b></TableCell>
                    <TableCell align="center"><b>Decay Penalty</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playersList.map((p) => (
                    <TableRow key={p.user_id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={p.metrics?.overall_readiness || "N/A"}
                          color={readinessColor(p.metrics?.overall_readiness)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {p.metrics?.final_score ?? 0}/{p.metrics?.base_score ?? 0}
                      </TableCell>
                      <TableCell align="center">
                        {formatDuration(p.metrics?.average_time_to_first_action_min)}
                      </TableCell>
                      <TableCell align="center">
                        {fmt(p.metrics?.hint_utilisation_percent, 1)}%
                      </TableCell>
                      <TableCell align="center">
                        -{p.metrics?.total_decay_penalty ?? 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Stack>
        </CardSection>

        <Box className="page-break" />

        {/* =========================
            PAGE 2 — Phase Analysis
        ========================== */}
        <CardSection title="Phase-wise Gaps & Lag (Operational View)">
          <Typography variant="body2" sx={{ color: "#334155", mb: 2 }}>
            This section highlights where the team lagged by phase (time-to-first-action & approval delay) and where gaps exist (low score ratio / high not-acted).
          </Typography>

          <Stack direction="row" spacing={2}>
            <Card sx={{ flex: 1, p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Phase Lag (Time)
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={phaseLagChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="tfa" name="Time to First Action (min)" />
                    <Bar dataKey="appr" name="Approval Delay (min)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="caption" sx={{ color: "#475569" }}>
                Use this to identify phases requiring playbook automation and faster triage.
              </Typography>
            </Card>

            <Card sx={{ flex: 1, p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Phase Gaps (Score & Not Acted)
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={phaseScoreChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" />
                    <YAxis />
                    <ReTooltip />
                    <Bar dataKey="scoreRatio" name="Score Ratio (%)" />
                    <Bar dataKey="notActed" name="Not Acted (count)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="caption" sx={{ color: "#475569" }}>
                Low score ratio + high not-acted indicates true execution gaps.
              </Typography>
            </Card>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Phase Summary Table
          </Typography>

          <Table size="small" sx={{ mt: 1 }}>
            <TableHead>
              <TableRow>
                <TableCell><b>Phase</b></TableCell>
                <TableCell align="center"><b>Readiness</b></TableCell>
                <TableCell align="center"><b>Score</b></TableCell>
                <TableCell align="center"><b>First Action</b></TableCell>
                <TableCell align="center"><b>Approval Lag</b></TableCell>
                <TableCell align="center"><b>Not Acted</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {phaseRows.map((p) => (
                <TableRow key={p.phase_id}>
                  <TableCell>{p.phase_id}</TableCell>
                  <TableCell align="center">
                    <Chip size="small" label={p.readiness} color={readinessColor(p.readiness)} />
                  </TableCell>
                  <TableCell align="center">
                    {p.final_score}/{p.base_score} ({Math.round((p.score_ratio || 0) * 100)}%)
                  </TableCell>
                  <TableCell align="center">{formatDuration(p.avg_time_to_first_action_min)}</TableCell>
                  <TableCell align="center">{formatDuration(p.avg_approval_delay_min)}</TableCell>
                  <TableCell align="center">{p.not_acted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardSection>

        <Box className="page-break" />

        {/* =========================
            PAGE 3 — Player Drilldown
        ========================== */}
        <CardSection title="Player Drilldown (Audit View)">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 320 }}>
              <InputLabel>Player</InputLabel>
              <Select
                value={selectedPlayerId}
                label="Player"
                onChange={(e) => setSelectedPlayerId(e.target.value)}
              >
                {evidencePlayers.map((p) => (
                  <MenuItem key={p.user_id} value={p.user_id}>
                    {p.name} ({p.team})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Chip
              label={`Team: ${team === "teamA" ? "Team A" : "Team B"}`}
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          {!selectedEvidencePlayer ? (
            <Typography>No player data available.</Typography>
          ) : (
            <>
              <Card sx={{ p: 2, borderRadius: 3, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                  {selectedEvidencePlayer.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  {selectedEvidencePlayer.email || "—"} | {selectedEvidencePlayer.team}
                </Typography>
              </Card>

              {safeArr(selectedEvidencePlayer.submissions).map((s, idx) => {
                const sm = s.score_meta || {};
                const base = sm.base_score ?? 0;
                const final = sm.final_score ?? 0;
                const hintPenalty = sm.hint_penalty ?? 0;
                const decayPenalty = sm.decay_penalty ?? 0;

                return (
                  <Accordion key={idx} sx={{ mb: 1, borderRadius: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
                        <Typography sx={{ fontWeight: 800 }}>
                          {(s?.item?.type || "item").toUpperCase()} • {s?.item?.id || "—"} — {s.status}
                        </Typography>

                        <Chip
                          size="small"
                          label={`${final}/${base}`}
                          color={final >= base * 0.75 ? "success" : final >= base * 0.5 ? "warning" : "error"}
                        />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          <MiniMetric label="Phase" value={s.phase_id || "—"} />
                          <MiniMetric label="First Action" value={formatDuration(s.time_to_first_action_min)} />
                          <MiniMetric label="Approval Lag" value={formatDuration(s.approval_delay_min)} />
                          <MiniMetric label="Attempts" value={s.retires ?? 0} />
                        </Stack>

                        <Divider />

                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                          Score Breakdown (Audit)
                        </Typography>

                        <Table size="small">
                          <TableBody>
                            <RowKV k="Scoring Type" v={sm.type || "standard"} />
                            <RowKV k="Base Score" v={base} />
                            <RowKV k="Final Score" v={final} />
                            <RowKV k="Hint Penalty (-)" v={hintPenalty} />
                            <RowKV k="Decay Penalty (-)" v={decayPenalty} />
                            <RowKV k="Decayed?" v={String(sm.decayed ?? false)} />
                            <RowKV k="Elapsed Minutes" v={sm.elapsed_minutes ?? "—"} />
                            <RowKV k="Intervals Passed" v={sm.intervals_passed ?? "—"} />
                          </TableBody>
                        </Table>

                        <Typography variant="caption" sx={{ color: "#475569" }}>
                          * Penalties are from stored score_meta to explain “why less score” for audit & compliance.
                        </Typography>

                        <Divider />

                        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                          Submission Evidence
                        </Typography>

                        <Typography variant="body2" sx={{ color: "#334155" }}>
                          <b>Submitted Text:</b> {s.submitted_text || s.submitted_response || "—"}
                        </Typography>

                        {safeArr(s.evidence_files).length ? (
                          <Stack spacing={0.5} sx={{ mt: 1 }}>
                            {s.evidence_files.map((f, i) => (
                              <a key={i} href={f.url} target="_blank" rel="noreferrer">
                                📎 {f.name}
                              </a>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2">No attachments.</Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </>
          )}
        </CardSection>

        <Box className="page-break" />

        {/* =========================
            FINAL PAGE — Executive
        ========================== */}
        <CardSection title="Executive Assessment (CISO Summary)">
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Overall Readiness:
              </Typography>
              <Chip
                label={executive?.overall_readiness || "N/A"}
                color={readinessColor(executive?.overall_readiness)}
              />
            </Stack>

            <Divider />

            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              Key Observations
            </Typography>

            <ul style={{ marginTop: 0 }}>
              {safeArr(executive?.summary_lines).map((l, i) => (
                <li key={i}>
                  <Typography variant="body2">{l}</Typography>
                </li>
              ))}
            </ul>

            <Divider />

            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              Gap Assessment (What must improve)
            </Typography>

            <Typography variant="body2" sx={{ color: "#334155" }}>
              Recommended focus areas are derived from phase-wise lag, not-acted items, and penalty patterns.
              Prioritize playbooks and approvals in phases showing high lag and low score ratio.
            </Typography>

            <Divider />

            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              Final Conclusion
            </Typography>
            <Typography variant="body2">{executive?.final_conclusion || "N/A"}</Typography>
          </Stack>
        </CardSection>

        {/* footer */}
        <Box sx={{ mt: 2, textAlign: "center", color: "#94a3b8" }}>
          <Typography variant="caption">
            Generated by RangeStorm — Executive Cyber Readiness Report
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

/* =========================
   Components
========================= */

function HeroHeader({ meta, team, executive }) {
  return (
    <Card
      sx={{
        p: 4,
        mb: 3,
        borderRadius: 4,
        background: "linear-gradient(135deg, #0f172a 0%, #111827 60%, #0b1220 100%)",
        color: "#fff",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {meta?.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            Severity: {meta?.severity || "—"} &nbsp;|&nbsp; Scoring:{" "}
            {meta?.scoring_type || "standard"}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip label={team === "teamA" ? "Team A" : "Team B"} sx={{ fontWeight: 800 }} />
            <Chip
              label={`Readiness: ${executive?.overall_readiness || "N/A"}`}
              color={readinessColor(executive?.overall_readiness)}
              sx={{ fontWeight: 800 }}
            />
          </Stack>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Archive Scenario ID
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {meta?.archive_scenario_id}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2, borderColor: "rgba(148,163,184,0.2)" }} />

      {/* scoring config */}
      <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
        Scoring Model
      </Typography>
      {meta?.scoring_type === "decay" ? (
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          {getDecayText(meta?.decay_config)}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ opacity: 0.85 }}>
          Standard scoring (no time-decay).
        </Typography>
      )}
    </Card>
  );
}

function CardSection({ title, children }) {
  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a" }}>
        {title}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {children}
    </Card>
  );
}

function MetricTile({ title, value, chipColor }) {
  return (
    <Card sx={{ flex: 1, p: 2, borderRadius: 3, background: "#f8fafc" }}>
      <Typography variant="caption" sx={{ color: "#475569", fontWeight: 800 }}>
        {title}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
        {chipColor ? (
          <Chip label={value} color={chipColor} size="small" />
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a" }}>
            {value}
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

function MiniMetric({ label, value }) {
  return (
    <Box sx={{ p: 1, borderRadius: 2, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 900 }}>
        {value}
      </Typography>
    </Box>
  );
}

function RowKV({ k, v }) {
  return (
    <TableRow>
      <TableCell sx={{ width: 220 }}>
        <b>{k}</b>
      </TableCell>
      <TableCell>{String(v)}</TableCell>
    </TableRow>
  );
}
