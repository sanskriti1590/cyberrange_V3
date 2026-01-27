import { Stack, Button } from "@mui/material";

const TEAMS = [
  { key: "blue", label: "Blue Team", color: "#4fc3f7" },
  { key: "red", label: "Red Team", color: "#ef5350" },
  { key: "purple", label: "Purple Team", color: "#ab47bc" },
  { key: "yellow", label: "Yellow Team", color: "#fdd835" },
];

export default function TeamSelector({ activeTeam, onChange }) {
  return (
    <Stack direction="row" spacing={2}>
      {TEAMS.map((t) => (
        <Button
          key={t.key}
          onClick={() => onChange(t.key)}
          variant={activeTeam === t.key ? "contained" : "outlined"}
          sx={{
            color: activeTeam === t.key ? "#000" : t.color,
            borderColor: t.color,
            background:
              activeTeam === t.key
                ? `linear-gradient(90deg, ${t.color}, #00c853)`
                : "transparent",
          }}
        >
          {t.label}
        </Button>
      ))}
    </Stack>
  );
}
