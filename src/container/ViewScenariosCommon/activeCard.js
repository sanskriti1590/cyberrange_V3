import {
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import "./index.css";
import { endGame } from "../../APIConfig/CtfConfig";
import { useState } from "react";
import { getConsoleDetailsSenario } from "../../APIConfig/scenarioConfig";

export const LongText = ({ content, limit }) => {
  const [showAll, setShowAll] = useState(false);

  const showMore = () => setShowAll(true);
  const showLess = () => setShowAll(false);

  if (content?.length <= limit) {
    // there is nothing more to show
    return <div>{content}</div>;
  }
  if (showAll) {
    // We show the extended text and a link to reduce it
    return (
      <div>
        {content}
        <Button varaint="text" color="secondary" onClick={showLess}>
          Read less
        </Button>
      </div>
    );
  }
  // In the final case, we show a text with ellipsis and a `Read more` Button
  const toShow = content?.substring(0, limit) + "...";
  return (
    <div>
      {toShow}
      <Button varaint="text" color="secondary" onClick={showMore}>
        Read more
      </Button>
    </div>
  );
};

const ActiveCard = ({ items, screen, setLoad, load }) => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const data = items;

  const getConsole = async () => {
    setIsActive(true);
    const data = await getConsoleDetailsSenario(items.gameId);
    setIsActive(false);
    navigate("/scenarioConsole", { state: { data: data?.data } });
  };

  const endGameConsole = async () => {
    setIsActive(true);
    const value = await endGame(items.gameId);
    setIsActive(false);
    setLoad(!load);
  };

  return (
    <Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Link
        style={{ textDecoration: "none" }}
      //    to={screen !== "activegame" ? ("/squad/scenarioDetails") : ("/categories/gameDetails")}
      //    state={{ from: items.gameId }}
      >
        <Stack
          sx={{
            //   border: "1px solid #12464C",
            p: 3,
            marginTop: 2,
            borderRadius: "8px",
          }}
          backgroundColor={
            screen !== "dashboard" ? "background.secondary" : "custom.secondary"
          }
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            {screen !== "activegame" ? (
              <img
                src={data?.img}
                width="160px"
                height="211px"
                alt="no img"
                style={{ borderRadius: "16px" }}
              />
            ) : null}

            <Stack sx={{ display: "flex", width: "100%" }}>
              <Stack mb={1}>
                {screen !== "dashboard" ? (
                  <Chip
                    label={data?.category}
                    sx={{
                      width: "10%",
                      minWidth: "150px",
                      backgroundColor: "#393939",
                      height: "30px",
                    }}
                  />
                ) : null}
              </Stack>
              <Stack
                display="flex"
                justifyContent="space-between"
                direction="row"
              >
                {screen == "dashboard" ? (
                  <Stack direction="row" gap={2} alignItems="center">
                    <Stack
                      direction="row"
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <StarBorderPurple500Icon />
                      <Typography variant="body3" className="cardPoints" noWrap>
                        {data?.points} Points
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <TimerOutlinedIcon />
                      <Typography variant="body3" className="cardPoints" noWrap>
                        {data?.time} min
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <InsertChartOutlinedIcon />
                      <Typography variant="body3" className="cardPoints" noWrap>
                        {data?.severity}
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="row" gap={2} alignItems="center" noWrap>
                    <Typography variant="body1" className="cardPoints">
                      <StarBorderPurple500Icon sx={{ mb: -0.5 }} />
                      {data?.points} Points
                    </Typography>
                    <Typography variant="body1" className="cardPoints">
                      <TimerOutlinedIcon sx={{ mb: -0.5 }} />
                      {data?.time} Hour
                    </Typography>
                    <Typography variant="body1" className="cardPoints">
                      <InsertChartOutlinedIcon sx={{ mb: -0.5 }} />
                      {data?.severity}
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" gap={3}>
                  {screen == "activegame" ? (
                    <Stack direction="row" gap={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={getConsole}
                      >
                        Resume
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={endGameConsole}
                      >
                        End
                      </Button>
                    </Stack>
                  ) : null}

                  {/* <AccountTreeOutlinedIcon style={{ color: "#ffffff", marginTop: -32 }} /> */}
                </Stack>
              </Stack>
              <Stack mb={2}>
                <Typography variant="h1">{data?.scenarioName}</Typography>
                {screen == "dashboard" ? (
                  <Typography variant="body2">
                    {data?.description.length <= 50
                      ? data?.description
                      : data?.description.substr(0, 50) + "..."}
                  </Typography>
                ) : (
                  <Typography variant="body1" className="cardPoints">
                    <LongText content={data.description} limit={250} />
                  </Typography>
                )}
              </Stack>
              {screen !== "activegame" ? (
                <Stack
                  direction="row"
                  justifyContent={
                    screen !== "dashboard" ? null : "space-between"
                  }
                  alignItems="start"
                  width="100%"
                  gap={screen !== "dashboard" ? 2 : null}
                >
                  <Stack alignItems="center">
                    <Typography variant="body2"
                      //  className="configuration"
                      style={{ color: "#00ffff" }}
                    >
                      CPU
                    </Typography>
                    <Typography variant="body1">
                      {/* {data?.cpu} */}
                      40vcp
                    </Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="body2"
                      //  className="configuration"
                      style={{ color: "#00ffff" }}
                    >
                      HD Space
                    </Typography>
                    <Typography variant="body1">
                      {/* {data?.hdSpace} */}
                      430GB
                    </Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="body2"
                      // className="configuration"
                      style={{ color: "#00ffff" }}>
                      RAM
                    </Typography>
                    <Typography variant="body1">
                      {/* {data?.ram} */}
                      80GB
                    </Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="body2"
                      //  className="configuration"
                      style={{ color: "#00ffff" }}>
                      Machine
                    </Typography>
                    <Typography variant="body1">
                      {/* {data?.machine} */}5
                    </Typography>
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
      </Link>
    </Box>
  );
};

export default ActiveCard;
