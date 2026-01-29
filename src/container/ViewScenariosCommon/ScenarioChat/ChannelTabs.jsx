// src/container/ViewScenariosCommon/ScenarioChat/ChannelTabs.jsx
import React, { useMemo } from "react";
import { Box, Button, Stack, Typography, Tooltip } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PublicIcon from "@mui/icons-material/Public";
import ShieldIcon from "@mui/icons-material/Security";
import { channelPrettyName } from "./chatUtils";

const BORDER = "#1e293b";

/* ================= ROLE COLORS ================= */
const ROLE_THEME = {
  RED: "#ef4444",
  BLUE: "#3b82f6",
  YELLOW: "#facc15",
  PURPLE: "#a855f7",
  WHITE: "#22d3ee",
  SUPERADMIN: "#22c55e",
  ALL: "#94a3b8",
  GLOBAL: "#38bdf8",
};

/* ================= HELPERS ================= */
const extractRole = (channel) => {
  if (channel.scope === "GLOBAL") return "GLOBAL";
  if (channel.scope === "ALL") return "ALL";
  if (channel.scope?.includes("_")) return channel.scope.split("_")[0];
  return "WHITE";
};

const iconForScope = (scope, role) => {
  if (scope === "GLOBAL") return <PublicIcon fontSize="small" />;
  if (scope === "ALL") return <PeopleAltIcon fontSize="small" />;
  if (role === "SUPERADMIN") return <ShieldIcon fontSize="small" />;
  return <GroupIcon fontSize="small" />;
};

export default function ChannelTabs({
  channels = [],
  activeChannelKey,
  onChange,
}) {
  /* ✅ HOOK ALWAYS CALLED */
  const grouped = useMemo(() => {
    const map = {};

    channels.forEach((c) => {
      const team = c.team_group || "GLOBAL";
      if (!map[team]) map[team] = [];
      map[team].push(c);
    });

    return map;
  }, [channels]);

  /* ✅ SAFE EARLY RETURN AFTER HOOK */
  if (!channels.length) return null;

  return (
    <Stack spacing={1.5} sx={{ mt: 2 }}>
      {Object.entries(grouped).map(([team, teamChannels]) => (
        <Box key={team}>
          {/* TEAM LABEL */}
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "#94a3b8",
              px: 1,
              mb: 0.6,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {team === "GLOBAL" ? "Global Channels" : `Team ${team}`}
          </Typography>

          {/* CHANNEL ROW */}
          <Stack
            direction="row"
            sx={{
              gap: 0.6,
              px: 0.6,
              py: 0.4,
              overflowX: "auto",
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              background: "rgba(15,23,42,0.55)",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": { height: 6 },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(148,163,184,0.3)",
                borderRadius: 4,
              },
            }}
          >
            {teamChannels.map((c) => {
              const active = activeChannelKey === c.channel_key;
              const role = extractRole(c);
              const accent = ROLE_THEME[role] || ROLE_THEME.WHITE;

              return (
                <Tooltip key={c.channel_key} title={c.label} arrow>
                  <Button
                    onClick={() => onChange(c.channel_key)}
                    startIcon={iconForScope(c.scope, role)}
                    sx={{
                      minWidth: 160,
                      height: 40,
                      textTransform: "none",
                      whiteSpace: "nowrap",
                      borderRadius: 1.6,
                      fontSize: 12.5,
                      color: "#e5e7eb",
                      border: `1px solid ${
                        active ? accent : "transparent"
                      }`,
                      background: active
                        ? `linear-gradient(135deg, ${accent}22, rgba(2,6,23,0.6))`
                        : "rgba(148,163,184,0.06)",
                      boxShadow: active
                        ? `0 0 0 1px ${accent}44`
                        : "none",
                      "&:hover": {
                        background: `linear-gradient(135deg, ${accent}1f, rgba(2,6,23,0.6))`,
                      },
                    }}
                  >
                    {channelPrettyName(c)}
                  </Button>
                </Tooltip>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
