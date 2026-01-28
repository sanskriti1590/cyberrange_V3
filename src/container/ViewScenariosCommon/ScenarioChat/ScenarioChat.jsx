import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Avatar,
  Divider,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

import {
  getScenarioChatChannels,
  getScenarioChatMessages,
  sendScenarioChatMessage,
} from "../../../APIConfig/version2Scenario";

import "./index.css";

export default function ScenarioChat() {
  const { activeScenarioId } = useParams();
  const navigate = useNavigate();

  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // -------------------------------
  // Load channels
  // -------------------------------
  useEffect(() => {
    async function loadChannels() {
      const res = await getScenarioChatChannels(activeScenarioId);
      const ch = res?.data?.channels || [];
      setChannels(ch);
      if (ch.length) setActiveChannel(ch[0]);
    }
    loadChannels();
  }, [activeScenarioId]);

  // -------------------------------
  // Load messages
  // -------------------------------
  useEffect(() => {
    if (!activeChannel) return;

    async function loadMessages() {
      const res = await getScenarioChatMessages(
        activeChannel.channel_key
      );
      setMessages(res?.data?.messages || []);
    }
    loadMessages();
  }, [activeChannel]);

  // -------------------------------
  // Send message
  // -------------------------------
  const sendMessage = async () => {
    if (!text.trim()) return;

    await sendScenarioChatMessage({
      active_scenario_id: activeScenarioId,
      channel_key: activeChannel.channel_key,
      message: text,
    });

    setText("");
    const res = await getScenarioChatMessages(
      activeChannel.channel_key
    );
    setMessages(res?.data?.messages || []);
  };

  return (
    <Box className="chat-root">
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back to Console
        </Button>
        <Typography variant="h6">
          Team Chat
        </Typography>
      </Stack>

      {/* Channel Tabs */}
      <Stack direction="row" spacing={1} mt={2}>
        {channels.map((c) => (
          <Button
            key={c.channel_key}
            onClick={() => setActiveChannel(c)}
            className={
              activeChannel?.channel_key === c.channel_key
                ? "tab-active"
                : "tab"
            }
          >
            {c.team_group} • {c.scope}
          </Button>
        ))}
      </Stack>

      {/* Messages */}
      <Box className="chat-box">
        {messages.map((m, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={1}
            className={
              m.sender_user_id === "ME"
                ? "msg-right"
                : "msg-left"
            }
          >
            <Avatar>{m.sender_name?.[0]}</Avatar>
            <Box className="bubble">
              <Typography className="sender">
                {m.sender_name}
              </Typography>
              <Typography>
                {m.message}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>

      <Divider />

      {/* Input */}
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={sendMessage}>
          <SendIcon />
        </Button>
      </Stack>
    </Box>
  );
}
