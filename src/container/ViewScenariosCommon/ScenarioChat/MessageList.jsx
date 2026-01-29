// src/container/ViewScenariosCommon/ScenarioChat/MessageList.jsx
import React, { useEffect, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages?.length) {
    return (
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
          No messages yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
      <Stack spacing={1.5}>
        {messages.map((m, i) => (
          <MessageBubble
            key={m.id || i}
            message={m}
            currentUserId={currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </Stack>
    </Box>
  );
}
