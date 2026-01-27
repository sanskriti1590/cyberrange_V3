import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import reImg from "../ActiveGame/2671.png";
import { activeGameList } from "../../../APIConfig/scenarioConfig";
import { activeGameVersion2 } from "../../../APIConfig/version2Scenario";
import ErrorHandler from "../../../ErrorHandler";

const TeamPlayer = ({ variant, user }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [items, setItems] = useState({
    scenarioName: "",
    description: "",
    category: "",
    points: "",
    time: "",
    severity: "",
    img: "",
    gameId: "",
    gameType: "",
    activeScenarioId: "",
    participantId: "",
  });
  const handleClickOpen = () => {
    navigate("/squad/scenarioCategory");
  };

  const { userss } = useSelector((state) => state.user);
  useEffect(() => {
    const getData = async () => {
      try {

        const data_dummy = await activeGameVersion2(userss?.user_id);
        const data = data_dummy?.data[0];


        setItems({
          scenarioName: data?.name,
          description: data?.description,
          category: data?.category_id,
          points: data?.scenario_score,
          time: data?.scenario_players_count,
          severity: data?.scenario_assigned_severity,
          img: data?.thumbnail_url,
          gameId: data?.active_scenario_id,
          gameType: data?.type,
          activeScenarioId: data?.active_scenario_id,
          participantId: data?.participant_id,
        });

      } catch (error) {
        ErrorHandler(error)
      }
    };

    const getData2 = async () => {
      try {
        const data = await activeGameList();
        setItems({
          scenarioName: data?.data?.scenario_name,
          description: data?.data?.scenario_description,
          category: data?.data?.scenario_category_name,
          points: data?.data?.scenario_score,
          time: data?.data?.scenario_players_count,
          severity: data?.data?.scenario_assigned_severity,
          img: data?.data?.scenario_thumbnail,
          gameId: data?.data?.scenario_game_id,
          activeScenarioId: data?.data?.active_scenario_id,
          participantId: data?.data?.participant_id,
        });
      } catch (error) {
        ErrorHandler(error)
      }
    };
    if (variant == "corporate") {
      getData();
    } else {

      getData2();
    }
  }, [load, variant]);


  return (
    <Stack spacing={2} margin={5} display="flex" width="96%">
      <Stack>
        {!items.gameId ? (
          <Stack justifyContent="center" alignContent="center" width="100%">
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
                There are no active running Squad games at the moment. When you
                participate in any Squad, that game will be listed here. If you
                wish to play now, you can start by clicking on the 'Play Now'
                button
              </Typography>
            </Stack>
            <Stack justifyContent="center" alignItems="center">
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
        ) : (
          <Card
            items={items}
            screen="activegame"
            setLoad={setLoad}
            load={load}
            variant={variant}
            gameType={items?.gameType}
            activeScenarioId={items?.activeScenarioId}
            participantId={items?.participantId}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default TeamPlayer;
