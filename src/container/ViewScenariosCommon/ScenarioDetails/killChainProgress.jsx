//Kill chain progress on player console for cyberdrill  or /Kill chain progress on participant console for cyberdrill 
import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function KillChainPhase({
  killChainProgress = [],
  currentPhaseId,
  onPhaseClick,
}) {
  const phases = Array.isArray(killChainProgress) ? killChainProgress : [];

  const currentIndex = useMemo(() => {
    if (currentPhaseId) {
      return phases.findIndex((p) => p.phase_id === currentPhaseId);
    }
    return phases.findIndex((p) => !p.is_complete);
  }, [phases, currentPhaseId]);

  const completedCount = phases.filter((p) => p.is_complete).length;
  const completedPercent =
    phases.length > 0 ? (completedCount / phases.length) * 100 : 0;

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        p: 2,
        borderRadius: 2,
        background: "rgba(2,6,23,0.85)",
        border: "1px solid rgba(148,163,184,0.18)",
      }}
    >
      {/* Header */}
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(226,232,240,0.95)",
          mb: 1,
        }}
      >
        Kill Chain Phases ({completedCount}/{phases.length} Phases)
      </Typography>

      {/* Progress Line */}
      <Box sx={{ position: "relative", py: 4 }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 2,
            background: "rgba(148,163,184,0.25)",
            transform: "translateY(-50%)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: 2,
            width: `${completedPercent}%`,
            background: "rgba(20,184,166,0.95)",
            transform: "translateY(-50%)",
            transition: "width 0.5s ease",
            zIndex: 0,
          }}
        />

        {/* Phase Nodes */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          {phases.map((phase, index) => {
            const isCompleted = phase.is_complete;
            const isCurrent =
              phase.phase_id === currentPhaseId ||
              (!currentPhaseId && index === currentIndex);

            const submittedFlags =
              phase.flags?.filter((f) => f.is_submitted).length || 0;
            const totalFlags = phase.flags?.length || 0;

            return (
              <Box
                key={phase.phase_id}
                onClick={() => onPhaseClick?.(phase.phase_id)}
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover .phase-circle": {
                    transform: "scale(1.1)",
                  },
                  "&:hover .phase-tooltip": {
                    opacity: 1,
                  },
                }}
              >
                {/* Circle */}
                <Box
                  className="phase-circle"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    transition: "all 0.3s ease",
                    background: isCompleted
                      ? "rgba(20,184,166,0.95)"
                      : isCurrent
                      ? "rgba(2,6,23,1)"
                      : "rgba(15,23,42,1)",
                    color: isCompleted
                      ? "#001014"
                      : "rgba(226,232,240,0.9)",
                    border: isCompleted || isCurrent
                      ? "2px solid rgba(20,184,166,0.95)"
                      : "2px solid rgba(148,163,184,0.35)",
                    boxShadow: isCurrent
                      ? "0 0 0 6px rgba(20,184,166,0.2)"
                      : "none",
                  }}
                >
                  {isCompleted ? (
                    <CheckIcon sx={{ fontSize: 20 }} />
                  ) : (
                    index + 1
                  )}
                </Box>

                {/* Phase Name */}
                <Typography
                  sx={{
                    position: "absolute",
                    top: "48px",
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    color: isCompleted
                      ? "rgba(20,184,166,0.95)"
                      : isCurrent
                      ? "rgba(226,232,240,0.95)"
                      : "rgba(226,232,240,0.6)",
                  }}
                >
                  {phase.phase_name}
                </Typography>

                {/* Tooltip */}
                <Box
                  className="phase-tooltip"
                  sx={{
                    position: "absolute",
                    top: "-36px",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: 1.5,
                    px: 1,
                    py: 0.5,
                    fontSize: 11,
                    color: "rgba(226,232,240,0.9)",
                    whiteSpace: "nowrap",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                  }}
                >
                  {submittedFlags}/{totalFlags} flags
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}