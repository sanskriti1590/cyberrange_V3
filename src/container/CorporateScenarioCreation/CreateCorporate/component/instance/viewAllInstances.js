import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { RiDeleteBin5Line } from "react-icons/ri";


const ViewAllInstances = ({ handleClick, instance, submitInfra, DelIns, load }) => {
  // const instances = useSelector(selectAllInstance)
  // const dispatch = useDispatch()
  //console.log("hello i am",instances)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [but, setBut] = React.useState(false)
  const open = Boolean(anchorEl);
  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (instance.length > 0) {
      setBut(true)
    }
    if (instance.length <= 0) {
      setBut(false)
    }
  }, [instance, load])

  const handleDelete = (id) => {
    // dispatch(deleteInstance(id))
    DelIns(id)
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
            onClick={() => handleClick(5)}
          >
            Add Instances
          </Button>
        </Stack>
        <Typography variant="body1" color="#acacac !important">
          Provide the Network Name, Subnet Name, and Subnet CIDR to add a new network in your scenario
        </Typography>
      </Stack>
      <Grid container gap={2} direction="row" width="100%">
        {instance?.map((data, index) => {
          //console.log('data in instance',data.id)
          return (
            // <Stack
            //   width="100%"
            //   backgroundColor="#313131 !important"
            //   p={2}
            //   borderRadius="8px"
            //   gap={2}
            // >
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
                    {data.network}
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
              {/* </Stack> */}
            </Grid>
          );
        })}
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        style={{ width: "100px", textWrap: 'nowrap' }}
        onClick={submitInfra}
        disabled={!but}
          sx={{
          width: "120px",
          color: "#00ff88",           
          fontWeight: 600,
          "&:disabled": {
            color: "#555",            
          },
        }}
      >
        Submit Infra
      </Button>
    </Stack>
  );
};

export default ViewAllInstances;
