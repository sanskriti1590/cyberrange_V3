import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Backdrop,
  Box,
  Button,
  Skeleton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import fill from "../../../assests/Password.png";
import star from "../../../assests/Star.png";
import union from "../../../assests/Union.png";
import {
  endGame,
  gameDetailsApi,
  startGame,
} from "../../../APIConfig/CtfConfig";
import { toast } from "react-toastify";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Practice from "../../ViewScenariosCommon/ScenarioDetails/practice";
import HTMLRenderer from "../../../components/HtmlRendering";
import WinningWall from "../../../components/winningWall/WinningWall";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import LoaderImg from "../../../components/ui/loader";
import ErrorHandler from "../../../ErrorHandler";

export const LongText = ({ content, limit }) => {
  const [showAll, setShowAll] = useState(false);

  if (!content) return null;
  if (content.length <= limit) return <div>{content}</div>;

  return (
    <div>
      {showAll ? content : content.substring(0, limit) + "..."}
      <Button
        variant="text"
        color="secondary"
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? "Read less" : "Read more"}
      </Button>
    </div>
  );
};

const Gamedetails = () => {
  const [value, setValue] = React.useState("1");
  const [isActive, setIsActive] = useState(false);
  const [reload, setReload] = useState(false);
  const [datas, setData] = useState({});
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const lastValue = location?.pathname?.split("/").pop();

  const handleTabChange = (event, newValue) => setValue(newValue);

  useEffect(() => {
    const getValue = async () => {
      try {
        setIsActive(true);
        const response = await gameDetailsApi(lastValue);
        if (response?.data) setData(response.data);
      } catch (err) {
        ErrorHandler(err);
      } finally {
        setIsActive(false);
        setLoading(false);
      }
    };
    getValue();
  }, [reload, lastValue]);

  const apiStart = async () => {
    try {
      setIsActive(true);
      const response = await startGame(lastValue);
      if (response) toast.success(response.data.message);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsActive(false);
    }
  };

  const endGameConsole = async (id) => {
    try {
      setIsActive(true);
      await endGame(id);
      setReload(!reload);
    } catch (err) {
      ErrorHandler(err);
    } finally {
      setIsActive(false);
    }
  };

  const getConsoleData = (id) => {
    navigate(`/machineProfile/${id}`);
  };

  const machineDetails = {
    ctf_walkthrough: [datas?.ctf_walkthrough],
    flagsInformation: `Number of flags : ${datas?.ctf_flag_count}`,
    resources:
      datas?.ctf_rules_regulations ||
      `<p>Fair Play: Participants must adhere to the principles of fair play...</p>`,
    prerequisites:
      datas?.ctf_flags_information ||
      `<p>Basic Networking Knowledge: Understanding networking concepts...</p>`,
  };

  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    { name: "Solo", link: "/categories/soloCategory" },
    { name: "Solo Details" },
  ];

  const hasData = datas && Object.keys(datas).length > 0;

  return (
    <Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <LoaderImg />
      </Backdrop>

      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <Stack spacing={2} margin={5}>
        <Stack sx={{ backgroundColor: "custom.main", gap: 1, mb: 5 }}>
          <Stack
            direction="row"
            sx={{
              border: "1px solid #12464C",
              borderRadius: "16px",
              padding: 3,
              gap: 2,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={180} />
            ) : !hasData ? (
              <Stack
                width="100%"
                height="150px"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="h6" color="text.white">
                  No data available
                </Typography>
              </Stack>
            ) : (
              <>
                <img
                  src={datas?.ctf_thumbnail}
                  alt="Game Thumbnail"
                  style={{ width: "147px", height: "147px" }}
                />

                <Stack width="100%">
                  <Stack
                    width="100%"
                    justifyContent="space-between"
                    direction="row"
                  >
                    <Typography variant="h1">{datas?.ctf_name}</Typography>
                    <Stack direction="row" gap={3}>
                      {datas?.ctf_is_ready ? (
                        <Stack direction="row" gap={2}>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => getConsoleData(datas?.ctf_game_id)}
                          >
                            Resume
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => endGameConsole(datas?.ctf_game_id)}
                          >
                            End
                          </Button>
                        </Stack>
                      ) : (
                        <Button variant="contained" onClick={apiStart}>
                          Join Now
                        </Button>
                      )}
                    </Stack>
                  </Stack>

                  <Stack direction="row" gap={2} mb={2}>
                    <Stack direction="row" gap="6px" alignItems="center">
                      <img src={fill} width="16px" height="16px" alt="" />
                      <Typography>{datas?.ctf_assigned_severity}</Typography>
                      <Box backgroundColor="white" height="18px" width="1px" />
                    </Stack>
                    <Stack direction="row" gap="6px" alignItems="center">
                      <img src={star} width="16px" height="16px" alt="" />
                      <Typography>{datas?.ctf_score} Points</Typography>
                      <Box backgroundColor="white" height="18px" width="1px" />
                    </Stack>
                    <Stack direction="row" gap="6px" alignItems="center">
                      <img src={union} width="16px" height="16px" alt="" />
                      <Typography>{datas?.ctf_players_count}</Typography>
                    </Stack>
                  </Stack>

                  {hide ? (
                    <Stack sx={{ width: "100%" }}>
                      <Typography>
                        {datas?.ctf_description
                          ?.replace(/(<([^>]+)>)/gi, "")
                          .substring(0, 250)}
                      </Typography>
                      <Typography
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "#00FFFF",
                        }}
                        onClick={() => setHide(false)}
                      >
                        Read more
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack sx={{ width: "100%" }}>
                      <HTMLRenderer htmlContent={datas?.ctf_description} />
                      <Typography
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          color: "#00FFFF",
                        }}
                        onClick={() => setHide(true)}
                      >
                        Read less
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </>
            )}
          </Stack>
        </Stack>

        {/* Tab and Practice Section */}
        {hasData && (
          <Stack direction="row" gap={2}>
            {/* Tabs */}
            <Stack
              sx={{
                backgroundColor: "background.secondary",
                p: 2,
                borderRadius: "16px",
                width: "50%",
              }}
            >
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleTabChange}
                    textColor="#ffffff"
                    TabIndicatorProps={{ sx: { backgroundColor: "#b46228" } }}
                  >
                    <Tab label="Rules & Regulations" value="1" />
                    <Tab label="Flag Information" value="2" />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  <Stack
                    sx={{
                      backgroundColor: "custom.main",
                      borderRadius: "16px",
                      height: "500px",
                      overflow: "scroll",
                      px: 4,
                    }}
                  >
                    <HTMLRenderer htmlContent={machineDetails.resources} />
                  </Stack>
                </TabPanel>

                <TabPanel value="2">
                  <Stack sx={{ height: "500px", overflow: "scroll", px: 4 }}>
                    <HTMLRenderer htmlContent={machineDetails.prerequisites} />
                  </Stack>
                </TabPanel>
              </TabContext>
            </Stack>

            {/* Practice Section */}
            <Stack
              sx={{
                backgroundColor: "background.secondary",
                p: 2,
                borderRadius: "16px",
                width: "50%",
              }}
            >
              <Practice item={machineDetails.ctf_walkthrough} />
            </Stack>
          </Stack>
        )}

        {/* Winning Wall */}
        {datas?.winning_wall?.length > 0 && (
          <WinningWall
            template="winningWall"
            data={datas.winning_wall}
            header="Achievers"
          />
        )}
      </Stack>
    </Stack>
  );
};

export default Gamedetails;
