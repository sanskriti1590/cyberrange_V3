import { Stack, Button } from "@mui/material";

export default function ChannelTabs({ channels, active, onChange }) {
  return (
    <Stack direction="row" spacing={1} mt={2}>
      {channels.map((c) => (
        <Button
          key={c.channel_key}
          onClick={() => onChange(c)}
          className={
            active?.channel_key === c.channel_key
              ? "tab-active"
              : "tab"
          }
        >
          {c.team_group} • {c.scope}
        </Button>
      ))}
    </Stack>
  );
}
