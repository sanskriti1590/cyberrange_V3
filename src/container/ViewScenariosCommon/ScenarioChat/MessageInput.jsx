// src/container/ViewScenariosCommon/ScenarioChat/MessageInput.jsx
import React, { useRef } from "react";
import { Box, IconButton, TextField, Tooltip, Chip, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

const BORDER = "#1e293b";
const ACCENT = "#22d3ee";

export default function MessageInput({
  value,
  onChange,
  onKeyDown,
  onSend,
  disabledSend,
  file,
  setFile,
}) {
  const fileRef = useRef(null);

  return (
    <Box
      sx={{
        borderTop: `1px solid ${BORDER}`,
        p: 1.8,
        background: "rgba(2,6,23,0.55)",
      }}
    >
      {file && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Chip
            label={file.name}
            sx={{
              color: "#e5e7eb",
              border: `1px solid ${BORDER}`,
              bgcolor: "rgba(148,163,184,0.08)",
            }}
          />
          <Tooltip title="Remove attachment">
            <IconButton size="small" onClick={() => setFile(null)} sx={{ color: "#94a3b8" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Tooltip title="Attach file (UI)">
          <IconButton
            onClick={() => fileRef.current?.click()}
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              border: `1px solid ${BORDER}`,
              bgcolor: "rgba(148,163,184,0.06)",
              color: "#cbd5e1",
              "&:hover": { bgcolor: "rgba(148,163,184,0.10)" },
            }}
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>

        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: "rgba(2,6,23,0.35)",
              "& fieldset": { borderColor: BORDER },
              "&:hover fieldset": { borderColor: "#334155" },
              "&.Mui-focused fieldset": { borderColor: ACCENT },
            },
            input: { color: "#e5e7eb" },
          }}
        />

        <Tooltip title="Send">
          <span>
            <IconButton
              onClick={onSend}
              disabled={disabledSend}
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: ACCENT,
                "&:hover": { bgcolor: "#06b6d4" },
                "&.Mui-disabled": { bgcolor: "rgba(34,211,238,0.20)" },
              }}
            >
              <SendIcon sx={{ color: "#020617" }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}
