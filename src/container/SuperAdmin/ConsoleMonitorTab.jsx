import {
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  Button,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConsoleTeamVersion2 } from "../../APIConfig/version2Scenario";
import { getSuperAdminConsoleMonitor } from "../../APIConfig/SuperAdminConfig";

const ConsoleMonitorTab = ({ activeScenarioId }) => {
  const [teamData, setTeamData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (activeScenarioId) {
      loadTeams();
    }
  }, [activeScenarioId]);

const loadTeams = async () => {
  try {
    setTeamData({});   //

    const res = await getSuperAdminConsoleMonitor({
  active_scenario_id: activeScenarioId
});
    if (res?.data) {
      setTeamData(res.data);
    }
  } catch (err) {
    console.error("Failed loading team console data");
  }
};

  // Group by team
  const groupedByTeam =
    teamData?.participants_data?.reduce((acc, p) => {
      const team = p.team_group || "UNASSIGNED";
      if (!acc[team]) acc[team] = [];
      acc[team].push(p);
      return acc;
    }, {}) || {};

  return (
    <Stack spacing={3}>
      <Typography fontSize={18} fontWeight={900}>
        Console Monitor (Team-wise)
      </Typography>

      {Object.entries(groupedByTeam).map(([team, players]) => (
        <Accordion key={team}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography fontWeight={800}>{team}</Typography>
              <Chip label={`${players.length} Players`} size="small" />
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2}>
              {players.map((p) => (
                <Grid item xs={12} md={4} key={p.participant_id}>
                  <Card
                    sx={{
                      p: 2,
                      border: "1px solid rgba(148,163,184,0.2)",
                    }}
                  >
                    <Typography fontWeight={800}>
                      {p.participant_name}
                    </Typography>

                    <Typography fontSize={12} color="#94a3b8">
                      ID: {p.participant_id}
                    </Typography>

                    <Typography fontSize={12} mt={1}>
                      Role: {p.role || "N/A"}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() =>
                        navigate(
                          `/activeGameScenario/consolePage/${teamData?.active_scenario_id}/${p.participant_id}`
                        )
                      }
                    >
                      View Console
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
};

export default ConsoleMonitorTab;