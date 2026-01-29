// src/container/ViewScenariosCommon/ScenarioChat/ScenarioChat.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

import {
  getScenarioChatChannels,
  getScenarioChatMessages,
  sendScenarioChatMessage,
} from "../../../APIConfig/version2Scenario";

import ChannelTabs from "./ChannelTabs";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { sanitizeMessage } from "./chatUtils";

const BG = "#020617";
const BORDER = "#1e293b";

export default function ScenarioChat() {
  const { activeScenarioId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const [activeChannelKey, setActiveChannelKey] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  /* ================= CURRENT USER ================= */
  const { currentUserName, currentUserId } = useMemo(() => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return { currentUserName: "You", currentUserId: null };
      const u = jwtDecode(token);
      return {
        currentUserName: u?.name || u?.username || u?.email || "You",
        currentUserId: u?.user_id || u?.id || null,
      };
    } catch {
      return { currentUserName: "You", currentUserId: null };
    }
  }, []);

  const activeChannel = useMemo(
    () => channels.find((c) => c.channel_key === activeChannelKey) || null,
    [channels, activeChannelKey]
  );

  const canHitApi = Boolean(activeScenarioId);

  /* ================= LOAD CHANNELS ================= */
  const loadChannels = async () => {
    if (!canHitApi) return;
    const res = await getScenarioChatChannels(activeScenarioId);
    const list = res?.data?.channels || [];
    setChannels(list);

    if (!activeChannelKey && list.length) {
      const prefer =
        list.find((c) => c.scope.endsWith("_TEAM")) ||
        list.find((c) => c.scope === "ALL") ||
        list.find((c) => c.scope === "GLOBAL");
      setActiveChannelKey(prefer?.channel_key || "");
    }
  };

  const loadMessages = async (channelKey) => {
    if (!channelKey) return;
    const res = await getScenarioChatMessages(channelKey);
    setMessages(res?.data?.messages || []);
  };

  useEffect(() => {
    if (!canHitApi) return;
    setLoading(true);
    loadChannels()
      .catch(() => toast.error("Failed to load chat"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [activeScenarioId]);

  useEffect(() => {
    if (!activeChannelKey) return;
    loadMessages(activeChannelKey);
    // eslint-disable-next-line
  }, [activeChannelKey]);

  /* ================= SEND MESSAGE ================= */
  const onSend = async () => {
    if (!activeChannelKey) return;

    const clean = sanitizeMessage(input);
    if (!clean && !file) return;

    // optimistic UI
    const optimistic = {
      id: `OPT_${Date.now()}`,
      message: clean,
      sender_user_id: currentUserId,
      sender_name: currentUserName,
      sender_role: "SELF",
      created_at: new Date().toISOString(),
      attachments: file
        ? [{ id: "tmp", file_name: file.name, file_url: "#" }]
        : [],
    };

    setMessages((p) => [...p, optimistic]);
    setInput("");
    setFile(null);

    try {
      await sendScenarioChatMessage({
        active_scenario_id: activeScenarioId,
        channel_key: activeChannelKey,
        message: clean,
        attachments: file ? [file] : [],   // ✅ IMPORTANT
      });

      await loadMessages(activeChannelKey);
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: BG }}>
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* HEADER */}
      <Box
        sx={{
          height: 56,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{ color: "#e5e7eb" }} />
          </IconButton>
          <Typography sx={{ color: "#e5e7eb", fontWeight: 800 }}>
            Scenario Chat
          </Typography>
        </Stack>

        <Chip
          label={activeChannel?.label || "—"}
          size="small"
          sx={{ color: "#cbd5e1", border: `1px solid ${BORDER}` }}
        />
      </Box>

      {/* BODY */}
      <Box sx={{ p: 2 }}>
        <ChannelTabs
          channels={channels}
          activeChannelKey={activeChannelKey}
          onChange={setActiveChannelKey}
        />

        <Box
          sx={{
            mt: 2,
            border: `1px solid ${BORDER}`,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 160px)",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#94a3b8" }}>
              {activeChannel?.label || "Chat"}
            </Typography>
            <IconButton size="small" onClick={() => loadMessages(activeChannelKey)}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          <MessageList
            messages={messages}
            currentUserId={currentUserId}
          />

          <MessageInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSend={onSend}
            file={file}
            setFile={setFile}
            disabledSend={!sanitizeMessage(input)}
          />
        </Box>
      </Box>
    </Box>
  );
}
