import { Stack, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <Stack direction="row" spacing={1} mt={1}>
      <TextField
        fullWidth
        placeholder="Type a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={submit}>
        <SendIcon />
      </Button>
    </Stack>
  );
}
