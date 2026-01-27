import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import {
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import image1 from "../../../assests/Frame 165.png";
import { useEffect } from "react";
import { useState } from "react";
import reImg from "../../ActiveGame/2671.png";
import { activeScenarioList } from "../../../APIConfig/scenarioConfig";
import ActiveCard from "../../ViewScenariosCommon/activeCard";




export default function ActiveGameScenario() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [items, setItems] = useState({})

  const handleClickOpen = () => {
    navigate("/categories")
  };



  const [scenariosDatas, setScenarioDatas] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const data = await activeScenarioList();
      data?.data && setItems({
        scenarioName: data?.data.scenario_name,
        description: data?.data?.scenario_description,
        category: data?.data.scenario_category_name,
        points: data?.data.scenario_score,
        time: data?.data.scenario_players_count,
        severity: data?.data.scenario_assigned_severity,
        img: data?.data.scenario_thumbnail,
        gameId: data?.data.scenario_game_id



      })

    };
    getData();



  }, [load]);
  const value = [
    {
      title: "hardware",
      img: "https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg",
      desp: "asdgfasdfasdf",
    },
    {
      title: "mobile",
      img: "https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg",
      desp: "asdh asdkahsdf  aisdhfajsd f asdghaisd g aisdhfiojashd fpiu ahpg",
    },
    {
      title: "cypto",
      img: "https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg",
      desp: "sdfhaks asd fiausdhf aisdhfioah dfuioaheuf",
    },
    {
      title: "web",
      img: "https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg",
      desp: "asdfasfd asdfasdfasdf asdfasdf  asdfasfdasdf",
    },
  ];
  const breadcrumbs = [
    <Link underline="hover" key="1" color="#ACACAC" href="/">
      Dashboard
    </Link>,
    <Link underline="hover" key="2" color="#ACACAC" href="/categories">
      CTF
    </Link>,
    <Link underline="hover" key="3" color="#ACACAC" href="/activemachine">
      Active Machine
    </Link>,
  ];
  const scenariosData = [
    {
      category: "category 1",
      points: "50",
      time: "90",
      severity: "very hard",
      img: image1,
      scenarioName: "Test scenario 1",
      description:
        "If you’ve never experienced a CTF event before, don’t get frustrated or give up, because the key to any type of hacking is patience.",
      cpu: "7 vCPU",
      hdSpace: "82GB",
      ram: "11GB",
      machine: "4 VMs",
    },
    {
      category: "category 1",
      points: "50",
      time: "90",
      severity: "very hard",
      img: image1,
      scenarioName: "Test scenario 2",
      description:
        "If you’ve never experienced a CTF event before, don’t get frustrated or give up, because the key to any type of hacking is patience.",
      cpu: "7 vCPU",
      hdSpace: "82GB",
      ram: "11GB",
      machine: "4 VMs",
    },
    {
      category: "category 1",
      points: "50",
      time: "90",
      severity: "very hard",
      img: image1,
      scenarioName: "Test scenario 3",
      description:
        "If you’ve never experienced a CTF event before, don’t get frustrated or give up, because the key to any type of hacking is patience.",
      cpu: "7 vCPU",
      hdSpace: "82GB",
      ram: "11GB",
      machine: "4 VMs",
    },
    {
      category: "category 1",
      points: "50",
      time: "90",
      severity: "very hard",
      img: image1,
      scenarioName: "Test scenario 4",
      description:
        "If you’ve never experienced a CTF event before, don’t get frustrated or give up, because the key to any type of hacking is patience.",
      cpu: "7 vCPU",
      hdSpace: "82GB",
      ram: "11GB",
      machine: "4 VMs",
    },
    {
      category: "category 1",
      points: "50",
      time: "90",
      severity: "very hard",
      img: image1,
      scenarioName: "Test scenario 5",
      description:
        "If you’ve never experienced a CTF event before, don’t get frustrated or give up, because the key to any type of hacking is patience.",
      cpu: "7 vCPU",
      hdSpace: "82GB",
      ram: "11GB",
      machine: "4 VMs",
    },
  ];


  return (
    <Stack spacing={2} margin={5} display="flex" width="96%">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        color="#acacac"
      >
        {breadcrumbs}
      </Breadcrumbs>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h1">Active Scenarios Games</Typography>
      </Stack>
      <Stack>
        {scenariosDatas ? <ActiveCard items={items} screen="activegame" setLoad={setLoad} load={load} />
          : (
            <Stack
              justifyContent="center"
              alignContent="center"
              width="100%"
            >
              <Stack alignItems="center" justifyContent="center" padding={8}>
                <img
                  src={reImg}
                  alt="2671.png"
                  style={{ width: "269px", height: "179px" }}
                />
                <Typography
                  style={{ fontSize: 15, color: "#ACACAC" }}
                  sx={{ mb: 0.5 }}
                  variant="h14"
                >
                  There are no active running CTF games at the moment. When you
                  participate in any CTF, that game will be listed here. If you wish to
                  play now, you can start by clicking on the 'Play Now' button
                </Typography>
              </Stack>
              <Stack justifyContent='center' alignItems='center' >
                <Button
                  sx={{ display: "flex", fontWeight: "bold", width: "180px" }}
                  variant="contained"
                  color="secondary"
                  onClick={handleClickOpen}
                >
                  Play Now
                </Button>

              </Stack>
            </Stack>
          )}
      </Stack>

    </Stack>
  );
}
