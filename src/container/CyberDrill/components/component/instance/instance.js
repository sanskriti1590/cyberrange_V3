// import "./index.css";
import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, ListItemText, OutlinedInput, Stack, TextField, Typography, } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { getImageAndFlavourList } from "../../../../../APIConfig/scenarioConfig";
import { useDispatch } from "react-redux";
import { addInstance } from "../../../../../RTK/features/Infra/instanceSlice";


const Instances = ({ handleClick, networks }) => {
    const dispatch = useDispatch()
    const [but, setBut] = useState(true)
    const [age, setAge] = React.useState("");
    const [image, setImage] = React.useState([])
    const [flavor, setFlavor] = React.useState([])
    const [personName, setPersonName] = React.useState([]);

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
        name: '',
        network: [],
        image: '',
        flavor: '',
        team: '',
    })

    const [errors, setErrors] = useState({
        name: '',
        network: [],
        image: '',
        flavor: '',
        team: '',

        // Initialize errors state for other form fields
    });
    const validateInput = (name, value) => {
        // Implement your validation logic here
        // Return an error message if the input is invalid, otherwise return an empty string
        if (name === 'name' && value.trimLeft() === '') {
            return 'Name cannot be empty';
        }
        if (value.length < 4 && name == "name") {
            return "Value should be at least 4 characters long."
        }


        // Add validation rules for other form fields if needed

        // If input is valid, return an empty string
        return '';
    };


    useEffect(() => {
        if (Instance.name != "" || Instance.network != "" || Instance.image != "" || Instance.flavor != "" || Instance.team != "") {
            setBut(true)
        }
        if (Instance.name != "" && Instance.network != "" && Instance.image != "" && Instance.flavor != "" && Instance.team != "") {
            setBut(false)
        }
    }, [Instance])
    const changeHandler = (e) => {
        if (e.target.value === "ip_address") {
            setInstance({ ...Instance, [e.target.name]: e.target.value });
        } else {
            setInstance({ ...Instance, [e.target.name]: e.target.value });
        }

        // Validate the input and set errors state
        const validationError = validateInput(e.target.name, e.target.value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [e.target.name]: validationError,
        }));
    };

    const handleChangeNetwork = (event) => {
        setAge(event.target.value);
    };

    const handleInstance = () => {
        //console.log("component",Instance)
        const newErrors = {};
        if (Instance.name.trimLeft() === '') {
            newErrors.name = 'Name cannot be empty';
        }
        if (Instance.name.length < 4) {
            newErrors.name = "Value should be at least 4 characters long."
        }
        if (Instance.network.length === 0) {
            newErrors.network = "Select alteast one network."
        }
        if (Instance.flavor.length < 1) {
            newErrors.flavor = "Select alteast one flavor."
        }
        if (Instance.image.length < 1) {
            newErrors.image = "Select alteast one image."
        }

        if (Instance.team.length < 1) {
            newErrors.team = "Select alteast one team."
        }


        console.log(Object.keys(newErrors).length)
        // If there are errors, set the errors state to display the custom error messages
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Prevent form submission if there are errors
        }

        dispatch(addInstance(Instance))
        handleClick(6, Instance, 'Instance')
    }

    const handleNetworkChange = (event) => {
        const { target: { value }, } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        setInstance({ ...Instance, 'network': value });
    };

    useEffect(() => {
        setInstance((prevInstance) => ({
            ...prevInstance,
            network: personName
        }));
    }, [personName]);
    return (
        <Stack margin={5} gap={4}>
            <Stack gap={2}>
                <Typography variant="h1">Add Instances</Typography>
                <Typography variant="body1" color="#acacac !important">
                    An instance refers to a virtual machine (VM) or a computing resource that runs within a cloud infrastructure. Select the desired specifications such
                    as CPU, memory, storage, network, and operating system for your instances and add it to your scenario.
                </Typography>
            </Stack>

            <Stack width="100%">
                <TextField id="outlined-basic" label="Instance Name" variant="outlined" name="name" onChange={changeHandler} />
                {errors.name && <span className="error">{errors.name}</span>}

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
                            value={Instance.flavor}
                            label="Select hard disk ( flavor )"
                            name="flavor"
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
                    {errors.flavor && <span className="error">{errors.flavor}</span>}
                </Stack>
                <Stack width={`100%`}>
                    <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-name-label">Select Network</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={personName}
                            onChange={handleNetworkChange}
                            input={<OutlinedInput label="Netwo" />}
                            renderValue={(selected) => selected.join(', ')}
                            style={{ backgroundColor: "background.secondary" }}
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
                            {networks?.map((name, index) => (
                                <MenuItem key={index}
                                    value={name.network_name}
                                    style={{ backgroundColor: "background.secondary" }}>
                                    <Checkbox checked={personName.indexOf(name.network_name) > -1} />
                                    <ListItemText primary={name.network_name} />
                                </MenuItem>

                            ))}
                        </Select>
                    </FormControl>
                    {errors.network && <span className="error">{errors.network}</span>}
                </Stack>
                {/*<Stack width="100%">*/}
                {/*  <FormControl>*/}
                {/*    <InputLabel id="demo-simple-select-helper-label">*/}
                {/*      Select Network*/}
                {/*    </InputLabel>*/}
                {/*    <Select*/}
                {/*      label="Select Netw"*/}
                {/*      labelId="demo-simple-select-label"*/}
                {/*      id="demo-simple-select"*/}
                {/*      value={Instance.network}*/}
                {/*      name="network"*/}
                {/*      onChange={changeHandler}*/}

                {/*      sx={{*/}
                {/*        color: "white",*/}
                {/*        '.MuiOutlinedInput-notchedOutline': {*/}
                {/*          borderColor: '#acacac',*/}
                {/*        },*/}
                {/*        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {*/}
                {/*          borderColor: '#acacac',*/}
                {/*        },*/}
                {/*        '&:hover .MuiOutlinedInput-notchedOutline': {*/}
                {/*          borderColor: '#acacac',*/}
                {/*        },*/}
                {/*        '.MuiSvgIcon-root ': {*/}
                {/*          fill: "#acacac !important",*/}
                {/*        }*/}
                {/*      }}*/}
                {/*    >*/}
                {/*      {*/}
                {/*        networks?.map(item => {*/}
                {/*          return (*/}
                {/*            <MenuItem value={item.network_name} key={item.network_name}>*/}
                {/*              {item.network_name}*/}
                {/*            </MenuItem>*/}
                {/*          )*/}
                {/*        })*/}
                {/*      }*/}
                {/*    </Select>*/}
                {/*  </FormControl>*/}
                {/*  {errors.network && <span className="error">{errors.network}</span>}*/}
                {/*</Stack>*/}

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
                        value={Instance.image}
                        name="image"
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
                {errors.image && <span className="error">{errors.image}</span>}
            </Stack>

            {/* team selection */}
            <Stack width="100%">
                <FormControl>
                    <InputLabel id="demo-simple-select-helper-label">
                        Select Team
                    </InputLabel>
                    <Select
                        label="Select Te"
                        value={Instance.team}
                        name="team"
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
                        <MenuItem value="RED">Red Team</MenuItem>
                        <MenuItem value="BLUE">Blue Team</MenuItem>
                        <MenuItem value="PURPLE">Purple Team</MenuItem>
                        <MenuItem value="YELLOW">Yellow Team</MenuItem>
                    </Select>
                </FormControl>
                {errors.team && <span className="error">{errors.team}</span>}
            </Stack>
            {/* static ip */}
            <Stack width="100%">
                <TextField id="outlined-basic" label="Ip Address(optional)" variant="outlined" name="ip_address" onChange={changeHandler} />
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
