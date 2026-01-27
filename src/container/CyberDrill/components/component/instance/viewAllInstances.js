import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { RiDeleteBin5Line } from "react-icons/ri";
import PropTypes from "prop-types";

const ViewAllInstances = ({
  handleClick = () => {},
  instance = [],
  submitInfra = () => {},
  DelIns = () => {},
  load,
}) => {
  const [but, setBut] = useState(false);

  useEffect(() => {
    setBut(Array.isArray(instance) && instance.length > 0);
  }, [instance, load]);

  const handleDelete = (index) => {
    DelIns(index);
  };

  return (
    <Stack margin={5} gap={4}>
      <Stack gap={2}>
        <Stack gap={2} direction="row">
          <Typography variant="h1">All Instances</Typography>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "8px" }}
            onClick={() => handleClick(5)}
          >
            Add Instances
          </Button>
        </Stack>

        <Typography variant="body1" color="#acacac !important">
          Provide the Network Name, Subnet Name, and Subnet CIDR to add a new
          instance in your scenario.
        </Typography>
      </Stack>

      <Grid container gap={2} direction="row" width="100%">
        {instance.map((data, index) => (
          <Grid
            item
            xs={12}
            sm={12}
            md={5.8}
            lg={3.8}
            xl={3.8}
            mb={7}
            backgroundColor="#313131 !important"
            p={2}
            borderRadius="8px"
            key={index}
          >
            <Stack direction="row" justifyContent="space-between">
              <Stack gap={2} direction="row">
                <Typography color="#b46228 !important">IPV4 :</Typography>
                <Typography color="#b46228 !important">
                  {Array.isArray(data.network)
                    ? data.network.join(", ")
                    : data.network}
                </Typography>
              </Stack>

              <Box gap={2} onClick={() => handleDelete(index)}>
                <RiDeleteBin5Line />
              </Box>
            </Stack>

            <Typography variant="body1">{data.name}</Typography>
            <Typography variant="body2" color="#ACACAC !important">
              {data.team} TEAM
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="secondary"
        style={{ width: "120px", textWrap: "nowrap" }}
        onClick={submitInfra}
        disabled={!but}
      >
        Submit Infra
      </Button>
    </Stack>
  );
};

ViewAllInstances.propTypes = {
  handleClick: PropTypes.func,
  instance: PropTypes.array,
  submitInfra: PropTypes.func,
  DelIns: PropTypes.func,
  load: PropTypes.bool,
};

export default ViewAllInstances;
