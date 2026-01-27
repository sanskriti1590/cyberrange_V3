import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import {
  approvalSenario,
  UnapprovedScenariofromDB,
} from "../../../APIConfig/adminConfig";

export default function ScenarioUnApproval({ reload, setReload }) {
  const [age, setAge] = React.useState("");
  const [data, setData] = React.useState([]);
  const [selectValue, setSelectVAlue] = React.useState({});
  // const [reload,setReload] = React.useState(false)
  const handleChange = (event) => {
    setAge(event.target.value);
    setSelectVAlue({ scenario_id: event.target.value });
  };

  React.useEffect(() => {
    const getData = async () => {
      const value = await approvalSenario();
      //console.log('value', value)
      value?.data && setData(value.data);
    };

    getData();
  }, [reload]);

  const handleSubmitChanges = () => {
    const value = UnapprovedScenariofromDB(selectValue);
    setReload(!reload);
    //console.log('value',value)
    if (value) {
      toast.success("your sceanrio has been un-approved");
      setReload(!reload);
      setAge();
      setSelectVAlue();
    }
  };
  return (
    <Stack
      sx={{ minWidth: 120, gap: 5 }}
      padding={5}
      pt={0}
      alignItems="center"
    >
      <Typography variant="h1">Unmap Scenarios</Typography>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select Scenario</InputLabel>
        <Select
          name="scenario_id"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Select Scenario"
          onChange={handleChange}
        >
          {data.map((item) => {
            return (
              <MenuItem value={item.scenario_id}>{item.scenario_name}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="secondary"
        style={{ width: "400px" }}
        onClick={handleSubmitChanges}
      >
        Submit
      </Button>
    </Stack>
  );
}
