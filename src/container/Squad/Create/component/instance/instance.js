import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
// import "./index.css";
import { useState } from "react";
import { useEffect } from "react";
import { getImageAndFlavourList } from "../../../../../APIConfig/scenarioConfig";
import { useDispatch } from "react-redux";
import { addInstance } from "../../../../../RTK/features/Infra/instanceSlice";

const Instances = ({ handleClick, networks }) => {
  const dispatch = useDispatch()
  const [age, setAge] = React.useState("");
  const [image, setImage] = React.useState([])
  const [flavor, setFlavor] = React.useState([])

  useEffect(() => {
    const getApi = async () => {
      const response = await getImageAndFlavourList()
      if (response?.data) {
        setImage(response?.data?.images)
        setFlavor(response?.data?.flavors)
      }
    }

    getApi()
  }, [])

  const [Instance, setInstance] = useState({
    instance_name: '',
    network_location: '',
    image_id: '',
    flavor_id: '',
    instance_for: '',
    instance_ip: ''
  })

  const changeHandler = (e) => {
    setInstance({ ...Instance, [e.target.name]: e.target.value });
  };

  const handleChangeNetwork = (event) => {
    setAge(event.target.value);
  };

  const handleInstance = () => {
    //console.log("component",Instance)
    dispatch(addInstance(Instance))
    handleClick(6, Instance, 'Instance')
  }
  return (
    <Stack margin={5} gap={4} >
      <Stack gap={2}>
        <Typography variant="h1">Add Instances</Typography>
        <Typography variant="body1" color="#acacac !important">
          An instance refers to a virtual machine (VM) or a computing resource that runs within a cloud infrastructure. Select the desired specifications such as CPU, memory, storage, network, and operating system for your instances and add it to your scenario.
        </Typography>
      </Stack>

      <Stack width="100%" >
        <TextField id="outlined-basic" label="Instance Name" variant="outlined" name="instance_name" onChange={changeHandler} />
      </Stack>
      <Stack width="100%" direction="row" gap={2}>

        <Stack width="100%">
          <FormControl>
            <InputLabel id="demo-simple-select-helper-label">
              Select hard disk ( flavor )
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={Instance.flavor_id}
              label="Select hard disk ( flavor )"
              name="flavor_id"
              onChange={changeHandler}
              sx={{
                color: "white",
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#acacac',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#acacac',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#acacac',
                },
                '.MuiSvgIcon-root ': {
                  fill: "#acacac !important",
                }
              }}
            >
              {
                flavor?.map(item => {
                  return (
                    <MenuItem value={item.flavor_id} key={item.flavor_id}>
                      {item.flavor_name}
                    </MenuItem>
                  )
                })
              }


            </Select>
          </FormControl>
        </Stack>
        <Stack width="100%">
          <FormControl>
            <InputLabel id="demo-simple-select-helper-label">
              Select Network
            </InputLabel>
            <Select
              label="Select Netw"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={Instance.network_location}
              name="network_location"
              onChange={changeHandler}

              sx={{
                color: "white",
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: '#acacac',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#acacac',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#acacac',
                },
                '.MuiSvgIcon-root ': {
                  fill: "#acacac !important",
                }
              }}
            >
              {
                networks?.map(item => {
                  return (
                    <MenuItem value={item.network_name} key={item.network_name}>
                      {item.network_name}
                    </MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Stack width="100%">
        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">
            Select Image
          </InputLabel>
          <Select
            sx={{
              color: "white",
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#acacac',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#acacac',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#acacac',
              },
              '.MuiSvgIcon-root ': {
                fill: "#acacac !important",
              }
            }}
            label="Select Image"
            value={Instance.image_id}
            name="image_id"
            onChange={changeHandler}
          >
            {
              image?.map(item => {
                return (
                  <MenuItem value={item.image_id} key={item.image_id}>
                    {item.image_name}
                  </MenuItem>
                )
              })
            }


          </Select>
        </FormControl>
      </Stack>

      {/* team selection */}
      <Stack width="100%">
        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">
            Select Team
          </InputLabel>
          <Select
            label="Select Te"
            value={Instance.instance_for}
            name="instance_for"
            onChange={changeHandler}

            sx={{
              color: "white",
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#acacac',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#acacac',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#acacac',
              },
              '.MuiSvgIcon-root ': {
                fill: "#acacac !important",
              }
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Red Team">Red Team</MenuItem>
            <MenuItem value="Blue Team">Blue Team</MenuItem>
            <MenuItem value="Purple Team">Purple Team</MenuItem>
            <MenuItem value="Yellow Team">Yellow Team</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {/* static ip */}
      <Stack width="100%" >
        <TextField id="outlined-basic" label="Ip Address(optional)" variant="outlined" name="instance_ip" onChange={changeHandler} />
      </Stack>
      <Box mb={2}>
        <Button variant="contained" color="secondary" onClick={handleInstance}>
          Add Instance
        </Button>
        <Typography variant="body2" sx={{ color: "#acacac !important", mt: 2 }}>
          {" "}
          <span className="note">Note:</span> To add a Instance, make sure you
          have one separate network available for connection.
        </Typography>
      </Box>
    </Stack>
  );
};

export default Instances;
