import React from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { RiDeleteBin5Line } from "react-icons/ri";
import "./index.css";


const ViewAllNetwork = ({ handleClick, networks, DelNet, load }) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const deleteHandle = (data, index) => {
    //console.log('id', data)
    // dispatch(networkDelete(data.id))
    DelNet(index)
  }
  return (
    <Stack margin={5} gap={4}>
      <Stack gap={2}>
        <Stack gap={2} direction="row">
          <Typography variant="h1">All Networks</Typography>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "8px" }}
            onClick={() => handleClick(1)}
          >
            Add
          </Button>
        </Stack>
        <Typography variant="body1" color="#acacac !important">
          Router is responsible for directing network traffic between different networks or subnets within a cloud infrastructure. Create a router in your scenario by specifying the Router Name, selecting internet connectivity, and choosing the network to which the router will be connected.
        </Typography>
      </Stack>
      <Grid container gap={2} direction="row" width="100%">
        {networks?.map((data, index) => {

          return (
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
              {/* <Stack
              width="100%"
              backgroundColor="#313131 !important"
              p={2}
              borderRadius="8px"
              gap={2}
            > */}
              <Stack direction="row" justifyContent="space-between" width="100%">
                <Stack gap={2} direction="row">
                  <Typography color="#b46228 !important">IPV4 :</Typography>
                  <Typography color="#b46228 !important">
                    {data?.subnet_cidr}
                  </Typography>
                </Stack>
                <Box gap={2} onClick={() => deleteHandle(data, index)}>
                  <RiDeleteBin5Line />
                </Box>

              </Stack>

              <Typography variant="body1">{data.network_name}</Typography>
              <Typography variant="body2" color="#ACACAC !important">
                {data.subnet_name}
              </Typography>
              {/* </Stack> */}
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default ViewAllNetwork;
