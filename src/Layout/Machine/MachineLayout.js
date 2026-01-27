
import React from "react";
import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";

const MachineLayout = () => {
  return (
    <Stack direction="row">
      {/* <Navbar/> */}
      {/* <Demo /> */}
      <Outlet />
    </Stack>
  )
}

export default MachineLayout;