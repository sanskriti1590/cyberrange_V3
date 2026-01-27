import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { Stack } from "@mui/system";
import "./index.css";
import { useState } from "react";

import Network from "./component/network/network";
import ViewAllNetwork from "./component/network/viewAllNetwork";
import Router from "./component/router/router";
import ViewAllRouter from "./component/router/viewAllRouter";
import Instances from "./component/instance/instance";
import ViewAllInstances from "./component/instance/viewAllInstances";
import Components from "./component/components/components";
import Firewall from "./component/firewall/firewall";
import ViewAllFirewalls from "./component/firewall/ViewAllFirewalls";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import { BsXDiamond } from "react-icons/bs";
import { GiMeshNetwork } from "react-icons/gi";
import { RxLoop } from "react-icons/rx";

import { useParams, useNavigate } from "react-router-dom";
import { createScenarioInfra } from "../api";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InfraCreate() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();

  const [net, setNet] = useState([]);
  const [rot, setRot] = useState([]);
  const [ins, setIns] = useState([]);
  const [firew, setFirew] = useState([]);
  const [load, setLoad] = useState(false);

  // UI state
  const [changes, setChanges] = useState(false);
  const [router, setRouter] = useState(false);
  const [instance, setInstance] = useState(false);
  const [firewall, setFirewall] = useState(false);
  const [activeIndex, setActiveIndex] = useState(7);

  // ✅ Dialog OPEN BY DEFAULT (no button)
  const [open, setOpen] = useState(true);

  // ---------------- SUBMIT INFRA ----------------
  const submitInfra = async () => {
    try {
      await createScenarioInfra(scenarioId,{
          scenario_infra: {
          networks: net,
          routers: rot,
          instances: ins,
          firewall: firew,
        },
      });

      navigate("/createCorporate/endingPage");
    } catch (error) {
      console.error(error?.response?.data || error?.message);
      alert("Infra creation failed");
    }
  };

  // ---------------- HELPERS ----------------
  const handleClick = (index, value, name) => {
    if (name === "network") setNet((p) => [...p, value]);
    if (name === "router") setRot((p) => [...p, value]);
    if (name === "Instance") setIns((p) => [...p, value]);
    if (name === "firewall") setFirew((p) => [...p, value]);
    setActiveIndex(index);
  };

  const checkActive = (index, className) =>
    activeIndex === index ? className : "";

  const DelNet = (index) => {
    net.splice(index, 1);
    setLoad(!load);
  };

  const DelRot = (index) => {
    rot.splice(index, 1);
    setLoad(!load);
  };

  const DelIns = (index) => {
    ins.splice(index, 1);
    setLoad(!load);
  };

  // ---------------- UI ----------------
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
        },
      }}
    >
      {/* MAIN CONTAINER */}
      <Stack
        direction="row"
        bgcolor="custom.main"
        width="100%"
        height="100%"
      >
        {/* LEFT SIDEBAR */}
        <Stack
          className="tabs"
          height="100%"
          minWidth="17%"
          gap={4}
          justifyContent="center"
          pl="3%"
          sx={{ backgroundColor: "#212121" }}
        >
          {/* Inventory */}
          <Stack
            direction="row"
            onClick={() => handleClick(7)}
            sx={{ cursor: "pointer" }}
          >
            <Typography className={`tab ${checkActive(7, "act")}`} variant="h3">
              <BsXDiamond /> Inventory
            </Typography>
          </Stack>

          {/* Network */}
          <Stack gap={2}>
            <Stack onClick={() => setChanges(!changes)} direction="row">
              <Typography variant="h3">
                <GiMeshNetwork /> Network
              </Typography>
              {changes ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Stack>

            {changes && (
              <>
                <Typography
                  className={`tab ${checkActive(1, "act")}`}
                  onClick={() => setActiveIndex(1)}
                >
                  Add Network <ArrowForwardIosIcon fontSize="small" />
                </Typography>
                <Typography
                  className={`tab ${checkActive(2, "act")}`}
                  onClick={() => setActiveIndex(2)}
                >
                  View Networks <ArrowForwardIosIcon fontSize="small" />
                </Typography>
              </>
            )}
          </Stack>

          {/* Router */}
          <Stack gap={2}>
            <Stack onClick={() => setRouter(!router)} direction="row">
              <Typography variant="h3">
                <RxLoop /> Router
              </Typography>
              {router ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Stack>

            {router && (
              <>
                <Typography
                  className={`tab ${checkActive(3, "act")}`}
                  onClick={() => setActiveIndex(3)}
                >
                  Add Router <ArrowForwardIosIcon fontSize="small" />
                </Typography>
                <Typography
                  className={`tab ${checkActive(4, "act")}`}
                  onClick={() => setActiveIndex(4)}
                >
                  View Routers <ArrowForwardIosIcon fontSize="small" />
                </Typography>
              </>
            )}
          </Stack>

          {/* Instance */}
          <Stack gap={2}>
            <Stack onClick={() => setInstance(!instance)} direction="row">
              <Typography variant="h3">
                <ViewInArIcon /> Instance
              </Typography>
              {instance ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Stack>

            {instance && (
              <>
                <Typography
                  className={`tab ${checkActive(5, "act")}`}
                  onClick={() => setActiveIndex(5)}
                >
                  Add Instance <ArrowForwardIosIcon fontSize="small" />
                </Typography>
                <Typography
                  className={`tab ${checkActive(6, "act")}`}
                  onClick={() => setActiveIndex(6)}
                >
                  View Instances <ArrowForwardIosIcon fontSize="small" />
                </Typography>
              </>
            )}
          </Stack>
        </Stack>

        {/* RIGHT PANELS */}
        <Stack className="panels" sx={{ width: "83%", height: "100%" }}>
          <Stack className={`panel ${checkActive(1, "act")}`}>
            <Network handleClick={handleClick} />
          </Stack>
          <Stack className={`panel ${checkActive(2, "act")}`}>
            <ViewAllNetwork networks={net} DelNet={DelNet} load={load} />
          </Stack>
          <Stack className={`panel ${checkActive(3, "act")}`}>
            <Router handleClick={handleClick} networks={net} />
          </Stack>
          <Stack className={`panel ${checkActive(4, "act")}`}>
            <ViewAllRouter router={rot} DelRot={DelRot} load={load} />
          </Stack>
          <Stack className={`panel ${checkActive(5, "act")}`}>
            <Instances handleClick={handleClick} networks={net} />
          </Stack>
          <Stack className={`panel ${checkActive(6, "act")}`}>
            <ViewAllInstances
              instance={ins}
              submitInfra={submitInfra}
              DelIns={DelIns}
              load={load}
            />
          </Stack>
          <Stack className={`panel ${checkActive(7, "act")}`}>
            <Components />
          </Stack>
          <Stack className={`panel ${checkActive(8, "act")}`}>
            <Firewall handleClick={handleClick} networks={net} />
          </Stack>
          <Stack className={`panel ${checkActive(9, "act")}`}>
            <ViewAllFirewalls
              handleClick={handleClick}
              firewalls={firew}     
              DelIns={DelIns}
              load={load}
            />
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
}
