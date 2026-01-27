import React from 'react'
import {
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";

const RoadMap = ({setToggle}) => {
  return (
    <>
    <Stack direction='row' justifyContent='space-between'>
            <Button onClick={()=>setToggle(0)}>Back</Button>
            <Button onClick={()=>setToggle(2)}>Continue</Button>
        </Stack>
        <Typography variant='h1'>RoadMap</Typography>
        </>
  )
}

export default RoadMap
