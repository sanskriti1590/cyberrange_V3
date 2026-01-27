import * as React from "react";
import Stack from "@mui/material/Stack";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import TeamPlayer from "./teamPlayer";
import WhitePlayer from "./whitePlayer";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { Backdrop, CircularProgress } from "@mui/material";

export default function ActiveGameSenario({ variant }) {
  const { loading, userss, error } = useSelector((state) => state.user);
  const breadcrumbs = [
    {
      name: "Dashboard",
      link: "/",
    },
    {
      name: "Active Game",
      // link: `/activeGameScenario/${variant}`,
    },
  ];

  // const corporateBreadcrumbs = [
  //   {
  //     name: "Dashboard",
  //     link: "/",
  //   },
  //   {
  //     name: "Corporate",
  //     link: "/scenarios2/category",
  //   },
  //   {
  //     name: "Active Exercise",
  //     // link: "/activeGameScenario/corporate",
  //   },
  // ];

  return (
    <Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h2" padding={2}>
          Active Game
        </Typography>
      </Stack>

      {(userss?.user_role !== "WHITE TEAM" || variant == "scenario") && (
        <TeamPlayer variant={variant} user={userss?.user_role} />
      )}

      {userss?.user_role === "WHITE TEAM" && variant == "corporate" && (
        <Stack justifyContent="center" alignItems="center">
          <WhitePlayer />
        </Stack>
      )}
    </Stack>
  );
}
