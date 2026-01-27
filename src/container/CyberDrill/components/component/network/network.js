import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { networkAdded } from "../../../../../RTK/features/Infra/networkSlice";
import { nanoid } from "@reduxjs/toolkit";

const Network = ({ handleClick }) => {
  const [but, setBut] = useState(true)
  const dispatch = useDispatch()
  const [network, setNetwork] = useState({
    network_name: '',
    subnet_name: '',
    cidr_ip: '',
  })

  const [errors, setErrors] = useState({
    network_name: '',
    subnet_name: '',
    cidr_ip: '',

    // Initialize errors state for other form fields
  });

  useEffect(() => {
    if (network.network_name != "" || network.subnet_name != "" || network.cidr_ip != "") {
      setBut(true)
    }
    if (network.network_name != "" && network.subnet_name != "" && network.cidr_ip != "") {
      setBut(false)
    }
  }, [network])
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setNetwork({ ...network, [e.target.name]: e.target.value });

    // Validate the input and set errors state
    const validationError = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationError,
    }));
  };

  const validateCIDR = (cidr) => {
    const cidrRegex = /^(?:\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    return cidrRegex.test(cidr);
  };

  const validateInput = (name, value) => {
    // Implement your validation logic here
    // Return an error message if the input is invalid, otherwise return an empty string
    if (name === 'network_name' && value.trimLeft() === '') {
      return 'Name cannot be empty';
    }
    if (value.length < 4) {
      return "Value should be at least 4 characters long."
    }

    if (name === 'subnet_name' && value.trimLeft() === '') {
      return 'subnet cannot be empty';
    }
    if (name === 'cidr_ip' && !validateCIDR(value)) {
      return 'Enter a correct Ip Address';
    }

    // Add validation rules for other form fields if needed

    // If input is valid, return an empty string
    return '';
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform final validation on submission
    const newErrors = {};
    if (network.network_name.trimLeft() === '') {
      newErrors.network_name = 'Name cannot be empty';
    }

    if (network.subnet_name.trimLeft() === '') {
      newErrors.subnet_name = 'Subnet cannot be empty';
    }

    if (network.cidr_ip.trimLeft() === '') {
      newErrors.cidr_ip = 'CIDR ip cannot be empty';
    }

    // If there are errors, set the errors state to display the custom error messages
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent form submission if there are errors
    }



    dispatch(networkAdded(network))
    // Process form data if it's valid
    handleClick(2, network, 'network')

    // TODO: Submit the form to the server or perform any other actions
  };
  return (
    <Stack margin={5} gap={4}>
      <Stack gap={2}>
        <Typography variant="h1">Add Network</Typography>
        <Typography variant="body1" color="#acacac !important">
          In a Cyber Range Solo, network challenges are a crucial component that focuses on assessing participants' knowledge and skills related to network security, protocols, and analysis. These challenges simulate real-world squad and require participants to analyze and manipulate network traffic, identify vulnerabilities, and protect network infrastructure. Here are some examples of network challenges that can be included:
        </Typography>
      </Stack>
      <Stack gap={2} width="100%" direction="row">
        <Stack width="100%">
          <TextField
            id="outlined-basic"
            label="Network Name"
            variant="outlined"
            value={network.network_name}
            name="network_name"
            onChange={changeHandler}
          />
          {errors.network_name && <span className="error">{errors.network_name}</span>}
        </Stack>
        <Stack width="100%">
          <TextField
            id="outlined-basic"
            label="Subnet Name"
            variant="outlined"
            value={network.subnet_name}
            name="subnet_name"
            onChange={changeHandler}
          />
          {errors.subnet_name && <span className="error">{errors.subnet_name}</span>}
        </Stack>
      </Stack>
      <Stack width="100%">
        <TextField
          id="outlined-basic"
          label="CIDR IP Range"
          variant="outlined"
          value={network.cidr_ip}
          name="cidr_ip"
          onChange={changeHandler}
        />
        {errors.cidr_ip && <span className="error">{errors.cidr_ip}</span>}
      </Stack>
      <Box gap={2}>
        <Button variant="contained" color="secondary" onClick={handleSubmit} >
          Add Network
        </Button>
      </Box>
    </Stack>
  );
};

export default Network;
