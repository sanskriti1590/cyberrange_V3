import { Stack } from "@mui/material";
import WinningWall from "../../../components/winningWall/WinningWall";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { liveScoreList } from "../../../APIConfig/version2Scenario";
import LeaderBoard from "./LeaderBoard";

const LiveScore = ({ group, gameType, scenarioId }) => {
  const token = localStorage.getItem("access_token");
  const [data, setMessage] = useState([]);
  const [socket, setSocket] = useState(null);
  const [invisible, setInvisible] = useState(true);

  useEffect(() => {
    const getValue = async () => {
      const value = await liveScoreList(group);

      setMessage(value?.data);
    };
    getValue();
  }, []);

  useEffect(() => {
    // Replace 'ws://your-websocket-server-url' with your WebSocket server URL
    //  //console.log(process.env.REACT_APP_WEB_SOCKET_URL)
    const serverUrl = `${process.env.REACT_APP_WEB_SOCKET_URL}/corporate/notification/${group}/`;

    // Create a new WebSocket instance
    const ws = new WebSocket(serverUrl);

    // WebSocket event listeners
    ws.onopen = () => { };

    ws.onmessage = (event) => {
      const receivedMessage = event.data;
      console.table(
        "notification message",
        JSON.parse(receivedMessage)?.notifications
      );
      if (JSON.parse(receivedMessage)?.notifications == "reload") {
        setInvisible(false);
      } else {
        setMessage(JSON.parse(receivedMessage)?.notifications);
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

  return (
    <Stack width="100%" border="1p solid white">
      <LeaderBoard
        data={data}
        gameType={gameType}
        scenarioId={scenarioId}
      // participant_id={participant_id}
      />
    </Stack>
  );
};

export default LiveScore;
