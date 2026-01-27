import React, { useEffect, useState } from "react";
import { Stack, Button, Grid } from "@mui/material";
import IndividualPlayer from "./IndividualPlayer";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getConsoleForWhiteVersion2,
  getConsoleTeamVersion2,
} from "../../../../APIConfig/version2Scenario";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../../RTK/features/userDetails/userSlice";
import { toast } from "react-toastify";

function BasicSelect({ userList }) {
  const [age, setAge] = React.useState("");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    if (
      userId &&
      userList?.participants_data?.some(
        (p) => p.participant_id === userId
      )
    ) {
      setAge(userId);
    } else {
      setAge("");
    }
  }, [userId, userList]);



  const handleChange = (event) => {
    setAge(event.target.value);
    navigate(
      `/activeGameScenario/consolePage/${userList?.active_scenario_id}/${event.target.value}`
    );
  };

  return (
    <Box sx={{ minWidth: 220 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Switch To</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Switchh"
          onChange={handleChange}
        >
        {userList?.participants_data?.map((item) => (
          <MenuItem
            key={item.participant_id}        
            value={item.participant_id}
          >
            {item?.participant_name}
          </MenuItem>
        ))}
                </Select>
      </FormControl>
    </Box>
  );
}

const WhiteTeamConsole = () => {
  const token = localStorage.getItem("access_token");
  const [reload, setReload] = useState(false);
  const { scenarioId, userId } = useParams();
  const [message, setMessage] = useState([]);
  const [socket, setSocket] = useState(null);
  const [invisible, setInvisible] = useState(true);
  const [data, setData] = useState({});
  const [userList, setUserList] = useState({});
  const [consoleUrl, setConsoleUrl] = useState("");
  const [load, setLoad] = useState(false);
  const { loading, userss, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {

    if (!userss?.user_role) {

      dispatch(fetchUsers());
    }
  }, []);

  useEffect(() => {
    // Replace 'ws://your-websocket-server-url' with your WebSocket server URL
    //  //console.log(process.env.REACT_APP_WEB_SOCKET_URL)
    const serverUrl = `${process.env.REACT_APP_WEB_SOCKET_URL}/notification/${scenarioId}/`;

    // Create a new WebSocket instance
    const ws = new WebSocket(serverUrl);

    // WebSocket event listeners
    ws.onopen = () => {
      // Send the token as part of the initial message

      const authMessage = JSON.stringify({ token: token });
      ws.send(authMessage);
    };

    ws.onmessage = (event) => {

      const receivedMessage = event.data;
      const message = JSON.parse(receivedMessage)

      if (JSON.parse(receivedMessage)) {
        if (message.notifications == "reload") {
          setReload(!reload)
        }

      }
    };

    ws.onclose = () => { };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);

    // Clean up the WebSocket when the component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [token]);


  useEffect(() => {

    getData();
  }, [userId, reload]);

  const getData = async () => {
    setLoad(true);
    try {
      const value = await getConsoleForWhiteVersion2(scenarioId, userId);

      if (value?.data) {
        const payload = value.data;

        // 🔥 NORMALIZE milestone data (NO UI CHANGE)
        if (payload.scenario_type === "MILESTONE") {
          payload.milestone_data = Array.isArray(payload.milestone_data)
            ? payload.milestone_data
            : [];

          payload.total_milestone_count =
            payload.total_milestone_count ?? payload.milestone_data.length;

          payload.approved_milestone_count =
            payload.approved_milestone_count ??
            payload.milestone_data.filter(m => m.is_approved).length;
        }

        setData(payload);
        payload.console_url && setConsoleUrl(payload.console_url);
      }

      const userListRes = await getConsoleTeamVersion2();
      userListRes?.data && setUserList(userListRes.data);
    } catch (err) {
      toast.error("Failed to load console data");
    } finally {
      setLoad(false);
    }
  };

  const navigate = useNavigate();
  return (
    <Stack>
      <Stack sx={{ justifyContent: "flex-end", width: "100%", mt: 1 }}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          width="100%"
          gap={1}
          alignItems="center"
          sx={{ pr: 4 }}
        >
          <BasicSelect userList={userList} />
          <Button
            variant="outlined"
            onClick={() => navigate("/activeGameScenario/corporate")}
          >
            Exit Watching
          </Button>
        </Stack>
      </Stack>
      <Grid container width="100%" height="90vh" sx={{ mb: 4 }}>
        <IndividualPlayer
          data={data}
          reload={reload}
          setReload={setReload}
          load={load}
          gameType={data?.scenario_type}
        />
      </Grid>
    </Stack>
  );
};

export default WhiteTeamConsole;
