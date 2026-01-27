import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as React from "react";



const ScenarioMachine = ({ item }) => {
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      style={{
        width: "100%",
        gap: 24,
        backgroundColor: "#1C1F28",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      <Stack
        direction="row"
        sx={{ width: "98%" }}
        gap={1}
        onClick={() =>
          navigate(`/squad/scenarioDetails/${item.scenario_id}`, {
            state: { from: item.scenario_id },
          })
        }
      >
        {/* image */}
        <img
          src={item.scenario_thumbnail}
          alt="hello"
          style={{ width: "150px", height: "150px", borderRadius: "12px" }}
        />

        {/* details */}
        <Stack justifyContent="space-between" sx={{ my: 1, width: "100%" }}>
          <Stack direction="row" gap={1} sx={{ width: "100%" }}>
            <Typography variant="h3" flexWrap={1} width="60%">
              {item.scenario_name}
            </Typography>
            <Typography
              variant="body3"
              style={{
                color: "#BCBEC1 !important",
                backgroundColor: "#242833",
                borderRadius: "16px",
                height: "fit-content",
                padding: "4px 16px",
              }}
            >
              {item.scenario_assigned_severity}
            </Typography>
            <Typography
              variant="body3"
              style={{
                color: "#BCBEC1 !important",
                backgroundColor: "#242833",
                borderRadius: "16px",
                height: "fit-content",
                padding: "4px 16px",
              }}
              noWrap
            >
              {item.scenario_time} Hour
            </Typography>
          </Stack>

          <Typography variant="h5" sx={{ color: "#BCBEC1 !important" }}>
            {item.scenario_description
              .replace(/(<([^>]+)>)/gi, "")
              .substring(0, 200)}
          </Typography>


          {/* configration */}
          {/*<Stack direction="row" gap={5}>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="body3">vCPU</Typography>*/}
          {/*    <Typography>7</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="body3" noWrap>*/}
          {/*      Disk Space*/}
          {/*    </Typography>*/}
          {/*    <Typography>82 GB</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="body3">RAM</Typography>*/}
          {/*    <Typography noWrap>10 GB</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="body3">VMs</Typography>*/}
          {/*    <Typography>4</Typography>*/}
          {/*  </Stack>*/}
          {/*</Stack>*/}
        </Stack>
        <Typography
          variant="h5"
          sx={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            my: 1,
            minWidth: "100px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
        >
          {item.scenario_score} points
        </Typography>
      </Stack>
      {/* points */}
    </Stack>
  );
};

export default ScenarioMachine;
