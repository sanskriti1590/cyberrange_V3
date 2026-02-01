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
import { useState } from "react";
import {
  getConsoleDetailsSenario,
  endGame,
} from "../../../APIConfig/scenarioConfig";
import HTMLRenderer from "../../../components/HtmlRendering";
import {
  downloadReport,
  endGameV2,
  getConsoleVersion2,
} from "../../../APIConfig/version2Scenario";
import CustomModal from "../../../components/ui/CustomModal";
import { Icons } from "../../../components/icons";
import { Download } from "@mui/icons-material";
import { toast } from "react-toastify";
import ErrorHandler from "../../../ErrorHandler";

export const LongText = ({ content, limit }) => {
  const [showAll, setShowAll] = useState(false);

  const showMore = () => setShowAll(true);
  const showLess = () => setShowAll(false);

  if (content?.length <= limit) {
    // there is nothing more to show
    return (
      <div>
        <HTMLRenderer htmlContent={content} />
      </div>
    );
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

const Card = ({
  items,
  screen,
  setLoad,
  load,
  variant,
  gameType,
  activeScenarioId,
  participantId,
}) => {
  const [isEnd, setIsEnd] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [hide, setHide] = useState(true);
  const navigate = useNavigate();

  const data = items;

  const getConsole = async () => {
    try {
      if (variant == "corporate") {
        setIsActive(true);
        const data = await getConsoleVersion2(items?.gameId);
        setIsActive(false);

        navigate(`/scenarioConsole/${items?.gameId}`, {
          state: { data: data?.data },
        });
      } else {
        setIsActive(true);
        const data = await getConsoleDetailsSenario(items?.gameId);
        setIsActive(false);
        navigate("/scenarioPage", { state: { data: data?.data } });
      }
    } catch (error) {
      ErrorHandler(error);
      setIsActive(false);
    }
  };

  const endGameConsole2 = async () => {
    setIsActive(true);
    try {
      const value = await endGameV2(items?.gameId);
      setIsEnd(true);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsActive(false);
    }
  };

  const endGameConsole = async () => {
    setIsActive(true);
    const value = await endGame(items?.gameId);
    setIsActive(false);
    setLoad(!load);
  };

  const downloadReportPDF = async (actScenId, userId) => {
    const data = await downloadReport(actScenId, userId);

    if (data) {
      navigate("/");
    }
  };


  return (
    <Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <CustomModal
        open={isEnd}
        sx={{ py: 5.5, maxWidth: "650px" }}
        hideCloseIcon
        disableExternalClick
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" color={"#EAEAEB !important"}>
            Your Game Ended Successfully.{" "}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            mt: "56px",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              navigate(`/report/${activeScenarioId}/${participantId}`);
              // downloadReportPDF(activeScenarioId, participantId);
            }}
          >
            Download Report
          </Button>
          <Button
            onClick={() => {
              setIsEnd(false);
              navigate("/");
            }}
          >
            Close Window
          </Button>
        </Box>
      </CustomModal>

      <Box
        style={{
          textDecoration: "none",
          cursor: screen == "activegame" ? "default" : "pointer",
        }}
        to={screen !== "activegame" ? "/squad/scenarioDetails" : null}
        state={{ from: items.gameId }}
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
                        onClick={
                          variant === "corporate"
                            ? endGameConsole2
                            : endGameConsole
                        }
                        sx={{ display: "none" }}
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

                {hide ? (
                  <Stack sx={{ width: "100%" , wordBreak:'break-word'}}>
                    <Typography>
                      {data?.description
                        ?.replace(/(<([^>]+)>)/gi, "")
                        .substring(0, 250)}
                    </Typography>
                    <Typography
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#00FFFF",
                        wordBreak:'break-word'
                      }}
                      onClick={() => setHide(!hide)}
                    >
                      Read more
                    </Typography>
                  </Stack>
                ) : (
                  <Stack sx={{ width: "100%", wordBreak:'break-word' }}>
                    <HTMLRenderer htmlContent={data?.description} />
                    <Typography
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#00FFFF",
                      }}
                      onClick={() => setHide(!hide)}
                    >
                      Read less
                    </Typography>
                  </Stack>
                )}

                {/* {
                    (screen == 'dashboard') ?
                      <Typography variant="body2">
                        {data?.description.length <= 50 ? data?.description.replace( /(<([^>]+)>)/ig, '') : (data?.description.substr(0, 50) + "...").replace( /(<([^>]+)>)/ig, '')}
  
                      </Typography>
                      :
  
                      <Typography variant="body1" className="cardPoints">
                        <LongText content={data.description} limit={250} />
                      </Typography>
                  } */}
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
                      style={{ color: "#00ffff" }}>
                      CPU
                    </Typography>
                    <Typography variant="body1">
                      {/* {data?.cpu} */}
                      40vcp
                    </Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography variant="body2"
                      // className="configuration"
                      style={{ color: "#00ffff" }}>
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
                    >
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
      </Box>
    </Box>
  );
};

export default Card;
