import { Button, InputLabel } from "@mui/material";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Form(props) {
  const [team, setTeam] = React.useState("");
  const [name, setName] = React.useState("");

  const handleChange = (event) => {
    setTeam(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit({ name, team });
    setName("");
    setTeam("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <input
        placeholder="Enter Email"
        name="Email"
        style={{
          width: "100%",
          background: "transparent",
          borderRadius: "8px",
          height: "60px",
          color: "#acacac",
          border: "1px solid #12464C",
          padding: "12px 16px",
        }}
        type="text"
        value={name}
        onChange={handleNameChange}
      />
      <FormControl
        variant="filled"
        sx={{
          minWidth: 140,
          mt: 0.1,
          border: "1px solid",
          borderRadius: "8px",
          borderColor: "rgb(111, 111, 111) !important",
          width: '40%',
          height: "60px",
          p: 1
        }}
      >
        <InputLabel htmlFor="demo-simple-select-filled" sx={{ color: "white" }}>
          Machine
        </InputLabel>
        <Select
          label="Age"
          placeholder="textttt"
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={team}
          onChange={handleChange}
          style={{ height: "48px" }}
          sx={{
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(228, 219, 233, 0.25)",
            },
            // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            //   borderColor: 'rgba(228, 219, 233, 0.25)',
            // },
            // '&:hover .MuiOutlinedInput-notchedOutline': {
            //   borderColor: 'rgba(228, 219, 233, 0.25)',
            // },
            ".MuiSvgIcon-root ": {
              fill: "white !important",
            },
          }}
        >
          {props?.machine?.map((item) => {
            return <MenuItem value={item}>{item}</MenuItem>;
          })}
        </Select>
      </FormControl>

      <Button variant="outlined" type="submit" color="secondary">
        Add
      </Button>
    </form>
  );
}
