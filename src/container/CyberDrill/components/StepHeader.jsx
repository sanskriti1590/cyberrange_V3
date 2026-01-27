import React from "react";
import { Stack, Box, Typography } from "@mui/material";

const STEPS = [
  { key: "setup", label: "Scenario Setup" },
  { key: "phases", label: "Phases" },
  { key: "items", label: "Flags / Milestones" },
  { key: "preview", label: "Preview" },
];

export default function StepHeader({ activeIndex = 0 }) {
  return (
    <Stack direction="row" spacing={1.2} sx={{ mb: 3, flexWrap: "wrap" }}>
      {STEPS.map((s, idx) => {
        const active = idx === activeIndex;
        return (
          <Box
            key={s.key}
            sx={{
              px: 2.2,
              py: 1.1,
              borderRadius: 999,
              border: "1px solid",
              borderColor: active ? "#14f1ff66" : "#2a2f3a",
              background: active
                ? "linear-gradient(90deg, rgba(20,241,255,0.18), rgba(0,200,83,0.14))"
                : "rgba(22,24,31,0.9)",
              boxShadow: active
                ? "0 0 0 1px rgba(20,241,255,0.20), 0 18px 45px rgba(0,0,0,0.35)"
                : "0 12px 35px rgba(0,0,0,0.25)",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.2,
                color: active ? "#eaffff" : "#9aa3b2",
              }}
            >
              {idx + 1}. {s.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
