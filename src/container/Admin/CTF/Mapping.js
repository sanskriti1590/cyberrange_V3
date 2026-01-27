import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { submitctf } from "../../../APIConfig/CtfConfig";
import { toast } from "react-toastify";


import { getImageAndFlavourList } from "../../../APIConfig/scenarioConfig";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { getctfId } from "../../../APIConfig/CtfConfig";
import { mapCtfId, unmappedCtf } from "../../../APIConfig/adminConfig";



const Map = () => {
  const [image, setImage] = React.useState([]);
  const [id, ctf_name] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [age, setAge] = React.useState("");
  const [selectValue, setSelectVAlue] = React.useState({});
  const [reload, setReload] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [Instance, setInstance] = useState({
    ctf_id: "",
    ctf_target_image_id: "",
    ctf_target_flavor_id: "",
    ctf_time: "",
    ctf_attacker_image_id: "",
    ctf_attacker_flavor_id: "",
    ctf_score: "",
    ctf_attacker_username: "",
    ctf_attacker_password: "",
    ctf_for_premium_user: false,
  });

  const token = localStorage.getItem("access_token");

  const [items, setitem] = useState([]);

  const handleclick = async () => {
    try {
      setIsActive(true);

      const response = await submitctf(Instance);

      toast.success("CTF Game Mapping: Successful");
      setReload(!reload);
      setIsActive(false);
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

  useEffect(() => {
    const getApi = async () => {
      setData([]);
      ctf_name([]);
      const response = await getctfId();
      const mapp = await mapCtfId();
      response?.data && ctf_name(response?.data);
      mapp?.data && setData(mapp?.data);
    };

    getApi();
  }, [reload]);

  useEffect(() => {
    const getApi = async () => {
      const response = await getImageAndFlavourList();

      response?.data?.images && setImage(response?.data?.images);
      response?.data?.flavors && setitem(response?.data?.flavors);

    };

    getApi();
  }, []);

  const handleChange = (event) => {
    setAge(event.target.value);
    setSelectVAlue(event.target.value);
  };

  const changeHandlers = (e) => {
    setInstance({ ...Instance, [e.target.name]: e.target.value });

  };

  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowChangePassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmitChanges = () => {
    setIsActive(true);
    //console.log('selected value', selectValue)
    const value = unmappedCtf(selectValue);
    setReload(!reload);
    setAge("");
    setSelectVAlue("");
    //console.log('value', value)
    if (value) {
      toast.success("your ctf has been un-mapped");
    }
    setIsActive(false);
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Stack margin={5} gap={4}>
        <Stack direction="row" justifyContent="space-around">
          <Typography variant="h1">Ctf Mapping</Typography>
          <Typography variant="h1">Un-Mapping</Typography>
        </Stack>
        <Stack direction="row" gap={12}>
          {/*form side*/}
          <Stack width="55%" gap={3} marginTop={1}>
            <Box
              sx={{
                minWidth: 120,
                borderRadius: "8px",
              }}
            >
              <Stack width="100%">
                <FormControl>
                  <InputLabel id="demo-simple-select-helper-label">
                    Ctf_id
                  </InputLabel>
                  <Select
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "GrayText",
                      },
                    }}
                    label="Select Image"
                    value={Instance.ctf_id}
                    name="ctf_id"
                    onChange={changeHandlers}
                  >
                    {id?.map((item) => {
                      return (
                        <MenuItem value={item.ctf_id} key={item.ctf_id}>
                          {item.ctf_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Box
              sx={{
                minWidth: 120,

                borderRadius: "8px",
              }}
            >
              <Stack width="100%">
                <FormControl>
                  <InputLabel id="demo-simple-select-helper-label">
                    Target Flavor_id
                  </InputLabel>
                  <Select
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "GrayText",
                      },
                    }}
                    label="Select Image"
                    value={Instance.ctf_target_flavor_id}
                    name="ctf_target_flavor_id"
                    onChange={changeHandlers}
                  >
                    {items?.map((item) => {
                      return (
                        <MenuItem value={item.flavor_id} key={item.flavor_id}>
                          {item?.flavor_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Box
              sx={{
                minWidth: 120,
                borderRadius: "8px",
              }}
            >
              <Stack width="100%">
                <FormControl>
                  <InputLabel id="demo-simple-select-helper-label">
                    Target Image
                  </InputLabel>
                  <Select
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "GrayText",
                      },
                    }}
                    label="Select Image"
                    value={Instance.ctf_target_image_id}
                    name="ctf_target_image_id"
                    onChange={changeHandlers}
                  >
                    {image?.map((item) => {
                      return (
                        <MenuItem value={item.image_id} key={item.image_id}>
                          {item.image_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Stack width="100%">
              <TextField
                id="outlined-basic"
                label="Time Duration"
                variant="outlined"
                name="ctf_time"
                onChange={changeHandlers}
              />
            </Stack>

            <Box
              sx={{
                minWidth: 120,
                borderRadius: "8px",
              }}
            >
              <Stack width="100%">
                <FormControl>
                  <InputLabel id="demo-simple-select-helper-label">
                    Select Image
                  </InputLabel>

                  <Select
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "GrayText",
                      },
                    }}
                    label="Select Image"
                    value={Instance.ctf_attacker_image_id}
                    name="ctf_attacker_image_id"
                    onChange={changeHandlers}
                  >
                    {image?.map((item) => {
                      //console.log("image", item);
                      return (
                        <MenuItem value={item.image_id} key={item.image_id}>
                          {item.image_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Box
              sx={{
                minWidth: 120,

                borderRadius: "8px",
              }}
            >
              <Stack width="100%">
                <FormControl>
                  <InputLabel id="demo-simple-select-helper-label">
                    Flavor_id
                  </InputLabel>
                  <Select
                    sx={{
                      "& .MuiSvgIcon-root": {
                        color: "GrayText",
                      },
                    }}
                    label="Select Image"
                    value={Instance.ctf_attacker_flavor_id}
                    name="ctf_attacker_flavor_id"
                    onChange={changeHandlers}
                  >
                    {items?.map((item) => {
                      return (
                        <MenuItem value={item?.flavor_id} key={item?.flavor_id}>
                          {item?.flavor_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Stack width="100%">
              <TextField
                id="outlined-basic"
                label="Score"
                variant="outlined"
                onChange={changeHandlers}
                name="ctf_score"
              />
            </Stack>

            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <input
                placeholder="Username"
                style={{
                  background: "transparent",
                  padding: 4,
                  borderRadius: "8px",
                  color: "#acacac",
                  border: "2px solid #ACACAC",
                  height: "55px",
                  // color: "#12464C",
                  width: "100%",
                }}
                type="ctf_attacker_username"
                label="username"
                name="ctf_attacker_username"
                onChange={changeHandlers}
                value={Instance.username}
              />
            </Box>

            <FormControl
              sx={{ width: "100%" }}
              variant="outlined"
              borderRadius="8px"
              border="2px"
            >
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                InputLabelProps={{
                  shrink: false, // Set shrink to false to stop the label animation
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff sx={{ color: "white" }} />
                      ) : (
                        <Visibility sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                // key="password"
                name="ctf_attacker_password"
                placeholder="Password"
                onChange={changeHandlers}
                value={Instance.password}
              />
            </FormControl>

            <Button
              sx={{ fontWeight: "bold", width: "30%" }}
              variant="contained"
              color="secondary"
              onClick={handleclick}
            >
              Submit
            </Button>
          </Stack>
          <Stack border="1px solid #12464C" height="100vh"></Stack>
          <Stack width="44%" gap={5}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Scenario
              </InputLabel>
              <Select
                name="scenario_id"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Select Scenario"
                onChange={handleChange}
              >
                if(data){" "}
                {data?.map((item) => {
                  return (
                    <MenuItem
                      value={item.ctf_mapping_id}
                      key={item.ctf_mapping_id}
                    >
                      {item.ctf_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              style={{ width: "80px" }}
              onClick={handleSubmitChanges}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default Map;
