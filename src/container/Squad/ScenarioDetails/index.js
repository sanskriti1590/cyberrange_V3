//Used for corporate/cyberdrill scenario details page and Join now Button 
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import "./index.css";
import Dialog from "@mui/material/Dialog";
import { toast } from "react-toastify";
import Form from "./Form";
import ListItem from "./ListItem";
import HTMLRenderer from "../../../components/HtmlRendering";
import NetworkGraph from "../../../components/NetworkGraph";
import WinningWall from "../../../components/winningWall/WinningWall";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import LoaderImg from "../../../components/ui/loader";
import ResponsiveDateTimePickers from "./ScheduleDateTimePickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getWinningWallDataCorporate,
  scenarioDetailsVersion2,
  scenarioStartGameVersion2,
  scenarioPhasesVersion2,
  getCorporateScenarioInfra
} from "../../../APIConfig/version2Scenario"; // added phases api here 
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import {
  Backdrop,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import SecurityIcon from "@mui/icons-material/Security";
import GppGoodIcon from "@mui/icons-material/GppGood";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdjustIcon from "@mui/icons-material/Adjust";
import FlagIcon from "@mui/icons-material/Flag";
import DescriptionIcon from "@mui/icons-material/Description";
import pdfFileIcon from "../../../assests/file-pdf.svg";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Practice from "./practice";
import { topologyCorporateDetails} from "../../../APIConfig/scenarioConfig";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupsIcon from "@mui/icons-material/Groups";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

const ScenarioDetailsVersion2 = () => {
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = React.useState("1");
  const [topology, setTopology] = React.useState({});
  const [isActive, setIsActive] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [diagram, setDiagram] = React.useState(false);
  const [mail, setMail] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [DTvalue, setDTvalue] = React.useState(new Date());
  const [data, setData] = React.useState([]);
  const [winningWallData, setWinningWallData] = useState([]);
  const [scenarioMail, setScenarioMail] = React.useState([]);
  const [machine, setMachine] = React.useState([]);
  const [hide, setHide] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location?.pathname;
  const token = localStorage.getItem("access_token");
  const user = jwtDecode(token);
  const { userss } = useSelector((state) => state.user);
  const IdUser = user?.user_id;
//phases
const phases = data?.phases || [];
// join now
const [infra, setInfra] = useState(null);

const [teamsForm, setTeamsForm] = useState([
  {
    teamName: "",
    players: [
      { email: "", role: "", machines: [] }
    ],
  },
]);


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
      setIsActive(true);
      try {
        const response = await scenarioDetailsVersion2(lastValue);
        if (response?.data) {
          console.log("SCENARIO DETAIL RESPONSE:", response.data);
console.log("INFRA ID:", response.data?.infra_id);

          setData(response?.data);
          setMachine(response?.data?.machine_names);
          const response2 = await topologyCorporateDetails(response?.data?.id);
          setTopology(response2?.data);
          if (response.data.infra_id) {
            const infraRes = await getCorporateScenarioInfra(response.data.infra_id);
                console.log("INFRA API RAW RESPONSE:", infraRes.data);

            setInfra(infraRes.data);
          }
        }
      } catch (error) {
        // navigate("/error/pageNotFound");
      } finally {
        setIsActive(false);
      }

      // const response2 = await topologyDetails(response?.data?.scenario_id);
      // setTopology(response2?.data);
    };

    const getWinningWallData = async () => {
      try {
        const response = await getWinningWallDataCorporate(lastValue);
        response?.data && setWinningWallData(response?.data);
      } catch (error) {
        console.log(error);
      }
    };
    getApi();
    getWinningWallData();
  }, []);

  // for handle schedule now button and open its dialog box
  const handleClickOpen = () => {
    setOpen(true);
  };
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
  const handleGame = () => {
    navigate("/activeGameScenario/solo");
  };

  const _handleSubmit = (data) => {
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
  const DTonChange = (stat) => {
    setDTvalue(stat);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const removemail = (index, f) => {
    setMail((prevMail) => {
      const newMail = [...prevMail];
      newMail.splice(index, 1);
      return newMail;
    });
    setMachine((prevItems) => [...prevItems, f.player_instance[0]]);
  };

  // start game
const joinHandle = async () => {
  setIsActive(true);
  try {
    const payload = {
      scenario_id: lastValue,
      teams: teamsForm.map((team) => ({
        team_name: team.teamName,
        players: team.players.map((p) => ({
          email: p.email,
          role: p.role,
          machines: p.machines,
        })),
      })),
    };

    console.log("FINAL START PAYLOAD", payload);

    const response = await scenarioStartGameVersion2(payload);

    toast.success(response?.data?.message);
    setJoinToggle(false);
  } catch (error) {
    const errs = error?.response?.data || {};
    Object.values(errs).forEach((e) => toast.error(e));
  } finally {
    setIsActive(false);
  }
};

  const scenariosData = [
    {
      id: data?.id,
      category: data?.category_name,
      points: data?.points,
      time: data?.scenario_time,
      severity: data?.severity,
      img: data?.thumbnail_url,
      scenarioName: data?.name,
      description: data?.description,
      cpu:
        data?.scenario_hardware_details?.vcpu || data?.hardware_details?.vcpu,
      hdSpace:
        data?.scenario_hardware_details?.disk_size ||
        data?.hardware_details?.disk_size,
      ram: data?.scenario_hardware_details?.RAM || data?.hardware_details?.RAM,
      objectives: data?.objective,
      tool_technology: data?.objective,
      prerequisites: data?.prerequisite,
      machine:
        data?.scenario_hardware_details?.vm_count ||
        data?.hardware_details?.vm_count,
      type: data?.type,
    },
  ];

  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    {
      name: "Category",
      link: "/corporate/category",
    },
    { name: "Detail Page", link: `${location.pathname}` },
  ];

  const handleTabChangeForPDF = (newValue) => {
    setTabValue(newValue);
    console.error(newValue);
  };

  const capitalizeTeamName = (team) => {
    return team.replace(/_/g, " ");
  };

  const teams = Object.keys(data?.files_data || {}).filter(
    (team) => data?.files_data[team]?.length > 0
  );
  const selectedTeam = teams[tabValue] || "";
  const files = data?.files_data?.[selectedTeam] || [];

  //team flags count for team distribution
const teamFlagCount = {
  red: data?.flag_data?.red_team?.length || 0,
  blue: data?.flag_data?.blue_team?.length || 0,
  yellow: data?.flag_data?.yellow_team?.length || 0,
  purple: data?.flag_data?.purple_team?.length || 0,
};

const availableRoles = Array.from(
  new Set((infra?.instances || []).map((i) => (i.team || "").toUpperCase()))
).filter(Boolean);

const machinesByRole = (infra?.instances || []).reduce((acc, inst) => {
  const role = (inst.team || "").toUpperCase();
  if (!role) return acc;
  if (!acc[role]) acc[role] = [];
  acc[role].push(inst.name);
  return acc;
}, {});

  console.log("INFRA:", infra);
  console.log("AVAILABLE ROLES:", availableRoles);
  console.log("MACHINES BY ROLE:", machinesByRole);

const removeTeam = (teamIndex) => {
  setTeamsForm((prev) => prev.filter((_, i) => i !== teamIndex));
};

const removePlayer = (teamIndex, playerIndex) => {
  setTeamsForm((prev) =>
    prev.map((t, i) => {
      if (i !== teamIndex) return t;
      const nextPlayers = t.players.filter((_, pi) => pi !== playerIndex);
      // keep at least one row
      return { ...t, players: nextPlayers.length ? nextPlayers : [{ email: "", role: "", machines: [] }] };
    })
  );
};

const updateTeamName = (teamIndex, value) => {
  setTeamsForm((prev) => prev.map((t, i) => (i === teamIndex ? { ...t, teamName: value } : t)));
};

const updatePlayerField = (teamIndex, playerIndex, field, value) => {
  setTeamsForm((prev) =>
    prev.map((t, i) => {
      if (i !== teamIndex) return t;
      const players = t.players.map((p, pi) => {
        if (pi !== playerIndex) return p;
        // if role changes, reset machines
        if (field === "role") return { ...p, role: value, machines: [] };
        return { ...p, [field]: value };
      });
      return { ...t, players };
    })
  );
};

const addPlayer = (teamIndex) => {
  setTeamsForm((prev) =>
    prev.map((t, i) =>
      i === teamIndex
        ? { ...t, players: [...t.players, { email: "", role: "", machines: [] }] }
        : t
    )
  );
};

const addTeam = () => {
  setTeamsForm((prev) => [
    ...prev,
    { teamName: "", players: [{ email: "", role: "", machines: [] }] },
  ]);
};
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
                Squad
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
                                  {userss?.user_role === "WHITE TEAM" ? (
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      sx={{
                                        width: "150px",
                                        height: "50px",
                                      }}
                                      onClick={handleClickJoin}
                                    >
                                      Join Now
                                    </Button>
                                  ) : (
                                    <Chip
                                      label={
                                        <Typography
                                          variant="body2"
                                          fontSize={15}
                                          style={{ color: "#9C93A3" }}
                                        >
                                          Only White Team members can start the game.
                                        </Typography>
                                      }
                                      sx={{
                                        width: "10%",
                                        minWidth: "350px",
                                        backgroundColor: "#393939",
                                        height: "30px",
                                      }}
                                    />

                                  )}
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
                                {/* Join dialog box */}
                              <Dialog open={joinToggle} onClose={handleClose} maxWidth="xl" scroll="body">
                                <Box
                                  sx={{
                                    backgroundColor: "background.secondary",
                                    width: "100%",
                                    maxWidth: 980,
                                    p: 3,
                                  }}
                                >
                                  {/* Header */}
                                  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                    <Stack>
                                      <Typography variant="h2">Invite your friends</Typography>
                                      <Typography variant="body1" sx={{ color: "#9C9EA3 !important" }}>
                                        Create teams, assign roles and machines, then start the scenario.
                                      </Typography>
                                    </Stack>

                                    <Tooltip title="Close">
                                      <IconButton onClick={handleClose}>
                                        <CloseIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>

                                  <Divider sx={{ my: 2, borderColor: "#1e293b" }} />

                                  {/* ===== TEAM BUILDER ===== */}
                                  <Stack spacing={2}>
                                    {teamsForm.map((team, teamIndex) => (
                                      <Box
                                        key={teamIndex}
                                        sx={{
                                          border: "1px solid #1e293b",
                                          borderRadius: 2,
                                          p: 2,
                                        }}
                                      >
                                        {/* Team header row */}
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                          <TextField
                                            label={`Team Name`}
                                            value={team.teamName}
                                            onChange={(e) => updateTeamName(teamIndex, e.target.value)}
                                            sx={{ flex: 1 }}
                                          />

                                          <Tooltip title="Delete Team">
                                            <span>
                                              <IconButton
                                                onClick={() => removeTeam(teamIndex)}
                                                disabled={teamsForm.length === 1}
                                              >
                                                <DeleteOutlineIcon />
                                              </IconButton>
                                            </span>
                                          </Tooltip>
                                        </Stack>

                                        <Divider sx={{ my: 2, borderColor: "#1e293b" }} />

                                        {/* Players table-ish header */}
                                        <Box
                                          sx={{
                                            display: "grid",
                                            gridTemplateColumns: "2fr 1fr 2fr 40px",
                                            gap: 2,
                                            mb: 1,
                                            opacity: 0.85,
                                          }}
                                        >
                                          <Typography variant="body2" sx={{ color: "#9C9EA3" }}>
                                            Email
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: "#9C9EA3" }}>
                                            Role
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: "#9C9EA3" }}>
                                            Machines
                                          </Typography>
                                          <Typography variant="body2" sx={{ color: "#9C9EA3" }}>
                                            {/* Actions */}
                                          </Typography>
                                        </Box>

                                        {/* Players rows */}
                                        <Stack spacing={1.5}>
                                          {team.players.map((player, playerIndex) => (
                                            <Box
                                              key={playerIndex}
                                              sx={{
                                                display: "grid",
                                                gridTemplateColumns: "2fr 1fr 2fr 40px",
                                                gap: 2,
                                                alignItems: "center",
                                              }}
                                            >
                                              <TextField
                                                
                                                value={player.email}
                                                onChange={(e) =>
                                                  updatePlayerField(teamIndex, playerIndex, "email", e.target.value)
                                                }
                                                size="small"
                                              />

                                              <Select
                                                size="small"
                                                value={player.role}
                                                displayEmpty
                                                onChange={(e) =>
                                                  updatePlayerField(teamIndex, playerIndex, "role", e.target.value)
                                                }
                                              >
                                                <MenuItem disabled value="">
                                                  Select Role
                                                </MenuItem>
                                                {availableRoles.map((role) => (
                                                  <MenuItem key={role} value={role}>
                                                    {role}
                                                  </MenuItem>
                                                ))}
                                              </Select>

                                              <Select
                                                size="small"
                                                multiple
                                                disabled={!player.role}
                                                value={player.machines}
                                                renderValue={(selected) => (selected?.length ? selected.join(", ") : "Select Machines")}
                                                onChange={(e) =>
                                                  updatePlayerField(teamIndex, playerIndex, "machines", e.target.value)
                                                }
                                              >
                                                {(machinesByRole[player.role] || []).map((m) => (
                                                  <MenuItem key={m} value={m}>
                                                    <Checkbox checked={player.machines.includes(m)} />
                                                    <ListItemText primary={m} />
                                                  </MenuItem>
                                                ))}
                                              </Select>

                                              <Tooltip title="Delete Player">
                                                <IconButton onClick={() => removePlayer(teamIndex, playerIndex)}>
                                                  <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                              </Tooltip>
                                            </Box>
                                          ))}
                                        </Stack>

                                        {/* Add Player */}
                                        <Button size="small" sx={{ mt: 2 }} onClick={() => addPlayer(teamIndex)}>
                                          + Add Player
                                        </Button>
                                      </Box>
                                    ))}

                                    {/* Add Team */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                                      <Button variant="outlined" onClick={addTeam}>
                                        + Add Team
                                      </Button>

                                      {/* Join / Cancel */}
                                      <Stack direction="row" gap={2}>
                                        <Button
                                          variant="contained"
                                          color="secondary"
                                           onClick={joinHandle} 
                                        >
                                          Join Now
                                        </Button>
                                        <Button variant="outlined" onClick={handleClose}>
                                          Cancel
                                        </Button>
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
                            {/* <Typography variant="body1" className="cardPoints">
                              <TimerOutlinedIcon sx={{ mb: -0.5 }} />
                              {data.time} hour
                            </Typography> */}
                            <Typography variant="body1" className="cardPoints">
                              <InsertChartOutlinedIcon sx={{ mb: -0.5 }} />
                              {data?.severity}
                            </Typography>

                            {data?.type && (
                              <Typography
                                variant="body1"
                                className="cardPoints"
                              >
                                <WorkspacePremiumOutlinedIcon
                                  sx={{ mb: -0.5 }}
                                />
                                {data?.type}
                              </Typography>
                            )}
                          </Stack>
                          <Stack mb={2}>
                            <Typography variant="h1">
                              {data?.scenarioName}
                            </Typography>
                            {hide ? (
                              <Stack sx={{ width: "100%",  wordBreak:'break-word' }}>
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
                            <Stack
                              alignItems="center"
                            // border={"1px solid white"}
                            >
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


{/* ================= MAIN CONTENT ROW ================= */}
<Stack direction="row" gap={2} alignItems="flex-start">

  {/* ================= LEFT COLUMN ================= */}
  <Stack flex={2} gap={2}>

    {/* Tabs */}
    <Stack
      sx={{
        backgroundColor: "background.secondary",
        p: 2,
        borderRadius: "16px",
      }}
    >
      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleTabChange}
            textColor="#ffffff"
            TabIndicatorProps={{ sx: { backgroundColor: "#b46228" } }}
          >
            <Tab label="Objective" value="1" />
            <Tab label="Prerequisite" value="2" />
          </TabList>
        </Box>

        <TabPanel value="1">
          <Stack
            sx={{
              backgroundColor: "custom.main",
              borderRadius: "16px",
              height: 420,
              overflow: "auto",
              px: 3,
            }}
          >
            <HTMLRenderer htmlContent={data?.objective} />
          </Stack>
        </TabPanel>

        <TabPanel value="2">
          <Stack
            sx={{
              backgroundColor: "custom.main",
              borderRadius: "16px",
              height: 420,
              overflow: "auto",
              px: 3,
            }}
          >
            <HTMLRenderer htmlContent={data?.prerequisite} />
          </Stack>
        </TabPanel>
      </TabContext>
    </Stack>

    {/* Practice (LEFT column only) */}
    {data?.scenario_documents && (
      <Stack
        sx={{
          backgroundColor: "background.secondary",
          p: 2,
          borderRadius: "16px",
        }}
      >
        <Practice item={data?.scenario_documents} />
      </Stack>
    )}

  </Stack>

{/* ================= RIGHT SIDEBAR ================= */}
<Stack
  flex={1}
  gap={2}
  sx={{
    position: "sticky",
    top: 90,
    alignSelf: "flex-start",
  }}
>

{/* ================= Kill Chain (Horizontal) ================= */}
{phases.length > 0 && (
  <Box
    sx={{
      borderRadius: 3,
      p: 2.5,
      background: "linear-gradient(180deg, #0b1220, #020617)",
      border: "1px solid #1e293b",
    }}
  >
    <Stack direction="row" justifyContent="space-between" mb={3}>
      <Typography fontWeight={600}>Kill Chain</Typography>
      <Chip
        size="small"
        label={`${phases.length} Phases`}
        sx={{
          backgroundColor: "#020617",
          border: "1px solid #1e293b",
          color: "#cbd5f5",
        }}
      />
    </Stack>

    {/* Horizontal Stepper */}
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
      {phases.map((phase, index) => (
        <Stack
          key={phase.id}
          alignItems="center"
          sx={{ flex: 1, position: "relative" }}
        >
          {/* Connector Line */}
          {index !== phases.length - 1 && (
            <Box
              sx={{
                position: "absolute",
                top: 14,
                left: "50%",
                width: "100%",
                height: "2px",
                backgroundColor: "#00CCCC",
                zIndex: 0,
              }}
            />
          )}

          {/* Circle */}
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "#020617",
              border: "2px solid #00CCCC",
              color: "#00CCCC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
              zIndex: 1,
            }}
          >
            {index + 1}
          </Box>

          {/* Phase Box */}
          <Box
            sx={{
              mt: 1.5,
              px: 1.5,
              py: 0.8,
              borderRadius: 1.5,
              backgroundColor: "#123C42",
              border: "1px solid #00CCCC",
              minWidth: 90,
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              color="#00CCCC"
            >
              {phase.phase_name || phase.name}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  </Box>
)}

  {/* ================= Team Composition ================= */}
<Box
  sx={{
    borderRadius: 3,
    p: 2.5,
    background: "linear-gradient(180deg, #0b1220, #020617)",
    border: "1px solid #1e293b",
  }}
>
  <Stack direction="row" justifyContent="space-between" mb={2}>
    <Typography fontWeight={600}>Team Composition</Typography>
    <Chip
      size="small"
      label="4 Teams"
      sx={{
        backgroundColor: "#020617",
        border: "1px solid #1e293b",
        color: "#cbd5f5",
      }}
    />
  </Stack>

  <Stack direction="row" flexWrap="wrap" gap={2}>
    {[
      {
        key: "red",
        title: "Red Team",
        role: "Attackers",
        desc: "Offensive security operations",
        color: "#ef4444",
        gradient: "linear-gradient(135deg, #2a0f14, #020617)",
        icon: <SecurityIcon />,
      },
      {
        key: "blue",
        title: "Blue Team",
        role: "Defenders",
        desc: "Defensive security operations",
        color: "#3b82f6",
        gradient: "linear-gradient(135deg, #0f1c2e, #020617)",
        icon: <GppGoodIcon />,
      },
      {
        key: "yellow",
        title: "Yellow Team",
        role: "Builders",
        desc: "Infrastructure & development",
        color: "#facc15",
        gradient: "linear-gradient(135deg, #2b260d, #020617)",
        icon: <VisibilityIcon />,
      },
      {
        key: "purple",
        title: "Purple Team",
        role: "Hybrid",
        desc: "Attack-defense collaboration",
        color: "#a855f7",
        gradient: "linear-gradient(135deg, #241335, #020617)",
        icon: <AdjustIcon />,
      },
    ].map((team) => (
      <Box
        key={team.key}
        sx={{
          width: "calc(50% - 8px)",
          p: 2.2,
          borderRadius: 3,
          background: team.gradient,
          border: `1px solid ${team.color}55`,
          boxShadow: `0 0 0 1px ${team.color}22`,
        }}
      >
        {/* Header */}
        <Stack direction="row" gap={1.5} alignItems="center" mb={1}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: `${team.color}22`,
              color: team.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {team.icon}
          </Box>

          <Stack>
            <Typography fontWeight={600} sx={{ color: team.color }}>
              {team.title}
            </Typography>
            <Typography variant="caption" color="#94a3b8">
              {team.role}
            </Typography>
          </Stack>
        </Stack>

        {/* Description */}
        <Typography
          variant="body2"
          color="#9ca3af"
          sx={{ mb: 2, fontSize: 13 }}
        >
          {team.desc}
        </Typography>

        {/* Metrics */}
        <Stack direction="row" gap={1.5}>
          <Chip
            icon={<FlagIcon />}
            label={`${teamFlagCount?.[team.key] ?? 0} Flags`}
            sx={{
              backgroundColor: "#020617",
              border: `1px solid ${team.color}55`,
              color: team.color,
              fontWeight: 500,
            }}
          />
        </Stack>
      </Box>
    ))}
  </Stack>
</Box>

</Stack>
</Stack>


              </Stack>
            </Stack>
            {Array.isArray(winningWallData) && winningWallData.length > 0 ? (
              <WinningWall
                template="winningWall"
                data={winningWallData}
                header="Achievers"
              />
            ) :
              (<Box textAlign="center" py={4}>
                <Typography variant="h6" color="#919EAB !important" gutterBottom >
                  No Data Available
                </Typography>
                <Typography variant="body2" color="#919EAB !important">
                  There are no achievers to display at the moment.
                </Typography>
              </Box>)}
          </Stack>
        </Stack>
  );
};

export default ScenarioDetailsVersion2;
