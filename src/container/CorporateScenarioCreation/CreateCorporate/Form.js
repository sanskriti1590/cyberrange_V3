import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";

export default function Form(props) {
  return (
    <form
      onSubmit={props.onSubmit}
      style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}
    >
      <input
        placeholder={props.placeHolders}
        name="ctf_flags"
        style={{
          background: "transparent",
          padding: 4,
          borderRadius: "8px",
          border: "1px solid #12464C",
          height: "50px",
          color: "white",
          width: "100%",
        }}
        type="text"
        value={props.value}
        onChange={props.onChange}
      />

      <Button variant="outlined" type="submit" color="secondary">
        Add
      </Button>
    </form>
  );
}
