import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";

const InfoCard = ({ name, value }) => {
  return (
    <Stack
      sx={{
        // minWidth: 100,
        backgroundColor: "#342D3C",
        // maxHeight: 100,
        width: {
          xs: 40, // width for extra small screens
          sm: 60, // width for small screens
          md: "10rem", // width for medium screens
          lg: 220, // width for large screens
          xl: 220, // width for extra large screens
        },
        height: {
          xs: 40, // width for extra small screens
          sm: 40, // width for small screens
          md: 60, // width for medium screens
          lg: 70, // width for large screens
          xl: 80, // width for extra large screens
        },
        // border: "1px solid white",
        p: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        my: 0.5,
      }}
    >
      <Typography
        variant="h5"
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          // border: "1px solid white",
        }}
      >
        {name}
      </Typography>
      <Typography
        variant="h4"
        component="div"
        color="text.secondary"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          // border: "1px solid white",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
};

export default InfoCard;
