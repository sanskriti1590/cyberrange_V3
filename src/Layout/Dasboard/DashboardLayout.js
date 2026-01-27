import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Demo from "../../components/navbar/Left";
import { Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { toggleValue2 } from "../../RTK/features/Left";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MobileView from "../../components/MobileView";
import { useTheme } from "@mui/material/styles";

const DashboardLayout = () => {
  const theme = useTheme(); // ✅ SAFE
  const [sizeState, setSizeState] = useState("desktop");
  const dispatch = useDispatch();
  const value2 = useSelector((state) => state.LeftBoolean.value);

  const openSidebar = () => dispatch(toggleValue2());

  const changeNavbar = () => {
    setSizeState(window.innerWidth <= 900 ? "mobile" : "desktop");
  };

  useEffect(() => {
    changeNavbar();
    window.addEventListener("resize", changeNavbar);
    return () => window.removeEventListener("resize", changeNavbar);
  }, []);

  return (
    <>
      {sizeState === "mobile" && <MobileView />}

      {sizeState !== "mobile" && (
        <>
          <Stack
            position="fixed"
            top={0}
            sx={{ width: value2 ? "290px" : "0%", transition: "all 0.2s" }}
          >
            <Demo />
          </Stack>

          <Stack
            position="fixed"
            top={0}
            display={value2 ? "none" : "block"}
            pt={6}
            pl={4}
            pr={1}
            sx={{
              height: "100dvh",
              width: "90px",
              backgroundColor: theme.palette.basic.main, // ✅ works
            }}
          >
            <KeyboardDoubleArrowRightIcon
              onClick={openSidebar}
              sx={{ cursor: "pointer" }}
            />
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <Stack
              width={value2 ? "calc(100% - 290px)" : "calc(100% - 90px)"}
              sx={{ transition: "all 0.2s" }}
            >
              <Outlet />
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
};

export default DashboardLayout;
