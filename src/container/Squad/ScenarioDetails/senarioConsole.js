import {
  Backdrop,
  Box,
  Button,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
//   import Popup from "./popup";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import {
  endGame,
  getConsoleDetailsSenario,
  getScenarioIpAddress,
  submitFlag,
} from "../../../APIConfig/scenarioConfig";
import "./index.css";
import { Icons } from "../../../components/icons";
import CustomModal from "../../../components/ui/CustomModal";

const MachineProfileSenario = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(true);
  const [Data, setScore] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const iframeRef = useRef(null);
  const [ip, setIp] = useState([]);
  const location = useLocation();
  const data = location?.state?.data;
  const [consoleData, setConsoleUrl] = useState(data?.scenario_console_url);
  const gameId = location.state.data.scenario_game_id;
  const endTime = location.state.data.scenario_end_time;
  const [endtime, setEndtime] = useState(endTime);
  const endGameConsole = async () => {
    setIsActive(true);
    const value = await endGame(data?.scenario_game_id);
    navigate("/");
    setScore(value);
    setIsActive(false);
    setOpen(true);
  };



  // timer
  const getStartTime = (ms) => {
    let timeStamp = ms * 1000;
    let hours = new Date(timeStamp).getHours();
    let minutes = new Date(timeStamp).getMinutes();
    let seconds = new Date(timeStamp).getSeconds();

    return hours + ":" + minutes + ":" + seconds;
  };

  useEffect(() => {
    const difference = +new Date(endtime * 1000) - +new Date();
    let timeOut;
    timeOut = setTimeout(async () => {
      // endGameConsole();
    }, difference);

    return () => {
      clearTimeout(timeOut);
    };
  }, [endtime]);

  const calculateTimeLeft = () => {
    const difference = +new Date(endtime * 1000) - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  // refresh the consoleUrl
  const refreshConsole = async () => {
    setIsActive(true);
    const res = await getConsoleDetailsSenario(data?.scenario_game_id);
    res.data?.scenario_console_url && setConsoleUrl(res.data?.scenario_console_url);
    setIsActive(false);
  };

  // set console for white team
  const handleApi = (url) => {
    setConsoleUrl(url);
  };

  // submit flag
  const submitResponse = async () => {
    setIsActive(true);
    const response = await submitFlag(gameId, inputValue);
    if (response?.data?.scenario_archive_game_id) {
      setIsActive(false);
      toast.success("All tasks have been completed!");
      setScore(response);
      setInputValue("");

      setOpen(true);
    } else if (response?.data?.is_flag_correct) {
      setShowArrowIcon(false);
      setShowTickIcon(true);
      setInputValue("");
      setIsActive(false);
      toast.success(response?.data?.message);
    } else {
      setIsActive(false);
      toast.error(response?.data?.message);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [screenshotUrl, setScreenshotUrl] = useState("");

  const handleScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);

      const screenshot = await imageCapture.grabFrame();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = screenshot.width;
      canvas.height = screenshot.height;
      context.drawImage(screenshot, 0, 0);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setScreenshotUrl([...screenshotUrl, url]);
      }, "image/png");
    } catch (error) {
      console.error("Error capturing screen:", error);
    }
  };

  const removeProduct = (index) => {
    setScreenshotUrl([
      ...screenshotUrl.slice(0, index),
      ...screenshotUrl.slice(index + 1, screenshotUrl.length),
    ]);
  };

  const getActiveIp = async () => {
    setIsActive(true);
    try {
      const value = await getScenarioIpAddress(data?.scenario_game_id);
      value?.data?.scenario_instance_ip_list && setIp(value?.data?.scenario_instance_ip_list);
      setIsActive(false);
    } catch (error) {
      setIsActive(false);
      const obj = error.response.data.errors;

      for (let i in obj) {
        toast.error(
          i.charAt(0).toUpperCase() +
          i.slice(1).replace(/_/g, " ") +
          " - " +
          obj[i]
        );
      }
    }
  };

  const showAllClickHandler = () => {
    setOpenModal(true);
  };
  const closeModalHandler = () => {
    setOpenModal(false);
  };

  const [isFocused, setIsFocused] = useState(false);
  const [showArrowIcon, setShowArrowIcon] = useState(true);
  const [showTickIcon, setShowTickIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState("");
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    const target = event.currentTarget;
    if (ip.length > 0) {
      setAnchorEl(target);
    } else {
      getActiveIp()
        .then(() => {
          setAnchorEl(target);
        })
        .catch((error) => {
          console.error("Error in getActiveIp:", error);
        });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      submitResponse();

      setTimeout(() => {
        setShowArrowIcon(true);
        setShowTickIcon(false);
      }, 1000);
    }
  };

  return (
    <Stack margin={3} width="100%">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* container */}
      <Stack direction="row" gap={1}>
        {/* details section */}
        <Stack
          sx={{
            width: full ? "28%" : "0%",
            transition: full ? "width 0.3s ease-out" : "width 0.3s ease-in",
          }}
          height="95vh"
          style={{ overflowY: "scroll", scrollbarWidth: "none" }}
          className="example"
        >
          <Stack gap={3} sx={{ position: "sticky", top: 0 }}>
            {/* top section */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button variant="contained" onClick={endGameConsole}>
                End
              </Button>
              <Stack direction="row" gap={1} alignItems="center">
                <Tooltip title="Refresh">
                  <Icons.refresh
                    onClick={refreshConsole}
                    style={{ fontSize: "24px", cursor: "pointer" }}
                  />
                </Tooltip>
                <Icons.doubleLeftArrow
                  style={{ fontSize: "36px", cursor: "pointer" }}
                  onClick={() => setFull(!full)}
                />
              </Stack>
            </Stack>

            <Stack direction="row" gap={2} position="relative">
              <input
                placeholder="Enter Your Flag"
                style={{
                  width: "100%",
                  backgroundColor: "#1C1F28",
                  borderRadius: "8px",
                  height: "48px",
                  color: "#acacac",
                  border: "none",
                  padding: "12px 40px 12px 14px",
                }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.trimStart())}
                onFocus={() => {
                  setIsFocused(true);
                  setShowArrowIcon(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setShowArrowIcon(false);
                }}
                onKeyDown={handleKeyDown}
              />
              {isFocused && showArrowIcon && (

                <Icons.rightArrowCircle
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    color: "#acacac",
                    cursor: "pointer",
                  }}

                />
              )}
              {showTickIcon && (
                <Icons.checkCircle
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    fontSize: "20px",
                    color: "#00FFFF",
                    cursor: "pointer",
                  }}
                />
              )}
            </Stack>

            <Stack gap={2}>
              <Typography variant="h5" sx={{ color: "#BCBEC1 !important" }}>
                Browse to various IP’s to get started
              </Typography>

              <Stack direction="row" justifyContent="start" alignItems="center">
                <Button
                  variant="text"
                  sx={{
                    borderRadius: "4px 4px 0 0",
                    backgroundColor: "#002929 !important",
                    padding: "4px 60px",
                    borderBottom: "1px solid #00CCCC",
                  }}
                  aria-controls={openMenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? "true" : undefined}
                  onClick={handleClick}
                  endIcon={<Icons.downArrow />}
                >
                  IP Address
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {ip?.map((item, index) => {
                    return (
                      <Stack
                        direction="row"
                        justifyContent="start"
                        alignItems="center"
                        borderBottom="1px solid #EAEAEB"
                        padding={1}
                      >
                        <Typography
                          variant="h5"
                          sx={{ color: "#EAEAEB !important" }}
                        >
                          {item?.ip_address}
                        </Typography>
                        <Typography
                          variant="h5"
                          mx={1}
                          sx={{ color: "#EAEAEB !important" }}
                        >
                          -
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ color: "#EAEAEB !important" }}
                        >
                          {item?.instance_name}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Menu>
              </Stack>
            </Stack>
            <Stack
              p={2}
              gap={2}
              sx={{ backgroundColor: "#16181F", borderRadius: "12px" }}
            >
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={1}
              >
                <Icons.userPin style={{ fontSize: "24px", color: "#BCBEC1" }} />
                <Typography variant="h4" sx={{ color: "#BCBEC1 !important" }}>
                  User Name :{" "}
                </Typography>
                <Typography variant="h4" sx={{ color: "#BCBEC1 !important" }}>
                  {data?.scenario_username}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={1}
              >
                <Icons.key style={{ fontSize: "24px", color: "#BCBEC1" }} />
                <Typography variant="h4" sx={{ color: "#BCBEC1 !important" }}>
                  Password :{" "}
                </Typography>
                <Typography variant="h4" sx={{ color: "#BCBEC1 !important" }}>
                  {data?.scenario_password}
                </Typography>
              </Stack>

              <Stack sx={{ borderBottom: "1px solid #535660" }}></Stack>

              <Stack
                direction="column-reverse"
                justifyContent="start"
                alignItems="start"
              >
                <Typography variant="h4">Walkthrough</Typography>
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                  spacing={4}
                  p={2}
                >
                  {data?.scenario_walkthrough?.map((item, index) => {
                    return (
                      <Icons.pdf
                        key={index}
                        style={{
                          fontSize: "24px",
                          color: "#BCBEC1",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(item, "_blank")}
                      />
                    );
                  })}
                </Stack>
              </Stack>

              <Stack sx={{ borderBottom: "1px solid #535660" }}></Stack>

              <Typography variant="h3" sx={{ fontSize: "20px !important" }}>
                {" "}
                {data?.scenario_name}
              </Typography>

              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={2}
              >
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                  spacing={0.5}
                >
                  <Icons.shield
                    style={{ fontSize: "24px", color: "#BCBEC1" }}
                  />
                  <Typography variant="h5" sx={{ color: "#BCBEC1 !important" }}>
                    {data?.scenario_assigned_severity}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                  spacing={0.5}
                >
                  <Icons.userCheck
                    style={{ fontSize: "24px", color: "#BCBEC1" }}
                  />
                  <Typography variant="h5" sx={{ color: "#BCBEC1 !important" }}>
                    {data?.scenario_player_count}
                  </Typography>
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#111218 !important",
                    backgroundColor: "#00CCCC",
                    borderRadius: "16px",
                    padding: "4px 16px",
                    fontWeight: "700 !important",
                  }}
                >
                  {data?.scenario_score} Points
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={0.5}
              >
                <Icons.show
                  style={{
                    fontSize: "24px",
                    color: "#92E7E1",
                    cursor: "pointer",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: "#92E7E1 !important",
                    cursor: "pointer",
                  }}
                  onClick={showAllClickHandler}
                >
                  Show All
                </Typography>
              </Stack>
              {openModal && (
                <CustomModal open={openModal} onClose={closeModalHandler}>
                  <Box
                    sx={{ color: "#BCBEC1", height: "560px", overflow: "auto" }}
                    dangerouslySetInnerHTML={{
                      __html: data?.scenario_description,
                    }}
                  />
                </CustomModal>
              )}
              <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                <Box
                  sx={{ color: "#BCBEC1 " }}
                  dangerouslySetInnerHTML={{
                    __html: data?.scenario_description,
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        </Stack>
        {/* setfull screen button */}
        <Tooltip title="Details Page" placement="top">
          <Icons.doubleRightArrow
            style={{
              fontSize: "36px",
              cursor: "pointer",
              width: full ? "0%" : "2.5%",
            }}
            onClick={() => setFull(!full)}
          />
        </Tooltip>

        {/* iframe section */}
        <Stack
          style={{
            paddingTop: 4,
            paddingBottom: 4,
            display: "flex",
            width: !full ? "96%" : "78%",
            height: "95vh",
          }}
        >
          {/* <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                >
                    {
                        cat?.map((item, index) => {
                            return (
                                <Tab label={item.name} key={index} onClick={() => handleApi(item?.url)} />
                            )
                        })
                    }


                </Tabs> */}
          <iframe
            ref={iframeRef}
            src={consoleData}
            title="Tutorials"
            style={{ width: "100%", height: "100%" }}
            allow="same-origin"
          ></iframe>
        </Stack>
      </Stack>
      {/* iframe */}
      {/* <Stack
        style={{
          paddingTop: 4,
          paddingBottom: 4,
          display: "flex",
          width: !full ? "90vw" : "65vw",
          height: "95vh",
        }}
        position="fixed"
        // top={0}
        float="left"
        direction="row"
      >
        <iframe
          src={consoleData}
          title="Tutorials"
          style={{ width: "100%", height: "100%" }}
          allow="clipboard-read; clipboard-write"
        ></iframe>
      </Stack> */}

      {/* buttons and details combine */}
    </Stack>
  );
};

export default MachineProfileSenario;
