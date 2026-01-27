
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar";
import Demo from "../../components/navbar/Left";
import { Stack } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useDispatch, useSelector } from "react-redux";
import { toggleValue2 } from "../../RTK/features/Left";

const UnderConstructorLayout = () => {
  const dispatch = useDispatch();
  const value2 = useSelector((state) => state.LeftBoolean.value)
  const openSidebar = () => {
    dispatch(toggleValue2())
  }

  return (
    <>
      <Stack position="fixed" top={0} float="left"
        sx={{ width: (value2) ? "290px" : "0%", transition: 'all 0.2s' }}>
        <Demo />
      </Stack>
      <Stack position="fixed" top={0} display={value2 ? 'none' : 'block'}
        pt={6} pl={4} pr={1}
        sx={{
          height: '100dvh',
          width: '90px',
          backgroundColor: '#16181F'
        }}>
        <KeyboardDoubleArrowRightIcon onClick={openSidebar} sx={{ cursor: 'pointer' }} />
      </Stack>
      <Stack direction="row" alignItems='flex-end' justifyContent="flex-end">
        <Stack float='right' width={value2 ? "calc(100% - 290px)" : "calc(100% - 90px)"}
          sx={{ transition: 'all 0.2s' }}>
          <Outlet />
        </Stack>
      </Stack>
    </>
  )
}

export default UnderConstructorLayout;