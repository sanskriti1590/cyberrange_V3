import { Breadcrumbs, Stack } from "@mui/material";
import DrawerRight from "./Drawer";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";

const BreadCrumbs = ({ breadcrumbs }) => {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("access_token");
  const user = token ? jwtDecode(token) : null;
  const [invisible, setInvisible] = useState(true);

  const location = useLocation();
  const currentPath = location?.pathname.split("/", 3).join("/");

  useEffect(() => {
    // Replace 'ws://your-websocket-server-url' with your WebSocket server URL
    //  //console.log(process.env.REACT_APP_WEB_SOCKET_URL)
    const serverUrl = `${process.env.REACT_APP_WEB_SOCKET_URL}/notification/${user?.user_id}/`;
    //  //console.log(serverUrl)
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
      //console.log("notification message", JSON.parse(receivedMessage)?.notifications)
      if (receivedMessage) {
        if (JSON.parse(receivedMessage)?.notifications) {
          toast.success("A new notification");
          setInvisible(false);
        }
        setMessage(JSON.parse(receivedMessage));
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
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        mt: 2,
      }}
    >
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          <span style={{ color: "#535660", fontWeight: "700" }}>/</span>
        }
      >
        {breadcrumbs?.map((item, index) => {
          return (
            <Link
              underline="hover"
              to={item.link}
              padding={2}
              key={index}
              style={{
                textDecoration: "none",
                fontWeight: "700",
                color: currentPath === item.link ? "#BCBEC1" : "#535660",
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </Breadcrumbs>
      <DrawerRight invisible={invisible} message={message} />
    </Stack>
  );
};

export default BreadCrumbs;
