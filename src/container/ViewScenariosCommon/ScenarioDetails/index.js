import * as React from "react";
import { useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Chip,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import "../index.css";
import Practice from "./practice";
import Dialog from "@mui/material/Dialog";
import Form from "./Form";
import ListItem from "./ListItem";
import {
  scenarioDetails,
  scenarioStartGame,
  topologyDetails,
} from "../../../APIConfig/scenarioConfig";
import HTMLRenderer from "../../../components/HtmlRendering";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import NetworkGraph from "../../../components/NetworkGraph";
import WinningWall from "../../../components/winningWall/WinningWall";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import ErrorHandler from "../../../ErrorHandler";
import LoaderImg from "../../../components/ui/loader";

import ResponsiveDateTimePickers from "./ScheduleDateTimePickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScenarioDetails = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState("1");
  const [topology, setTopology] = React.useState({});
  const [isActive, setIsActive] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [diagram, setDiagram] = React.useState(false);
  const [mail, setMail] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [data, setData] = React.useState([]);
  const [machine, setMachine] = React.useState([]);
  const [hide, setHide] = React.useState(true);
  const [error, setError] = useState(false)
  const location = useLocation();

  const currentPath = location?.pathname;
  // Split the URL by slashes and get the last element
  const parts = currentPath.split("/");
  const lastValue = parts[parts.length - 1];
  const [calenderToggle, setCalenderToggle] = useState(false);
  const [joinToggle, setJoinToggle] = useState(false);

  const formatDate = (date) => {
    const formattedDate = `${date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  };
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
    return formattedTime;
  };

  const [selectedDate, setSelectedDate] = useState({
    date: formatDate(new Date()),
    time: formatTime(new Date()),
  });

  const handleSelectedDate = (date) => {
    setSelectedDate({
      date: formatDate(date),
      time: formatTime(date),
    });
  };

  const handleCalenderToggle = (toggle) => {
    setCalenderToggle(!toggle);
  };

  React.useEffect(() => {
    const getApi = async () => {
      try {
        setIsActive(true);
        const response = await scenarioDetails(lastValue);
        if (response?.data) {

          setData(response?.data);
          setMachine(response?.data?.scenario_instances_name_list);
          const response2 = await topologyDetails(response?.data?.scenario_id);
          setTopology(response2?.data);
        } else setError(true)

        setIsActive(false);
      } finally {
        // ✅ stop loading regardless of error or success
        setIsActive(false);
      }
    };
    getApi();
  }, []);


  // for handle join now button and open its dialog box
  const handleClickJoin = () => {
    setJoinToggle(true);
  };

  const handleClose = () => {
    // handledialog box schedule
    setOpen(false);
    // handle dialog box for join now
    setCalenderToggle(false);
    setJoinToggle(false);
  };


  const _handleSubmit = (data) => {
    //console.log("here i am");
    const { name, team } = data;
    if (name === "") {
      toast.error("E-mail is required");
      return;
    }
    if (team === "") {
      toast.error("Please select the machine");
      return;
    }

    const newMail = { name: [name], player_instance: [team] };
    setMail((prevMail) => [newMail, ...prevMail]);
    const filteredResult = machine.filter((name) => name != team);
    setMachine(filteredResult);
  };


  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const removemail = (index, f) => {
    //console.log("index", f);
    setMail((prevMail) => {
      const newMail = [...prevMail];
      newMail.splice(index, 1);
      return newMail;
    });
    setMachine((prevItems) => [...prevItems, f.player_instance]);
  };

  // start game
  const joinHandle = async () => {
    try {
      setIsActive(true);
      setJoinToggle(false);

      let arr = [];
      for (let i = 0; i < mail.length; i++) {
        let obj = {
          player_email: mail[i].name[0],
          player_instance: mail[i].player_instance[0],
        };
        arr.push(obj);
      }
      const myJSON = JSON.stringify(arr);
      const response = await scenarioStartGame(lastValue, myJSON);
      if (response) {
        setIsActive(false);
      }
      toast.success(response.data.message);
      // const id = response.data.scenario_game_id;
      // const response2 = await getConsoleDetailsSenario(id);
      // setIsActive(false);
      // navigate("/scenarioConsole", { state: { data: response2?.data } });
    } catch (error) {
      setIsActive(false);
      ErrorHandler(error, navigate);
    }
  };

  const scenariosData = [
    {
      id: data?.scenario_id,
      category: data.scenario_category_name,
      points: data.scenario_score,
      time: data.scenario_time,
      severity: data.scenario_assigned_severity,
      img: data.scenario_thumbnail,
      scenarioName: data.scenario_name,
      description: data?.scenario_description,
      cpu: data?.scenario_hardware_details?.vcpu,
      hdSpace: data?.scenario_hardware_details?.disk_size,
      ram: data?.scenario_hardware_details?.RAM,
      objectives: data.scenario_objectives,
      tool_technology: data.scenario_tool_technology,
      prerequisites: data.scenario_prerequisites,
      machine: data?.scenario_hardware_details?.vm_count,
    },
  ];

  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    {
      name: "Category",
      link: "/squad/scenarioCategory",
    },
    { name: "Detail Page", link: location.pathname },
  ];
  if (error) return <Stack sx={{ margin: 4, borderRadius: 3 }} height='80vh' direction="row" mb={4} alignItems="center" justifyContent='center'>
    <Typography variant="h4">
      Data Not Found
    </Typography>
    <ToastContainer />
  </Stack>
  return (
    <Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <LoaderImg />
      </Backdrop>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack spacing={2} display="flex" width="100%" justifyContent="center">
        {/* container */}
        <Stack
          sx={{ justifyContent: "center", width: "100%", alignItems: "center" }}
        >
          {/* box */}
          <Stack width="90%" justifyContent="center" gap={2}>
            {/* Heading */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h1" fontSize="40px">
                Excercise
              </Typography>
            </Stack>
            {/* scenario Details */}
            <Stack>
              <Box>
                {scenariosData?.map((data, index) => {
                  return (
                    <Stack
                      key={index}
                      sx={{
                        backgroundColor: "background.secondary",
                        //   border: "1px solid #12464C",
                        marginTop: 2,
                        borderRadius: "8px",
                      }}
                    >
                      <Stack direction="row" gap={4} p={3}>
                        <img
                          src={data.img}
                          width="160px"
                          height="211px"
                          alt="no img"
                          style={{ borderRadius: "16px" }}
                        />
                        <Stack sx={{ display: "flex", width: "100%" }}>
                          <Stack
                            mb={1}
                            direction="row"
                            justifyContent="space-between"
                          >
                            <Chip
                              label={data.category}
                              sx={{
                                width: "10%",
                                minWidth: "250px",
                                backgroundColor: "#393939",
                                height: "30px",
                              }}
                            />
                            <Stack direction="row" alignItems="center" gap={2}>
                              {/* <ExitToAppIcon style={{ color: "#ffffff" }} /> */}
                              {/* <AccountTreeOutlinedIcon style={{ color: "#ffffff" }} /> */}
                              <Stack>
                                <Box sx={{ display: "flex", gap: "8px" }}>
                                  {/* <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{width: "150px", height: "50px"}}
                                    onClick={handleClickOpen}
                                    //   onClick={() => navigate("/createscenario")}
                                  >
                                    Schedule
                                  </Button> */}
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ width: "150px", height: "50px" }}
                                    onClick={handleClickJoin}
                                  >
                                    Join Now
                                  </Button>
                                </Box>

                                {/* Schedule Now Dialog box */}
                                <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  maxWidth="xl"
                                  scroll="body"
                                >
                                  <Box
                                    p={2}
                                    sx={{
                                      backgroundColor: "background.secondary",
                                      maxWidth: "900px",
                                      display: "flex",
                                      gap: "10px",
                                      // justifyContent:''
                                    }}
                                  >
                                    {/* <Stack width="40%">
                                <DateTimePicker
                                  onChange={DTonChange}
                                  value={DTvalue}
                                />
                              </Stack> */}
                                    {/* <Calendar /> */}
                                    {!calenderToggle && (
                                      <Box
                                        sx={{
                                          width: "100%",
                                        }}
                                      >
                                        <ResponsiveDateTimePickers
                                          handleClose={handleClose}
                                          calenderToggle={calenderToggle}
                                          handleCalenderToggle={
                                            handleCalenderToggle
                                          }
                                          handleSelectedDate={
                                            handleSelectedDate
                                          }
                                        />
                                      </Box>
                                    )}

                                    {calenderToggle && (
                                      <Stack>
                                        <Typography variant="h2">
                                          Invite your friends
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          sx={{ color: "#9C9EA3 !important" }}
                                          mb={2}
                                        >
                                          Enter your friends' registered email
                                          IDs and assign roles to them for the
                                          scenario. Click "Join with Members" to
                                          send the invitations and start the
                                          game.
                                        </Typography>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            gap: "64px",
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              gap: "2px",
                                            }}
                                          >
                                            <CalendarMonthIcon />
                                            {selectedDate.date}{" "}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              gap: "2px",
                                            }}
                                          >
                                            <AccessTimeIcon />
                                            {selectedDate.time}
                                          </Typography>
                                          <Button
                                            variant="text"
                                            onClick={() =>
                                              handleCalenderToggle(
                                                calenderToggle
                                              )
                                            }
                                          >
                                            Edit
                                          </Button>
                                        </Box>

                                        <Stack>
                                          <Stack gap={2}>
                                            <Form
                                              onSubmit={_handleSubmit}
                                              value={inputValue}
                                              machine={machine}
                                              setMachine={setMachine}
                                              onChange={(e) =>
                                                setInputValue(e.target.value)
                                              }
                                            />
                                            <Stack
                                              display="flex"
                                              flexDirection="column"
                                              width="100%"
                                              gap={2}
                                              style={{
                                                maxHeight: "150px",
                                                overflow: "auto",
                                                color: "white",
                                              }}
                                            >
                                              {mail.map((f, index) => (
                                                <Stack key={index}>
                                                  <ListItem
                                                    sx={{ color: "white" }}
                                                    mail={f}
                                                    remove={() =>
                                                      removemail(index, f)
                                                    }
                                                  />
                                                </Stack>
                                              ))}
                                            </Stack>
                                          </Stack>
                                          <Stack direction="row" gap={2} mt={2}>
                                            {/* <Button
                                              onClick={() => {
                                                toast.success("schedule done");
                                                setOpen(false);
                                                setCalenderToggle(false)
                                              }}
                                              variant="contained"
                                              color="secondary"
                                            >
                                              Schedule
                                            </Button> */}

                                            {/* <Button
                                        onClick={handleClose}
                                        variant="outlined"
                                        color="secondary"
                                      >
                                        Individual
                                      </Button> */}
                                          </Stack>
                                          <Stack mt={2}>
                                            <Typography
                                              component="a"
                                              href="/createCorporate"
                                              className="createScenarios"
                                              sx={{
                                                textDecoration: "none",
                                                variant: "body2",
                                              }}
                                            >
                                              Want to{" "}
                                              <span
                                                style={{ color: "#00FFFF" }}
                                              >
                                                Create Squad
                                              </span>{" "}
                                              ?
                                            </Typography>
                                          </Stack>
                                        </Stack>
                                      </Stack>
                                    )}
                                  </Box>
                                </Dialog>

                                {/* Join Dialog Box */}
                                <Dialog
                                  open={joinToggle}
                                  onClose={handleClose}
                                  maxWidth="xl"
                                  scroll="body"
                                >
                                  <Box
                                    p={2}
                                    sx={{
                                      backgroundColor: "background.secondary",
                                      maxWidth: "900px",
                                      display: "flex",
                                      gap: "10px",
                                      // justifyContent:''
                                    }}
                                  >
                                    {/* <Stack width="40%">
                                <DateTimePicker
                                  onChange={DTonChange}
                                  value={DTvalue}
                                />
                              </Stack> */}

                                    <Stack>
                                      <Typography variant="h2">
                                        Invite your friends
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ color: "#9C9EA3 !important" }}
                                        mb={2}
                                      >
                                        Enter your friends' registered email IDs
                                        and assign roles to them for the
                                        scenario. Click "Join with Members" to
                                        send the invitations and start the game.
                                      </Typography>

                                      <Stack>
                                        <Stack gap={2}>
                                          <Form
                                            onSubmit={_handleSubmit}
                                            value={inputValue}
                                            machine={machine}
                                            setMachine={setMachine}
                                            onChange={(e) =>
                                              setInputValue(e.target.value)
                                            }
                                          />
                                          <Stack
                                            display="flex"
                                            flexDirection="column"
                                            width="100%"
                                            gap={2}
                                            style={{
                                              maxHeight: "150px",
                                              overflow: "auto",
                                              color: "white",
                                            }}
                                          >
                                            {mail.map((f, index) => (
                                              <Stack key={index}>
                                                <ListItem
                                                  sx={{ color: "white" }}
                                                  mail={f}
                                                  remove={() =>
                                                    removemail(index, f)
                                                  }
                                                />
                                              </Stack>
                                            ))}
                                          </Stack>
                                        </Stack>
                                        <Stack direction="row" gap={2} mt={2}>
                                          <Button
                                            onClick={joinHandle}
                                            variant="contained"
                                            color="secondary"
                                          >
                                            Join Now
                                          </Button>

                                          {/* <Button
                                        onClick={handleClose}
                                        variant="outlined"
                                        color="secondary"
                                      >
                                        Individual
                                      </Button> */}
                                        </Stack>
                                        <Stack mt={2}>
                                          <Typography
                                            component="a"
                                            href="/createCorporate"
                                            className="createScenarios"
                                            sx={{
                                              textDecoration: "none",
                                              variant: "body2",
                                            }}
                                          >
                                            Want to{" "}
                                            <span style={{ color: "#00FFFF" }}>
                                              Create Squad
                                            </span>{" "}
                                            ?
                                          </Typography>
                                        </Stack>
                                      </Stack>
                                    </Stack>
                                  </Box>
                                </Dialog>
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack direction="row" gap={2} alignItems="center">
                            <Typography variant="body1" className="cardPoints">
                              <StarBorderPurple500Icon sx={{ mb: -0.5 }} />
                              {data.points} Points
                            </Typography>
                            <Typography variant="body1" className="cardPoints">
                              <TimerOutlinedIcon sx={{ mb: -0.5 }} />
                              {data.time} hour
                            </Typography>
                            <Typography variant="body1" className="cardPoints">
                              <InsertChartOutlinedIcon sx={{ mb: -0.5 }} />
                              {data.severity}
                            </Typography>
                          </Stack>
                          <Stack mb={2}>
                            <Typography variant="h1">
                              {data.scenarioName}
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
                                    color: "#00ffff",
                                    width: "fit-content",
                                  }}
                                  onClick={() => setHide(!hide)}
                                >
                                  Read more
                                </Typography>
                              </Stack>
                            ) : (
                              <Stack sx={{ width: "100%" }}>
                                <HTMLRenderer htmlContent={data?.description} />
                                <Typography
                                  style={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    color: "#00ffff",
                                    width: "fit-content",
                                  }}
                                  onClick={() => setHide(!hide)}
                                >
                                  Read less
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                          {/* mapping diagram */}
                          <Stack direction="row" sx={{ my: 2, gap: 3 }}>
                            {/* <Button
                              startIcon={<AccountTreeIcon />}
                              variant="contained"
                              sx={{ height: "50px" }}
                              size="large"
                            >
                              Mitre Mapping
                            </Button> */}
                            <Button
                              startIcon={<AccountTreeIcon />}
                              variant="contained"
                              sx={{ height: "50px" }}
                              size="large"
                              onClick={() => setDiagram(!diagram)}
                            >
                              Network Topology
                            </Button>
                          </Stack>
                          <Stack
                            style={{
                              display: diagram ? "block" : "none",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              position: "relative",
                            }}
                          >
                            <NetworkGraph
                              id={data?.id}
                              topology={topology}
                              setDiagram={setDiagram}
                              diagram={diagram}
                            />
                          </Stack>
                          {/* scenario config. */}
                          <Stack
                            direction="row"
                            // justifyContent="space-between"
                            // width="20%"
                            alignItems="start"
                            width="100%"
                            gap={5}
                          >
                            <Stack alignItems="center">
                              <Typography
                                variant="body2"
                                // className="configuration"
                                style={{ color: "#00ffff" }}
                              >
                                CPU
                              </Typography>
                              <Typography variant="body1">
                                {data.cpu}
                              </Typography>
                            </Stack>
                            <Stack alignItems="center">
                              <Typography
                                variant="body2"
                                // className="configuration"
                                style={{ color: "#00ffff" }}
                              >
                                HD Space
                              </Typography>
                              <Typography variant="body1">
                                {data.hdSpace}
                              </Typography>
                            </Stack>
                            <Stack alignItems="center">
                              <Typography
                                variant="body2"
                                // className="configuration"
                                style={{ color: "#00ffff" }}
                              >
                                RAM
                              </Typography>
                              <Typography variant="body1">
                                {data.ram}
                              </Typography>
                            </Stack>
                            <Stack alignItems="center">
                              <Typography
                                variant="body2"
                                // className="configuration"
                                style={{ color: "#00ffff" }}
                              >
                                Machine
                              </Typography>
                              <Typography variant="body1">
                                {data.machine}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>
                        {/* network diagram */}
                      </Stack>
                    </Stack>
                  );
                })}
              </Box>
            </Stack>
            {/* scenario tabs details and pratices details */}
            <Stack direction="row" gap={2}>
              <Stack
                sx={{
                  backgroundColor: "background.secondary",
                  p: 2,
                  borderRadius: "16px",
                  width: data?.scenario_documents ? "50%" : "100%",
                }}
              >
                <TabContext value={value}>
                  <Box>
                    <TabList
                      onChange={handleTabChange}
                      textColor="#ffffff"
                      TabIndicatorProps={{
                        sx: { backgroundColor: "#b46228" },
                      }}
                    >
                      {/* <Tab label="Objectives" value="" /> */}
                      <Tab label="Tools & Technology" value="1" />
                      <Tab label="Prerequisites" value="2" />
                    </TabList>
                  </Box>

                  <TabPanel
                  //  value="1"
                  >
                    <Stack
                      style={{
                        backgroundColor: "custom.main",
                        borderRadius: "16px",
                        justifyContent: "space-around",
                        alignItems: "space-around",
                        gap: 54,
                      }}
                    >
                      <Stack>{data.scenario_objectives}</Stack>

                      <Stack gap={2}>
                        {data?.scenario_documents?.map((item, index) => {
                          return (
                            <Button
                              key={index}
                              variant="outlined"
                              color="secondary"
                              onClick={() => window.open(item, "_blank")}
                            >
                              VIEW DOCUMENT
                            </Button>
                          );
                        })}
                      </Stack>
                    </Stack>
                  </TabPanel>

                  <TabPanel value="1">
                    <Stack
                      sx={{
                        backgroundColor: "custom.main",
                        borderRadius: "16px",
                        height: "500px",
                        overflow: "scroll",
                        px: 4,
                        // height:"auto"
                      }}
                    >
                      <HTMLRenderer
                        htmlContent={data.scenario_tools_technologies}
                      />
                    </Stack>
                  </TabPanel>
                  <TabPanel value="2">
                    <Stack
                      sx={{
                        backgroundColor: "custom.main",
                        borderRadius: "16px",
                        height: "500px",
                        overflow: "scroll",
                        px: 4,
                      }}
                    >
                      <HTMLRenderer htmlContent={data.scenario_prerequisites} />
                    </Stack>
                  </TabPanel>
                </TabContext>
              </Stack>
              {/* practice details */}
              <Stack
                sx={{
                  backgroundColor: "background.secondary",
                  p: 2,
                  borderRadius: "16px",
                  width: data?.scenario_documents && "50%",
                  display: !data?.scenario_documents && "none",
                }}
              >
                <Practice item={data?.scenario_documents} />
              </Stack>
            </Stack>
            {data?.winning_wall?.length > 0 && (
              <WinningWall
                template="winningWall"
                data={data.winning_wall}
                header="Achievers"
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ScenarioDetails;
