import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { Stack } from "@mui/system";
import "./index.css";
import { useState } from "react";
import Network from "./component/network/network";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ViewAllNetwork from "./component/network/viewAllNetwork";
import Router from "./component/router/router";
import ViewAllRouter from "./component/router/viewAllRouter";
import Instances from "./component/instance/instance";
import ViewAllInstances from "./component/instance/viewAllInstances";
import Components from "./component/components/components";
import { BsXDiamond } from "react-icons/bs";
import { GiMeshNetwork } from "react-icons/gi";
import { RxLoop } from "react-icons/rx";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { createInfra } from "../../../APIConfig/scenarioConfig";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ senario, datas, scenarioId }) {
  const [net, setNet] = useState([]);
  const [rot, setRot] = useState([]);
  const [ins, setIns] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const data = {
    networks: [],
    routers: [],
    instance: [],
  };



  // const [infra, setInfra] = useState({
  //   scenario_id: scenarioId,
  //   scenario_infra: {},
  // });

  localStorage.setItem("scenario", JSON.stringify(data));

  const [changes, setChanges] = useState(false);
  const [router, setRouter] = useState(false);
  const [instance, setInstance] = useState(false);
  const [activeIndex, setActiveIndex] = useState(7);
  const [loading, setLoading] = useState(false)



  const submitInfra = async () => {
    const dataValue = {
      // networks: infrastructor.network,
      // routers: infrastructor.router,
      // instances: infrastructor.instance
      networks: net,
      routers: rot,
      instances: ins,
    };
    setLoading(true)
    const myJSON = JSON.stringify(dataValue);
    //console.log("myjson", typeof myJSON);

    // setInfra({ scenario_id: scenarioId, ["scenario_infra"]: myJSON });
    //console.log("datavalue", dataValue);
    try {
      const response = await createInfra(scenarioId, myJSON);
      if (response.data) {
        navigate("/createCorporate/endingPage");
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
    } finally {
      setLoading(false)
    }
  };

  const handleClick = (index, value, name) => {
    if (name == "network") {
      setNet((oldArray) => [...oldArray, value]);
    }
    if (name == "router") {
      setRot((oldArray) => [...oldArray, value]);
    }
    if (name == "Instance") {
      setIns((oldArray) => [...oldArray, value]);
    }
    setActiveIndex(index);
  };


  const checkActive = (index, className) =>
    activeIndex === index ? className : "";



  //for open dialog default temperory change
  const [open, setOpen] = React.useState(false);


  const handleClickOpen = async () => {
    const value = await senario();
    if (value) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeHandle = () => {
    setChanges(!changes);
  };

  const changeHandleRouter = () => {
    setRouter(!router);
  };

  const changeHandleInstance = () => {
    setInstance(!instance);
  };

  // delete a network
  const DelNet = (index) => {
    console.log('heref')
    net.splice(index, 1);
    console.log('net is here', net)
    setLoad(!load)

  };

  // delete a router
  const DelRot = (index) => {
    console.log('here')
    const x = rot.splice(index, 1);
    setLoad(!load)
  };

  const DelIns = (index) => {
    const x = ins.splice(index, 1);
    setLoad(!load)
  };

  // setting open the dialog
  // React.useEffect(() => {
  //   setOpen(true)
  // }, [])
  return (
    <>
      <ToastContainer />
      <Button
        variant="contained"
        color="secondary"
        sx={{ borderRadius: "8px" }}
        onClick={handleClickOpen}
      >
        {datas}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        style={{ backgroundColor: "background.secondary" }}
      >
        <AppBar sx={{ position: "relative" }}>
        </AppBar>
        {/* dialog data */}
        {/* changed height  */}
        <Stack
          direction="row"
          bgcolor="custom.main"
          width="100%"
          height="150vh"
        >
          <Stack
            className="tabs"
            height="100%"
            style={{ backgroundColor: "#212121" }}
            minWidth="17%"
            gap={4}
            justifyContent="center"
            pl="3%"
          >
            {/* components */}
            <Stack>
              <Stack
                direction="row"
                onClick={() => handleClick(7)}
                style={{ cursor: "pointer" }}
                width="100%"
              >
                <Typography
                  className={`tab ${checkActive(7, "act")}`}
                  variant="h3"
                >
                  <BsXDiamond sx={{ width: 14, height: 14 }} /> Inventory
                </Typography>
              </Stack>
            </Stack>
            {/* network */}
            <Stack gap={2}>
              <Stack onClick={changeHandle} direction="row">
                <Typography variant="h3">
                  {/* <img src={ntwrkIcon} alt="img" width={16} height={16}/> */}
                  <GiMeshNetwork sx={{ width: 22, height: 22 }} /> Network
                </Typography>
                {!changes ? (
                  <ArrowDropDownIcon
                    sx={{
                      width: 30,
                      height: 30,
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <ArrowDropUpIcon
                    sx={{ width: 30, height: 30, cursor: "pointer" }}
                  />
                )}
              </Stack>
              <Stack style={{ display: changes ? "block" : "none" }}>
                <Stack gap={2}>
                  <Stack
                    direction="row"
                    onClick={() => handleClick(1)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      className={`tab ${checkActive(1, "act")}`}
                      fontSize={15}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "100px",
                      }}
                    >
                      Add Network
                      {activeIndex === 1 && (
                        <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                      )}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    onClick={() => handleClick(2)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      className={`tab ${checkActive(2, "act")}`}
                      fontSize={15}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "80px",
                      }}
                    >
                      view all Networks
                      {activeIndex === 2 && (
                        <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            {/* router */}
            <Stack gap={2}>
              <Stack onClick={changeHandleRouter} direction="row">
                <Typography variant="h3">
                  <RxLoop sx={{ width: 22, height: 22 }} /> Router
                </Typography>
                {!router ? (
                  <ArrowDropDownIcon
                    sx={{ width: 30, height: 30, cursor: "pointer" }}
                  />
                ) : (
                  <ArrowDropUpIcon
                    sx={{ width: 30, height: 30, cursor: "pointer" }}
                  />
                )}
              </Stack>
              <Stack style={{ display: router ? "block" : "none" }}>
                <Stack gap={2}>
                  <Stack
                    direction="row"
                    onClick={() => handleClick(3)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      className={`tab ${checkActive(3, "act")}`}
                      fontSize={15}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "100px",
                      }}
                    >
                      Add Router{" "}
                      {activeIndex === 3 && (
                        <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                      )}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    onClick={() => handleClick(4)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      className={`tab ${checkActive(4, "act")}`}
                      fontSize={15}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "100px",
                      }}
                    >
                      view all Router{" "}
                      {activeIndex === 4 && (
                        <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>

            {/* instances */}

            <Stack gap={2}>
              <Stack onClick={changeHandleInstance} direction="row">
                <Typography variant="h3">
                  <ViewInArIcon sx={{ width: 16, height: 16 }} /> Instance
                </Typography>
                {!instance ? (
                  <ArrowDropDownIcon
                    sx={{ width: 30, height: 30, cursor: "pointer" }}
                  />
                ) : (
                  <ArrowDropUpIcon sx={{ width: 30, height: 30 }} />
                )}
              </Stack>
              <Stack
                style={{
                  display: instance ? "block" : "none",
                  cursor: "pointer",
                }}
              >
                <Stack gap={2}>
                  <Stack
                    direction="row"
                    onClick={() => handleClick(5)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      fontSize={15}
                      className={`tab ${checkActive(5, "act")}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "100px",
                      }}
                    >
                      Add Instance{" "}
                      {activeIndex === 5 && (
                        <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                      )}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    onClick={() => handleClick(6)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      fontSize={15}
                      className={`tab ${checkActive(6, "act")}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "100px",
                      }}
                    >
                      view all Instance{" "}
                      {activeIndex === 6 && (
                        <ArrowForwardIosIcon sx={{ fontSize: 15 }} />
                      )}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack className="panels" sx={{ width: "82.9%" }}>
            <Stack className={`panel ${checkActive(1, "act")}`}>
              <Network handleClick={handleClick} />
            </Stack>
            <Stack className={`panel ${checkActive(2, "act")}`}>
              <ViewAllNetwork
                handleClick={handleClick}
                networks={net}
                DelNet={DelNet}
                load={load}
              />
            </Stack>
            <Stack className={`panel ${checkActive(3, "act")}`}>
              <Router handleClick={handleClick} networks={net} />
            </Stack>
            <Stack className={`panel ${checkActive(4, "act")}`}>
              <ViewAllRouter
                handleClick={handleClick}
                router={rot}
                DelRot={DelRot}
                load={load}
              />
            </Stack>
            <Stack className={`panel ${checkActive(5, "act")}`}>
              <Instances handleClick={handleClick} networks={net} />
            </Stack>
            <Stack className={`panel ${checkActive(6, "act")}`}>
              <ViewAllInstances
                handleClick={handleClick}
                instance={ins}
                submitInfra={submitInfra}
                DelIns={DelIns}
                load={load}
              />
            </Stack>
            <Stack className={`panel ${checkActive(7, "act")}`}>
              <Components handleClick={handleClick} />
            </Stack>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}

////////
