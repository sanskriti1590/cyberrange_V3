import * as React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Wtable.css";
import truncateString from "../../utilities/truncateString";

export default function Wtable({ mem }) {
  const navigate = useNavigate();
  const MAX_CHAR_LENGTH = 10;

  const handleClick = async (user_id) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate(`/playerProfile/${user_id}`)
    }
  };

  const heading = [
    { title: "Name", align: "left" },
    { title: "Squad-Score", align: "right" },
    { title: "Solo-Score", align: "right" },
    { title: "Role", align: "right" },
  ];

  return (
    <Stack sx={{ width: "100%", marginTop: 4 }}>
      <Stack
        direction="row"
        sx={{
          bgColor: "primary.other",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {heading.map((item, index) => {
          return (
            <Typography
              key={index}
              width="25%"
              textAlign={item.title == "Name" ? "left" : "center"}
              style={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
              }}
              variant="h4"
            >
              {item.title}
            </Typography>
          );
        })}
      </Stack>

      <Stack
        sx={{
          width: "100%",
          gap: 2,
          alignItems: "center",
          mt: 2,
          overflow: "scroll",
          height: "400px",
        }}
        className="example"
      >
        {mem && mem.length > 0 ? (
          mem?.map((row, index) => (
            <Stack
              direction="row"
              key={row?.user_id}
              sx={{
                overflow: "visible",
                backgroundColor: index % 2 == 0 ? "#1C1F28" : null,
                width: "100%",
                alignItems: "center",
                height: "48px",
                borderRadius: index % 2 == 0 ? "12px" : "0px",
                py: 4,
                px: 1,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.01)",
                },
              }}
              onClick={() => handleClick(row.user_id)}
            >
              {/* profile with name */}
              <Stack direction="row" sx={{ gap: 1, width: "25%" }}>
                <Box
                  component="img"
                  src={row?.user_avatar}
                  alt="image"
                  sx={{ width: "24px", height: "24px", cursor: "default" }}
                />
                <Typography sx={{ textAlign: "left", overflow: 'hidden' }}>
                  {truncateString(row?.user_full_name, MAX_CHAR_LENGTH)}
                </Typography>
              </Stack>
              {/* scenario score */}
              <Typography sx={{ textAlign: "center", width: "25%" }}>
                {row.user_profile_detail.user_scenario_score}
              </Typography>
              {/* ctf score */}
              <Typography sx={{ textAlign: "center", width: "25%" }}>
                {row.user_profile_detail.user_ctf_score}
              </Typography>
              <Typography sx={{ textAlign: "center", width: "25%" }}>
                {row.user_role}
              </Typography>
            </Stack>
          ))
        ) : (
          <Typography variant="h3" sx={{ textAlign: "center", mt: "50px" }}>
            No result found
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
