import React from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme) => ({
  gradientButton: {
    backgroundImage: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
    color: "white",
    // Add more styling here (e.g., padding, border, etc.) if needed
  },
  
}));

function MOdifyButton() {
  const classes = useStyles();

  return (
    <div>
      <Button className={classes.gradientButton} variant="contained" color="primary">
        Primary Gradient Button
      </Button>
    </div>
  );
}

export default MOdifyButton;