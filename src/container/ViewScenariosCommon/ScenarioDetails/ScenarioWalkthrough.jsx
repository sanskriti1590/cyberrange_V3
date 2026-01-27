import React from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ScenarioWalkthrough({
  walkthroughDocs = [],
  phases = [],
}) {
  if (!walkthroughDocs.length) {
    return (
      <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
        No walkthrough documents available for your team.
      </Typography>
    );
  }

  const docsByPhase = walkthroughDocs.reduce((acc, d) => {
    acc[d.phase_id] = acc[d.phase_id] || [];
    acc[d.phase_id].push(d);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        mt: 2,
        borderRadius: 2,
        background: "linear-gradient(180deg, #020617 0%, #020617cc 100%)",
        border: "1px solid #1e293b",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 1.5, borderBottom: "1px solid #1e293b" }}>
        <Typography sx={{ fontWeight: 600, color: "#e5e7eb" }}>
          Scenario Walkthrough
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
          Phase-wise guidance & reference material (PDF)
        </Typography>
      </Box>

      {/* Phase Sections */}
      <Box sx={{ p: 1.5 }}>
        <Stack spacing={2}>
          {phases.map((phase) => {
            const docs = docsByPhase[phase.phase_id] || [];

            if (!docs.length) return null;

            return (
              <Box
                key={phase.phase_id}
                sx={{
                  p: 1.25,
                  borderRadius: 1.5,
                  background: "rgba(15,23,42,0.6)",
                  border: "1px solid #1e293b",
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      size="small"
                      label={phase.phase_name || phase.name}
                      sx={{
                        backgroundColor: "rgba(148,163,184,0.15)",
                        color: "#e5e7eb",
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      size="small"
                      label={`${docs.length} Document(s)`}
                      sx={{
                        backgroundColor: "rgba(56,189,248,0.18)",
                        color: "#7dd3fc",
                        fontWeight: 600,
                      }}
                    />
                  </Stack>

                  <Divider sx={{ borderColor: "#1e293b" }} />

                  {docs.map((doc) => (
                    <Stack
                      key={doc.id}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        background: "rgba(2,6,23,0.8)",
                        border: "1px solid #1e293b",
                      }}
                    >
                      <PictureAsPdfIcon sx={{ color: "#ef4444" }} />

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#e5e7eb",
                          flex: 1,
                        }}
                      >
                        {doc.file_url.split("/").pop()}
                      </Typography>

                      <Tooltip title="Open PDF">
                        <IconButton
                          size="small"
                          onClick={() => window.open(doc.file_url, "_blank")}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
