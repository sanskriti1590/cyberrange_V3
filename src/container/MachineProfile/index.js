import { Backdrop, Box, Button, Menu, Stack, Tooltip, Typography, } from "@mui/material";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Popup from "./popup";
import { endGame, extendTime, getConsoleDetails, getCtfIpAddress, submitFlag, } from "../../APIConfig/CtfConfig";
import { toast } from "react-toastify";
import { useScreenshot } from 'use-react-screenshot'
import ProgressBars from "../../components/ProgressBar";
import AddIcon from '@mui/icons-material/Add';
import './index.css'
import { Icons } from "../../components/icons";
import CustomModal from "../../components/ui/CustomModal";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom/dist";
import CountdownTimer from "./Timer";
import ErrorHandler from "../../ErrorHandler";



const MachineProfile = () => {
  const navigate = useNavigate();
  // const ref = createRef(null)
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(true);
  const [Data, setScore] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [ip, setIp] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const { machineId } = useParams()
  const [endtime, setEndtime] = useState('');
  const [consoleData, setConsoleUrl] = useState("");
  const [hasCountdownEnded, setHasCountdownEnded] = useState(false);

  useEffect(() => {
    const getValue = async () => {
      try {

        setIsActive(true)
        const data = await getConsoleDetails(machineId);
        if (data?.data) {
          setData(data?.data)
          setEndtime(data?.data?.ctf_end_time)
          setConsoleUrl(data?.data?.ctf_attacker_console_url)
        }

        setIsActive(false)
      } catch (error) {
        ErrorHandler(error)
        navigate('/error/pageNotFound')
      }

    }
    if (machineId) {
      getValue()
    }

  }, [])


  const gameId = data?.ctf_game_id;
  // const startTime = data?.ctf_start_time;
  const startTime = Date.now(); // Current timestamp
  const endTime = data?.ctf_end_time; // Set end time to 1 hour from start time
  const endGameConsole = async () => {
    setIsActive(true);
    const value = await endGame(data?.ctf_game_id);

    value && setScore(value);
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
      if (machineId && endtime) {
        endGameConsole();
      }

    }, difference);

    return () => {
      clearTimeout(timeOut);
    };
  }, [endtime]);

  let difference;
  const calculateTimeLeft = () => {
    difference = +new Date(endtime * 1000) - +new Date();
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

  // get ip
  const ipChange = async () => {
    setIsActive(true);
    const res = await getCtfIpAddress(data?.ctf_game_id)
    res?.data && setIp(res?.data?.ctf_target_private_ip)
    setIsActive(false);
  };

  // refresh the consoleUrl
  const refreshConsole = async () => {
    setIsActive(true);
    const res = await getConsoleDetails(data?.ctf_game_id);

    res?.data?.ctf_attacker_console_url && setConsoleUrl(res?.data?.ctf_attacker_console_url);
    setIsActive(false);
  };

  // submit flag
  const submitResponse = async () => {
    if (inputValue == "") {
      toast.error("Please submit a flag");
      return;
    }

    setIsActive(true);
    const response = await submitFlag(data?.ctf_game_id, inputValue);
    if (response?.data?.ctf_archive_game_id) {
      setIsActive(false);
      toast.success("congratulations you have captured all flags");
      setScore(response);
      setInputValue("");
      setOpen(true);
    } else if (response?.status == 201) {
      setIsActive(false);
      if (response?.data?.is_flag_correct) {
        setShowArrowIcon(false);
        setShowTickIcon(true);
        setInputValue("");
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } else {
      setIsActive(false);
      toast.error(response?.data?.message);
    }
  };

  // extend time
  const extend_time = async () => {
    try {
      const response = await extendTime(data?.ctf_game_id);
      if (response?.data?.ctf_end_time) {
        setEndtime(response?.data?.ctf_end_time);
        toast.success("15 minutes has been added to your timer.");
      }

    } catch (error) {
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

  const [screenCapture, setscreenCapture] = useState("");
  const iframeRef = useRef(null);
  const handleScreenCapture = (screenCapture) => {
    setscreenCapture(screenCapture);
  };

  const setInputValueHandle = (e) => {
    const input = e.target.value.replace(/\s/g, "");
    setInputValue(input);
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
    if (ip?.length > 0) {
      setAnchorEl(target);
    } else {
      ipChange()
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
        <Stack sx={{ width: (full) ? "28%" : "0%", transition: (full) ? 'width 0.3s ease-out' : 'width 0.3s ease-in' }}
          height='95vh' style={{ overflowY: 'scroll', scrollbarWidth: 'none' }} className="example">
          <Stack gap={3} sx={{ position: 'sticky', top: 0 }}>
            {/* top section */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Popup
                id={data?.ctf_game_id}
                setOpen={setOpen}
                open={open}
                endGameConsole={endGameConsole}
                data={Data}
              />
              <Stack direction='row' gap={1} alignItems='center'>
                <Tooltip title='Refresh'>
                  <Icons.refresh onClick={refreshConsole} style={{ fontSize: '24px', cursor: 'pointer' }} />
                </Tooltip>
                <Icons.doubleLeftArrow style={{ fontSize: '36px', cursor: 'pointer' }} onClick={() => setFull(!full)} />
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

            {/* time section */}
            <Stack gap={1}>
              <CountdownTimer startTime={data?.ctf_start_time} endTime={endtime || endTime} endGameConsole={endGameConsole} setHasCountdownEnded={setHasCountdownEnded} hasCountdownEnded={hasCountdownEnded} />
              <ProgressBars endTime={endtime} startTime={data?.ctf_start_time} />
              <Stack direction='row' justifyContent='center' alignItems='center' sx={{
                backgroundColor: "primary.light",
                width: 'fit-content',
                minWidth: '108px',
                my: 1,
                padding: '4px 6px',
                borderRadius: '4px',
                cursor: 'pointer'
              }} onClick={extend_time}>
                <AddIcon sx={{ color: '#00FFFF !important', fontSize: '12px' }} />
                <Typography variant='h5' ml={0.5} sx={{ color: '#00FFFF !important' }}>
                  Extend Time
                </Typography>
              </Stack>
            </Stack>
            {/* ip address section */}
            <Stack direction="row" alignItems="center" gap={1}>
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
                  <Stack direction='row' justifyContent='center' alignItems='center'
                    borderBottom='1px solid #EAEAEB' padding={1} sx={{ width: '214px' }}>
                    <Typography variant='h5' sx={{ color: '#EAEAEB !important' }}>
                      {ip}
                    </Typography>
                  </Stack>
                </Menu>
              </Stack>
            </Stack>

            {/* ctf details */}

            <Stack p={2} gap={2} sx={{ backgroundColor: '#16181F', borderRadius: '12px' }}>
              <Stack direction='row' justifyContent='start' alignItems='center' spacing={1}>
                <Icons.userPin style={{ fontSize: '24px', color: '#BCBEC1' }} />
                <Typography variant='h4' sx={{ color: '#BCBEC1 !important' }}>User Name : </Typography>
                <Typography variant='h4' sx={{ color: '#BCBEC1 !important' }}>{data?.ctf_attacker_username}</Typography>
              </Stack>

              <Stack direction='row' justifyContent='start' alignItems='center' spacing={1}>
                <Icons.key style={{ fontSize: '24px', color: '#BCBEC1' }} />
                <Typography variant='h4' sx={{ color: '#BCBEC1 !important' }}>Password : </Typography>
                <Typography variant='h4' sx={{ color: '#BCBEC1 !important' }}>{data?.ctf_attacker_password}</Typography>
              </Stack>

              <Stack sx={{ borderBottom: '1px solid #535660' }}></Stack>

              <Stack direction='column-reverse' justifyContent='start' alignItems='start'>
                <Typography variant='h4'>Walkthrough</Typography>
                <Stack direction='row' justifyContent='start' alignItems='center' spacing={4} p={2}>
                  {
                    data?.ctf_walkthrough?.map((item, index) => {
                      return (
                        <Icons.pdf key={index} style={{ fontSize: '24px', color: '#BCBEC1', cursor: 'pointer' }}
                          onClick={() => window.open(item, '_blank')} />
                      )
                    })
                  }
                </Stack>
              </Stack>

              <Stack sx={{ borderBottom: '1px solid #535660' }}></Stack>

              <Typography variant='h3' sx={{ fontSize: '20px !important' }}> {data?.ctf_name}</Typography>

              <Stack direction='row' justifyContent='start' alignItems='center' spacing={2}>
                <Stack direction='row' justifyContent='start' alignItems='center' spacing={0.5}>
                  <Icons.shield style={{ fontSize: '24px', color: '#BCBEC1' }} />
                  <Typography variant='h5'
                    sx={{ color: '#BCBEC1 !important' }}>{data?.ctf_assigned_severity}</Typography>
                </Stack>
                <Stack direction='row' justifyContent='start' alignItems='center' spacing={0.5}>
                  <Icons.userCheck style={{ fontSize: '24px', color: '#BCBEC1' }} />
                  <Typography variant='h5'
                    sx={{ color: '#BCBEC1 !important' }}>{data?.ctf_players_count}</Typography>
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
                  {data?.ctf_score} Points
                </Typography>
              </Stack>

              <Stack direction='row' justifyContent='start' alignItems='center' spacing={0.5}>
                <Icons.show style={{ fontSize: '24px', color: '#92E7E1', cursor: 'pointer' }} />
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
              {
                openModal &&
                (<CustomModal open={openModal} onClose={closeModalHandler} sx={{ pb: 5 }}>
                  <Box sx={{ color: '#BCBEC1' }} dangerouslySetInnerHTML={{ __html: data?.ctf_description }} />
                </CustomModal>)
              }
              <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                <Box sx={{ color: '#BCBEC1 ' }} dangerouslySetInnerHTML={{ __html: data?.ctf_description }} />
              </Box>
            </Stack>
          </Stack>
        </Stack>
        {/* setfull screen button */}
        <Tooltip title="Details Page" placement="top">
          <Icons.doubleRightArrow
            style={{ fontSize: '36px', cursor: 'pointer', width: (full) ? '0%' : '2.5%' }}
            onClick={() => setFull(!full)} />
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
          direction="row"
        >
          <iframe
            ref={iframeRef}
            src={consoleData}
            title="Tutorials"
            style={{ width: "100%", height: "100%" }}
            allow="same-origin"
          ></iframe>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MachineProfile;
