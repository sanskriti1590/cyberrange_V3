// src/container/ViewScenariosCommon/ScenarioChat/MessageBubble.jsx
import React from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { formatTime, initials } from "./chatUtils";

const BORDER = "#1e293b";

const ROLE_COLORS = {
  RED: {
    c: "#ef4444",
    mine: "rgba(239,68,68,0.25)",
    other: "rgba(239,68,68,0.12)",
  },
  BLUE: {
    c: "#3b82f6",
    mine: "rgba(59,130,246,0.25)",
    other: "rgba(59,130,246,0.12)",
  },
  YELLOW: {
    c: "#facc15",
    mine: "rgba(250,204,21,0.28)",
    other: "rgba(250,204,21,0.12)",
  },
  PURPLE: {
    c: "#a855f7",
    mine: "rgba(168,85,247,0.25)",
    other: "rgba(168,85,247,0.12)",
  },
  WHITE: {
    c: "#22d3ee",
    mine: "rgba(34,211,238,0.25)",
    other: "rgba(34,211,238,0.12)",
  },
  SUPERADMIN: {
    c: "#22c55e",
    mine: "rgba(34,197,94,0.28)",
    other: "rgba(34,197,94,0.12)",
  },
};

export default function MessageBubble({ message, currentUserId }) {
  const mine = currentUserId && message.sender_user_id === currentUserId;

  const role = (message.sender_role || "WHITE").toUpperCase();
  const theme = ROLE_COLORS[role] || ROLE_COLORS.WHITE;

  return (
    <Stack
      direction="row"
      justifyContent={mine ? "flex-end" : "flex-start"}
      spacing={1.2}
      sx={{ px: 2 }}
    >
      {!mine && (
        <Avatar
          sx={{
            bgcolor: "rgba(148,163,184,0.1)",
            border: `1px solid ${BORDER}`,
            color: theme.c,
            fontSize: 12,
          }}
        >
          {initials(message.sender_name)}
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: "70%",
          px: 1.6,
          py: 1.1,
          borderRadius: 2,
          border: `1px solid ${BORDER}`,
          background: mine
            ? theme.mine
            : theme.other,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: theme.c }}>
            {message.sender_name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
            {formatTime(message.created_at)}
          </Typography>
        </Stack>

        <Typography sx={{ mt: 0.5, fontSize: 13, color: "#e5e7eb" }}>
          {message.message}
        </Typography>

        {/* ATTACHMENTS */}
        {Array.isArray(message.attachments) && message.attachments.length > 0 && (
        <Stack spacing={0.6} sx={{ mt: 1 }}>
            {message.attachments.map((a) => (
            <a
                key={a.id}
                href={a.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                color: theme.c,
                fontSize: "12.5px",
                textDecoration: "underline",
                cursor: "pointer",
                display: "inline-block",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                📎 {a.file_name}
            </a>
            ))}
        </Stack>
        )}
      </Box>

      {mine && (
        <Avatar
          sx={{
            bgcolor: theme.c,
            color: "#020617",
            border: `1px solid ${BORDER}`,
            fontSize: 12,
          }}
        >
          {initials(message.sender_name || "You")}
        </Avatar>
      )}
    </Stack>
  );
}
