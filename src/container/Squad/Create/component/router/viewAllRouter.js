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

const ViewAllRouter = ({ handleClick, router, DelRot, load }) => {



  const handleDelete = (id) => {
    DelRot(id)
  }
  return (
    <Stack margin={5} gap={4}>
      <Stack gap={2}>
        <Stack gap={2} direction="row">
          <Typography variant="h1">All Routers</Typography>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "8px" }}
            onClick={() => handleClick(3)}
          >
            Add
          </Button>
        </Stack>
        <Typography variant="body1" color="#acacac !important">
          A company has multiple departments with different security requirements. The network infrastructure needs to be segmented to enhance security and control access between departments. As a participant, your task is to add a router to the existing network and configure it to achieve the following objectives:
        </Typography>
      </Stack>
      <Grid container gap={2} direction="row" width="100%">
        {router?.map((data, index) => {
          //console.log('data router',data)
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
                <Typography color="#b46228 !important">
                  {data.router_name}
                </Typography>



                <Box gap={2} onClick={() => handleDelete(index)}>
                  <RiDeleteBin5Line />
                </Box>


              </Stack>
              <Typography variant="body1">{data.router}</Typography>
              {/* </Stack> */}
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default ViewAllRouter;
