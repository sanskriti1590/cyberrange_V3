
import React from "react";
import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";

const SenarioMachineLayout = () => {

  return (
    <Stack direction="row">
      {/* <Navbar/> */}
      {/* <Demo /> */}
      <Outlet />
    </Stack>
  )
}

export default SenarioMachineLayout