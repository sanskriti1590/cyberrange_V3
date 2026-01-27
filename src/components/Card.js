import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { useNavigate, useParams, Link } from "react-router-dom";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import "./index.css";
import { endGame, getConsoleDetails } from "../APIConfig/CtfConfig";
import { useState } from "react";

import HTMLRenderer from "./HtmlRendering";
import { endGameWebScenario } from "../APIConfig/webScenarioConfig";

export const LongText = ({ content, limit }) => {
  const [showAll, setShowAll] = useState(false);

  const showMore = () => setShowAll(true);
  const showLess = () => setShowAll(false);

  if (content?.length <= limit) {
    // there is nothing more to show
    return <HTMLRenderer htmlContent={content} />;
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

const Card = ({ items, screen, setLoad, load, key }) => {
  const [isActive, setIsActive] = useState(false);
  const [hide, setHide] = useState(true);
  const navigate = useNavigate();

  const data = items;

  const getConsole = () => {
    // setIsActive(true);
    // const data = await getConsoleDetails(items?.gameId);
    // setIsActive(false);
    navigate(`/machineProfile/${items?.gameId}`);
  };

  const getConsole_webscenario = () => {
    // setIsActive(true);
    // const data = await getConsoleDetails(items?.gameId);
    // setIsActive(false);
    navigate(`/consoleWebScenario/${items?.uniqeId}`);
  };

  const endGameConsole_webscenario = async () => {
    setIsActive(true);
    const value = await endGameWebScenario(items?.gameId, items?.uniqeId);
    setIsActive(false);
    setLoad(!load);
  };

  const endGameConsole = async () => {
    setIsActive(true);
    const value = await endGame(items?.gameId);
    setIsActive(false);
    setLoad(!load);
  };

  return (
    <Box key={key}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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
        <Stack direction="row" gap={2}>
          {screen !== "activegame" ? (
            <img
              src={data?.img}
              width="160px"
              height="251px"
              alt="no img"
              style={{ borderRadius: "16px", marginTop: 9 }}
            />
          ) : null}

          <Stack sx={{ width: "100%" }}>
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
            <Stack direction="row" justifyContent="space-between">
              {screen == "dashboard" ? (
                <Stack direction="row" gap={2}>
                  <Stack
                    direction="row"
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <StarBorderIcon style={{ color: "#acacac" }} />
                    <Typography variant="body3" className="cardPoints" noWrap>
                      {data?.points} Points
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <TimerOutlinedIcon style={{ color: "#acacac" }} />
                    <Typography variant="body3" className="cardPoints" noWrap>
                      {data?.time} Hour
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <InsertChartOutlinedIcon style={{ color: "#acacac" }} />
                    <Typography variant="body3" className="cardPoints" noWrap>
                      {data?.severity}
                    </Typography>
                  </Stack>
                </Stack>
              ) : (
                <Stack direction="row" gap={2} alignItems="center" noWrap>
                  <Typography variant="body1" className="cardPoints">
                    <StarBorderIcon
                      sx={{ mb: -0.5 }}
                      style={{ color: "#acacac" }}
                    />
                    {data?.points} Points
                  </Typography>
                  <Typography variant="body1" className="cardPoints">
                    <TimerOutlinedIcon
                      sx={{ mb: -0.5 }}
                      style={{ color: "#acacac" }}
                    />
                    {data?.time} Hour
                  </Typography>
                  <Typography variant="body1" className="cardPoints">
                    <InsertChartOutlinedIcon
                      sx={{ mb: -0.5 }}
                      style={{ color: "#acacac" }}
                    />
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

                {screen == "activegame_webscenario" && (
                  <Stack direction="row" gap={2}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={getConsole_webscenario}
                    >
                      Resume
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={endGameConsole_webscenario}
                    >
                      End
                    </Button>
                  </Stack>
                )}

                {/* <AccountTreeOutlinedIcon style={{ color: "#ffffff", marginTop: -32 }} /> */}
              </Stack>
            </Stack>
            <Stack mb={2}>
              <Typography variant="h1">
                {data?.scenarioName.length <= 30
                  ? data?.scenarioName
                  : data?.scenarioName.substr(0, 30) + "..."}
              </Typography>
              {hide ? (
                <Stack sx={{ width: "100%" }}>
                  <Typography>
                    {data?.description
                      ?.replace(/(<([^>]+)>)/gi, "")
                      .substring(0, 250)}
                  </Typography>
                  <Typography
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={() => setHide(!hide)}
                  >
                    Read More
                  </Typography>
                </Stack>
              ) : (
                <Stack sx={{ width: "100%" }}>
                  <HTMLRenderer htmlContent={data?.description} />
                  <Typography
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "red",
                    }}
                    onClick={() => setHide(!hide)}
                  >
                    Read less
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Card;
