import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/material";
import "../MachineProfile/index.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ratingMachineWebScenario } from "../../APIConfig/webScenarioConfig";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function PopupWeb({
  id,
  setOpen,
  open,
  endGameConsole,
  data,
  playerId,
}) {
  const navigate = useNavigate();
  const [color, setColor] = React.useState(-1);
  const [value, setValue] = React.useState({
    payed_game_id: id,
    ratings: null,
    message: "",
  });

  const handleClose = async () => {
    try {
      await ratingMachineWebScenario(playerId, value);
      setOpen(false);
      navigate("/");
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

  const score = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 3,
    },
    {
      value: 4,
    },
    {
      value: 5,
    },
  ];

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={endGameConsole}>
        End
      </Button>
      <BootstrapDialog open={open}>
        <DialogContent className="" sx={{ backgroundColor: "#16181F" }}>
          <Stack
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            backgroundColor="custom.main"
          >
            <Stack
              display="flex"
              width="60vw"
              height="80%"
              flexDirection="column"
              p={4}
            >
              <Stack gap={1}>
                <Typography variant="h2">
                  Score Earned :
                  <span style={{ color: "#0ff", fontSize: "24px" }}>
                    {" "}
                    {data?.data?.ctf_score_obtained}/
                  </span>
                  <span style={{ color: "#0ff", fontSize: "24px" }}>
                    {data?.data?.ctf_score}
                  </span>
                  {""}
                </Typography>
                <Stack>
                  <Typography
                    variant="body1"
                    sx={{ color: "#9C9EA3 !important" }}
                  >
                    We'd love to hear your thoughts on the game difficulty! Was
                    it too easy, just right, or too hard?
                    <br />
                    Your feedback is invaluable for enhancing your gaming
                    experience.
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  style={{ padding: "15px" }}
                >
                  {score?.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: color === index ? "#0CC" : "#1C1F28",
                          "&:hover": {
                            backgroundColor: "#0CC",
                            transition: "all 0.3s ease",
                          },
                        }}
                        display="flex"
                        height="48px"
                        width="48px"
                        justifyContent="center"
                        alignItems="center"
                        borderRadius="8px"
                        border="1px solid #F4F4F4"
                        onClick={(e) => {
                          setValue({
                            payed_game_id: id,
                            ratings: index + 1,
                            message: "",
                          });
                          setColor(index);
                        }}
                      >
                        {item.value}
                      </Box>
                    );
                  })}
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    variant="body2"
                    sx={{ color: "#9C9EA3 !important" }}
                  >
                    Extremely Easy
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#9C9EA3 !important" }}
                  >
                    Thoughest
                  </Typography>
                </Stack>
              </Stack>
              <DialogActions>
                <Button
                  display="flex"
                  variant="contained"
                  color="secondary"
                  disabled={value?.ratings ? false : true}
                  onClick={handleClose}
                >
                  Submit
                </Button>
              </DialogActions>
            </Stack>
          </Stack>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
