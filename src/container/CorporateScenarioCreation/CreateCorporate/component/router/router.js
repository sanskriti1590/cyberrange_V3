import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "./index.css";
import { useState } from "react";
import MultipleSelect from "./MultipleSelect";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { routerAdded } from "../../../../RTK/features/Infra/routerSlice";
import { routerAdded } from "../../../../../RTK/features/Infra/routerSlice";

const Router = ({ handleClick, networks }) => {
  const dispatch = useDispatch()
  const [but, setBut] = useState(true)
  const [checked, setChecked] = React.useState(true);

  const [router, setRouter] = useState({
    name: '',
    is_internet_required: true,
    network_name: []
  })

  const [errors, setErrors] = useState({
    name: '',
    is_internet_required: true,
    network_name: []
    // Initialize errors state for other form fields
  });

  useEffect(() => {
    //console.log('router', router)
    if (router.name != "" || router.network_name != []) {
      setBut(true)
    }
    if (router.name != "" && router.network_name != []) {
      setBut(false)
    }
  }, [router])

  const handleCheck = (event) => {
    setChecked(event.target.checked);
    setRouter({ ...router, [event.target.name]: event.target.checked });

  };
  const [age, setAge] = React.useState("");

  const handleChangeNetwork = (event) => {
    setAge(event.target.value);
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setRouter({ ...router, [e.target.name]: e.target.value });
    //console.log(router);
    // Validate the input and set errors state
    const validationError = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationError,
    }));
  };

  const validateInput = (name, value) => {
    // Implement your validation logic here
    // Return an error message if the input is invalid, otherwise return an empty string
    if (name === 'name' && value.trimLeft() === '') {
      return 'Name cannot be empty';
    }
    if (value.length < 4) {
      return "Value should be at least 4 characters long."
    }




    // Add validation rules for other form fields if needed

    // If input is valid, return an empty string
    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform final validation on submission
    const newErrors = {};
    if (router.name.trimLeft() === '') {
      newErrors.name = 'Name cannot be empty';
    }
    if (router.name.length < 4) {
      newErrors.name = "Value should be at least 4 characters long."
    }
    if (router.network_name.length < 1) {
      newErrors.network_name = "Select alteast one network."
    }




    console.log(Object.keys(newErrors).length)
    // If there are errors, set the errors state to display the custom error messages
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Prevent form submission if there are errors
    }

    // added to redux
    dispatch(routerAdded(router))
    // Process form data if it's valid
    handleClick(4, router, 'router')

    // TODO: Submit the form to the server or perform any other actions
  };
  return (
    <Stack margin={5} gap={4}>
      <Stack gap={2}>
        <Typography variant="h1">Add Router</Typography>
        <Typography variant="body1" color="#acacac !important">
          A company has multiple departments with different security requirements. The network infrastructure needs to be segmented to enhance security and control access between departments. As a participant, your task is to add a router to the existing network and configure it to achieve the following objectives:
        </Typography>
      </Stack>

      <Stack width="100%">
        <TextField id="outlined-basic" label="Router Name" variant="outlined"
          name="name"
          onChange={changeHandler} />
        {errors.name && <span className="error">{errors.name}</span>}

      </Stack>
      <Stack
        width="100%"
        border="1px solid #acacac"
        borderRadius="4px"
        p={1}
        alignItems="center"
        justifyContent="space-between"
        direction="row"
      >
        <Typography color="#acacac !important">
          Do you have External Gateway ?
        </Typography>
        <Checkbox
          name="is_internet_required"
          checked={checked}
          onChange={handleCheck}
          inputProps={{ "aria-label": "controlled" }}
          sx={{ color: "#acacac !important" }}
        />

      </Stack>
      <Stack width="100%">
        {/* <FormControl>
          <InputLabel id="demo-simple-select-helper-label">
            Select internal Network
          </InputLabel>
          <Select
            value={age}
            label="Select internal Network"
            onChange={handleChangeNetwork}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl> */}
        <MultipleSelect networks={networks} setRouter={setRouter} router={router} />
        {errors.network_name && <span className="error">{errors.network_name}</span>}

      </Stack>
      <Box gap={2}>
        <Button variant="contained" color="secondary" onClick={handleSubmit} >
          Add Router
        </Button>
        <Typography variant="body2" sx={{ color: "#acacac !important", mt: 2 }}>
          {" "}
          <span className="note">Note:</span> To add a router, make sure you
          have two separate networks available for connection.
        </Typography>
      </Box>
    </Stack>
  );
};

export default Router;
