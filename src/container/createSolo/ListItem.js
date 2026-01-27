import { Button, Stack } from "@mui/material";
import React from "react";

export default function ListItem(props) {
  const { name } = props.flag;
  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        listStyle: "none",
        color: "#fff",
        width: "100%",
        padding: "8px",
      }}
    >
      <Stack
        sx={{
          width: "730px",
          flexGrow: 1,
          wordWrap: "break-word",
        }}
      >
        {name}
      </Stack>
      <Button
        color="error"
        variant="contained"
        sx={{ marginLeft: "8px" }}
        onClick={props.remove}
      >
        Remove
      </Button>
    </li>
  );
}
