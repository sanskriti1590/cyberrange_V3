import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddIcon from "@mui/icons-material/Add";

import {
  getSuperAdminLeaderboard,
  applySuperAdminManualScore,
  toggleSuperAdminFlagLock,
  toggleSuperAdminMilestoneLock,
} from "../../APIConfig/SuperAdminConfig";

const ROLE_COLORS = {
  BLUE: "#38bdf8",
  RED: "#fb7185",
  PURPLE: "#c084fc",
  YELLOW: "#facc15",
};

export default function ConfigTab({ activeScenarioId }) {
  const [data, setData] = useState(null);

  // snackbar
  const [snack, setSnack] = useState({ open: false, msg: "" });
  const showSnack = (msg) => setSnack({ open: true, msg });

  // score modal
  const [openAdjust, setOpenAdjust] = useState(false);
  const [participant, setParticipant] = useState("");
  const [type, setType] = useState("BONUS");
  const [points, setPoints] = useState("");
  const [note, setNote] = useState("");

  // unlock/lock modal
  const [lockModal, setLockModal] = useState({
    open: false,
    item: null,
    nextLocked: true,
    scope: "ALL",
    team_group: "",
    participant_id: "",
  });

  const fetchData = async () => {
    try {
      const res = await getSuperAdminLeaderboard(activeScenarioId);
      setData(res.data);
    } catch (e) {
      showSnack("Failed to load config data");
    }
  };

  useEffect(() => {
    if (activeScenarioId) fetchData();
  }, [activeScenarioId]);

  const participants = data?.players || [];
  const phases = data?.phases || [];
  const cfg = data?.config || {};
  const cfgByPhase = cfg.by_phase || {};
  const teamGroups = cfg.team_groups || [];

  const adjustments = data?.score_adjustments || [];

  /* =========================
     Manual Score Submit
  ========================= */
  const handleManualScore = async () => {
    try {
      await applySuperAdminManualScore({
        active_scenario_id: activeScenarioId,
        participant_id: participant, // ✅ participant_data_id from dropdown
        delta: type === "BONUS" ? Number(points) : -Number(points),
        note,
        reason: type,
      });

      showSnack("Score adjustment applied");
      setOpenAdjust(false);
      setPoints("");
      setNote("");
      fetchData();
    } catch (e) {
      const msg =
        e?.response?.data?.errors?.non_field_errors?.[0] ||
        "Score adjustment failed";
      showSnack(msg);
    }
  };

  /* =========================
     Open Lock Modal
  ========================= */
  const openLockPopup = (item) => {
    setLockModal({
      open: true,
      item,
      nextLocked: !item.locked, // toggle
      scope: "ALL",
      team_group: "",
      participant_id: "",
    });
  };

  /* =========================
     Apply Lock/Unlock
  ========================= */
  const applyLock = async () => {
    const { item, nextLocked, scope, team_group, participant_id } = lockModal;
    if (!item) return;

    try {
        const payload = {
        active_scenario_id: activeScenarioId,
        locked: nextLocked,
        scope,
        team_group: team_group || undefined,
        participant_id: participant_id || undefined,
        };

        if (item.type === "FLAG") {
        payload.flag_id = item.id;
        await toggleSuperAdminFlagLock(payload);
        } else {
        payload.milestone_id = item.id;
        await toggleSuperAdminMilestoneLock(payload);
        }

        // ✅ -------- INSTANT VISUAL UPDATE --------
        setData((prev) => {
        if (!prev) return prev;

        const newData = { ...prev };
        const byPhase = { ...newData.config.by_phase };

        const items = byPhase[item.phase_id] || [];

        const updatedItems = items.map((it) => {
            if (it.id === item.id && it.type === item.type) {
            return {
                ...it,
                locked: nextLocked,
            };
            }
            return it;
        });

        byPhase[item.phase_id] = updatedItems;

        newData.config = {
            ...newData.config,
            by_phase: byPhase,
        };

        return newData;
        });

        showSnack(`${nextLocked ? "Locked" : "Unlocked"} successfully`);
        setLockModal((p) => ({ ...p, open: false }));

        // 🔁 still refresh in background for correctness
        fetchData();

    } catch (e) {
        showSnack("Lock/unlock failed");
    }
    };

  const participantNameMap = useMemo(() => {
  const map = {};
  (data?.players || []).forEach(p => {
    map[p.participant_id] = p.name;
  });
  return map;
}, [data]);

  return (
    <Box>

      {/* ================= SCORE ADJUSTMENTS TABLE ================= */}
      <Card sx={{ p: 3, mb: 3, background: "#0b1220" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={900} color="#22d3ee">
            Score Adjustments
          </Typography>

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setOpenAdjust(true)}
            sx={{ background: "#14b8a6", fontWeight: 900 }}
          >
            Add Adjustment
          </Button>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#94a3b8" }}>Participant</TableCell>
                <TableCell sx={{ color: "#94a3b8" }}>Type</TableCell>
                <TableCell sx={{ color: "#94a3b8" }}>Points</TableCell>
                <TableCell sx={{ color: "#94a3b8" }}>Reason</TableCell>
                <TableCell sx={{ color: "#94a3b8" }}>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adjustments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ color: "#94a3b8" }}>
                    No score adjustments yet
                  </TableCell>
                </TableRow>
              ) : (
                adjustments.slice().reverse().map((a, idx) => (
                <TableRow key={idx}>
                    <TableCell sx={{ color: "#e5e7eb" }}>
                    {participantNameMap[a.participant_data_id] || "—"}
                    </TableCell>

                    <TableCell>
                    <Chip
                        label={a.type}
                        size="small"
                        sx={{
                        background: a.type === "BONUS" ? "#064e3b" : "#7f1d1d",
                        color: "#fff",
                        fontWeight: 900,
                        }}
                    />
                    </TableCell>

                    <TableCell
                    sx={{
                        color: a.delta >= 0 ? "#22c55e" : "#ef4444",
                        fontWeight: 900,
                    }}
                    >
                    {a.delta >= 0 ? `+${a.delta}` : a.delta}
                    </TableCell>

                    <TableCell sx={{ color: "#cbd5e1" }}>
                    {a.note || "—"}
                    </TableCell>

                    <TableCell sx={{ color: "#94a3b8" }}>
                    {a.timestamp_ms
                    ? new Date(a.timestamp_ms).toLocaleTimeString()
                    : "—"}
                    </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>

      {/* ================= CONFIG TABLE ================= */}
      <Card sx={{ p: 3, background: "#0b1220" }}>
        <Typography fontWeight={900} color="#22d3ee" mb={2}>
          Flag / Milestone Configuration
        </Typography>

        {phases.map((phase) => (
          <Box key={phase.phase_id} mb={3}>
            <Typography sx={{ color: "#06b6d4", fontWeight: 900, mb: 1 }}>
              {phase.phase_name?.toUpperCase()}
            </Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#94a3b8" }}>Name</TableCell>
                  <TableCell sx={{ color: "#94a3b8" }}>Description</TableCell>
                  <TableCell sx={{ color: "#94a3b8" }}>Role</TableCell>
                  <TableCell sx={{ color: "#94a3b8" }}>Points</TableCell>
                  <TableCell sx={{ color: "#94a3b8" }}>Assigned To</TableCell>
                  <TableCell sx={{ color: "#94a3b8" }}>Status</TableCell>
                  <TableCell sx={{ color: "#94a3b8" }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {(cfgByPhase[phase.phase_id] || []).map((item) => (
                  <TableRow key={`${item.type}-${item.id}`}>
                    <TableCell sx={{ color: "#e5e7eb", fontWeight: 900 }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ color: "#cbd5e1" }}>
                      {item.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={item.role || "BLUE"}
                        sx={{
                          background: "rgba(2,6,23,0.6)",
                          border: `1px solid ${ROLE_COLORS[item.role] || "#38bdf8"}`,
                          color: ROLE_COLORS[item.role] || "#38bdf8",
                          fontWeight: 900,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#22c55e", fontWeight: 900 }}>
                      {item.points}
                    </TableCell>
                    <TableCell sx={{ color: "#e5e7eb" }}>
                      {(item.assigned_to || []).length ? item.assigned_to.join(", ") : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.locked ? "Locked" : "Active"}
                        size="small"
                        sx={{
                          background: item.locked ? "#7f1d1d" : "#064e3b",
                          color: "#fff",
                          fontWeight: 900,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => openLockPopup(item)}>
                        {item.locked ? (
                          <LockIcon sx={{ color: "#ef4444" }} />
                        ) : (
                          <LockOpenIcon sx={{ color: "#22c55e" }} />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {(cfgByPhase[phase.phase_id] || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ color: "#94a3b8" }}>
                      No items in this phase
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </Box>
        ))}
      </Card>

      {/* ================= SCORE MODAL ================= */}
      <Dialog
        open={openAdjust}
        onClose={() => setOpenAdjust(false)}
        PaperProps={{
          sx: {
            background: "#0f172a",
            color: "#e5e7eb",
            borderRadius: 3,
            border: "1px solid rgba(56,189,248,0.3)",
            boxShadow: "0 0 40px rgba(0,0,0,0.6)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 20,
            fontWeight: 900,
            color: "#38bdf8",
            borderBottom: "1px solid rgba(148,163,184,0.15)",
            pb: 2,
          }}
        >
          ⚖ Manual Score Adjustment
        </DialogTitle>

        <DialogContent sx={{ minWidth: 500, mt: 2 }}>
          <Stack spacing={3} mt={1}>

            {/* PARTICIPANT */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#94a3b8" }}>
                Participant
              </InputLabel>
              <Select
                value={participant}
                onChange={(e) => setParticipant(e.target.value)}
                label="Participant"
                sx={{
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#38bdf8",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#38bdf8",
                  },
                }}
              >
                {participants.map((p) => (
                  <MenuItem
                    key={p.participant_id}
                    value={p.participant_id}
                  >
                    {p.name} ({p.team_group})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* TYPE */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#94a3b8" }}>
                Type
              </InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Type"
                sx={{
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                }}
              >
                <MenuItem value="BONUS">Bonus (+)</MenuItem>
                <MenuItem value="PENALTY">Penalty (-)</MenuItem>
              </Select>
            </FormControl>

            {/* POINTS */}
            <TextField
              label="Points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              fullWidth
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
                "& .MuiInputLabel-root": {
                  color: "#94a3b8",
                },
              }}
            />

            {/* AUDIT NOTE */}
            <TextField
              label="Audit Note"
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
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
                "& .MuiInputLabel-root": {
                  color: "#94a3b8",
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid rgba(148,163,184,0.15)",
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={() => setOpenAdjust(false)}
            sx={{
              color: "#94a3b8",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleManualScore}
            sx={{
              background: "linear-gradient(90deg,#22d3ee,#06b6d4)",
              color: "#000",
              fontWeight: 800,
              "&:hover": {
                background: "#0891b2",
              },
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= LOCK MODAL (Scope) ================= */}
      <Dialog
        open={lockModal.open}
        onClose={() => setLockModal((p) => ({ ...p, open: false }))}
        PaperProps={{
          sx: {
            background: "#0f172a",
            color: "#e5e7eb",
            borderRadius: 3,
            border: "1px solid rgba(56,189,248,0.3)",
            boxShadow: "0 0 40px rgba(0,0,0,0.6)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: 20,
            fontWeight: 900,
            color: "#38bdf8",
            borderBottom: "1px solid rgba(148,163,184,0.15)",
            pb: 2,
          }}
        >
          {lockModal.nextLocked ? "🔒 Lock Item" : "🔓 Unlock Item"}
        </DialogTitle>

        <DialogContent sx={{ minWidth: 480, mt: 2 }}>
          <Stack spacing={3} mt={1}>
            
            {/* ITEM NAME */}
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 700,
                color: "#e5e7eb",
              }}
            >
              {lockModal.item?.name}
            </Typography>

            {/* SCOPE SELECT */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: "#94a3b8" }}>Scope</InputLabel>
              <Select
                value={lockModal.scope}
                label="Scope"
                onChange={(e) =>
                  setLockModal((p) => ({ ...p, scope: e.target.value }))
                }
                sx={{
                  backgroundColor: "#020617",
                  color: "#e5e7eb",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(148,163,184,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#38bdf8",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#38bdf8",
                  },
                }}
              >
                <MenuItem value="ALL">All Teams</MenuItem>
                <MenuItem value="TEAM">Specific Team</MenuItem>
                <MenuItem value="PARTICIPANT">Specific Participant</MenuItem>
              </Select>
            </FormControl>

            {/* TEAM SELECT */}
            {lockModal.scope === "TEAM" && (
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#94a3b8" }}>
                  Team Group
                </InputLabel>
                <Select
                  value={lockModal.team_group}
                  label="Team Group"
                  onChange={(e) =>
                    setLockModal((p) => ({
                      ...p,
                      team_group: e.target.value,
                    }))
                  }
                  sx={{
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                >
                  {teamGroups.map((tg) => (
                    <MenuItem key={tg} value={tg}>
                      {tg}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* PARTICIPANT SELECT */}
            {lockModal.scope === "PARTICIPANT" && (
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#94a3b8" }}>
                  Participant
                </InputLabel>
                <Select
                  value={lockModal.participant_id}
                  label="Participant"
                  onChange={(e) =>
                    setLockModal((p) => ({
                      ...p,
                      participant_id: e.target.value,
                    }))
                  }
                  sx={{
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                >
                  {participants.map((p) => (
                    <MenuItem
                      key={p.participant_id}
                      value={p.participant_id}
                    >
                      {p.name} ({p.team_group})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid rgba(148,163,184,0.15)",
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={() =>
              setLockModal((p) => ({ ...p, open: false }))
            }
            sx={{
              color: "#94a3b8",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={applyLock}
            sx={{
              background: "linear-gradient(90deg,#22d3ee,#06b6d4)",
              color: "#000",
              fontWeight: 800,
              "&:hover": {
                background: "#0891b2",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        message={snack.msg}
        onClose={() => setSnack({ open: false, msg: "" })}
      />
    </Box>
  );
}
