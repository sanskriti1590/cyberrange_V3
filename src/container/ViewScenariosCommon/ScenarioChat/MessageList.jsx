import { Stack, Box, Typography, Avatar } from "@mui/material";

export default function MessageList({ messages }) {
  return (
    <Box className="chat-box">
      {messages.map((m, i) => (
        <Stack
          key={i}
          direction="row"
          spacing={1}
          className="msg"
        >
          <Avatar>{m.sender_name?.[0]}</Avatar>
          <Box className="bubble">
            <Typography className="sender">
              {m.sender_name}
            </Typography>
            <Typography>{m.message}</Typography>
          </Box>
        </Stack>
      ))}
    </Box>
  );
}
