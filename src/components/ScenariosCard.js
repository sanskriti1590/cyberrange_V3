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


export const LongText = ({ content, limit }) => {
  const [showAll, setShowAll] = useState(false);

  const showMore = () => setShowAll(true);
  const showLess = () => setShowAll(false);

  if (content?.length <= limit) {
    // there is nothing more to show
    return <div>{content}</div>
  }
  if (showAll) {
    // We show the extended text and a link to reduce it
    return <div>
      {content}
      <Button varaint="text" color='secondary' onClick={showLess}>Read less</Button>
    </div>
  }
  // In the final case, we show a text with ellipsis and a `Read more` Button
  const toShow = content?.substring(0, limit) + "...";
  return <div>
    {toShow}
    <Button varaint="text" color='secondary' onClick={showMore}>Read more</Button>
  </div>
}

const Card = ({ items, screen, setLoad, load }) => {
  const [isActive, setIsActive] = useState(false)
  const navigate = useNavigate();

  const data = items;

  const getConsole = async () => {
    setIsActive(true);
    const data = await getConsoleDetails(items?.scenario_id);
    setIsActive(false);
    navigate("/machineProfile", { state: { data: data?.data } });
  };

  const endGameConsole = async () => {
    setIsActive(true);
    const value = await endGame(items?.scenario_id);
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
        style={{ textDecoration: "none", color: "#acacac" }}
        to={screen !== "activegame" ? ("/squad/scenarioDetails") : ("/categories/gameDetails")}
        state={{ from: items?.scenario_id }}
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
                src={data?.scenario_thumbnail}
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
                    label={data?.scenario_category_name}
                    sx={{
                      width: "10%",
                      minWidth: "250px",
                      backgroundColor: "#393939",
                      height: "30px",
                    }}
                  />
                ) : null}
              </Stack>
              <Stack display="flex" justifyContent="space-between" direction="row">
                {
                  (screen == 'dashboard') ?
                    <Stack direction="row" gap={2} alignItems="center">
                      <Stack direction='row' style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <StarBorderIcon />
                        <Typography variant="body3" className="cardPoints" noWrap>
                          {data?.scenario_score} Points
                        </Typography>
                      </Stack>
                      <Stack direction='row' style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TimerOutlinedIcon />
                        <Typography variant="body3" className="cardPoints" noWrap>

                          {data?.scenario_time} min
                        </Typography>
                      </Stack>
                      <Stack direction='row' style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <InsertChartOutlinedIcon />
                        <Typography variant="body3" className="cardPoints" noWrap>
                          {data?.scenario_assigned_severity}
                        </Typography>
                      </Stack>
                    </Stack>
                    :


                    <Stack direction="row" gap={2} alignItems="center" noWrap>
                      <Typography variant="body1" className="cardPoints">
                        <StarBorderIcon sx={{ mb: -0.5 }} />
                        {data?.scenario_score} Points
                      </Typography>
                      <Typography variant="body1" className="cardPoints">
                        <TimerOutlinedIcon sx={{ mb: -0.5 }} />
                        {data?.scenario_time} Hour
                      </Typography>
                      <Typography variant="body1" className="cardPoints">
                        <InsertChartOutlinedIcon sx={{ mb: -0.5 }} />
                        {data?.scenario_assigned_severity}
                      </Typography>
                    </Stack>
                }
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
                <Typography variant="h1">{data?.scenario_name}</Typography>
                {
                  (screen == 'dashboard') ?
                    <Typography variant="body2">
                      {data?.scenario_description?.length <= 50 ? data?.scenario_description : (data?.scenario_description.substr(0, 50) + "...")}

                    </Typography>
                    :

                    <Typography variant="body1" className="cardPoints">
                      <LongText content={data.scenario_description} limit={250} />
                    </Typography>
                }
              </Stack>

            </Stack>
          </Stack>
        </Stack>
      </Link>
    </Box>
  );
};

export default Card;
