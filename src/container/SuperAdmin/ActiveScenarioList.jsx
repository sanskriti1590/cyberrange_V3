import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Stack,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getSuperAdminActiveScenarios } from "../../APIConfig/SuperAdminConfig";

import GroupsIcon from "@mui/icons-material/Groups";
import TimelineIcon from "@mui/icons-material/Timeline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

export default function ActiveScenarioList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getSuperAdminActiveScenarios();
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Team Color Mapping
  const teamColorMap = {
    "team a": "#3b82f6", // Blue
    "team b": "#ef4444", // Red
    "team c": "#eab308", // Yellow
    "team d": "#a855f7", // Purple
  };

  return (
    <Box
      sx={{
        p: { xs: 3, md: 6 },
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, #0f172a 0%, #020617 70%)",
      }}
    >
      {/* HEADER */}
      <Box mb={6}>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            color: "#38bdf8",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          SuperAdmin Command Center
        </Typography>

        <Typography color="#94a3b8" mt={1}>
          Real-Time Active Cyber Range Operations
        </Typography>
      </Box>

      {loading ? (
        <CircularProgress sx={{ color: "#38bdf8" }} />
      ) : (
        <Grid container spacing={4}>
          {data.map((s) => {
            const teams = s.teams_present || [];

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={s.active_scenario_id}
              >
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background:
                      "linear-gradient(145deg, #0b1220, #020617)",
                    border: "1px solid rgba(56,189,248,0.25)",
                    position: "relative",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow:
                        "0 0 30px rgba(56,189,248,0.6)",
                    },
                  }}
                >
                  {/* LIVE BADGE */}
                  <Chip
                    label="LIVE"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "#dc2626",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 10,
                    }}
                  />

                  {/* TITLE */}
                  <Typography
                    fontWeight={900}
                    fontSize={18}
                    color="#e2e8f0"
                  >
                    {s.scenario_name}
                  </Typography>

                  {/* STATS */}
                  <Stack spacing={1.5} mt={3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <GroupsIcon sx={{ color: "#22c55e" }} />
                      <Typography fontSize={13} color="#94a3b8">
                        {s.participants_count || 0} Participants
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimelineIcon sx={{ color: "#f59e0b" }} />
                      <Typography fontSize={13} color="#94a3b8">
                        {teams.length} Teams
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTimeIcon sx={{ color: "#38bdf8" }} />
                      <Typography fontSize={12} color="#94a3b8">
                        {new Date(s.start_time).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* TEAMS */}
                  <Box mt={3}>
                    <Typography
                      fontSize={12}
                      color="#94a3b8"
                      mb={1}
                      fontWeight={600}
                    >
                      Active Teams
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {teams.map((team, i) => {
                        const key = team.toLowerCase().trim();
                        const color =
                          teamColorMap[key] || "#22c55e";

                        return (
                          <Chip
                            key={i}
                            label={team.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: `${color}20`,
                              color: color,
                              border: `1px solid ${color}40`,
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>

                  {/* BUTTON */}
                    <Button
                    disableElevation
                    onClick={() =>
                        navigate(`scenario/${s.active_scenario_id}`)
                    }
                    sx={{
                        mt: 4,
                        height: 52,
                        width: "100%",
                        maxWidth: 260,        // makes it wider but controlled
                        alignSelf: "left",  // keeps centered inside card
                        borderRadius: "16px",
                        background: "linear-gradient(90deg,#0ea5e9,#14b8a6)",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: 15,
                        letterSpacing: 0.6,
                        textTransform: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1.2,
                        transition: "all 0.25s ease",
                        boxShadow: "0 6px 20px rgba(20,184,166,0.35)",

                        "&:hover": {
                        background: "linear-gradient(90deg,#06b6d4,#10b981)",
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 32px rgba(20,184,166,0.6)",
                        },

                        "&:active": {
                        transform: "scale(0.97)",
                        },
                    }}
                    >
                    <PlayArrowRoundedIcon
                        sx={{
                        fontSize: 22,
                        color: "#000000",   
                        }}
                    />
                    View Details
                    </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
