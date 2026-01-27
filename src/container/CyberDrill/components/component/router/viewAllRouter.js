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
  // const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const routers = useSelector(selectAllRouter)

  const open = Boolean(anchorEl);
  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const card = [
    {
      networkName: "1NETWORK",
      router: "Network Name",
    },
    {
      networkName: "1NETWORK",
      router: "Network Name",
    },
    {
      networkName: "1NETWORK",
      router: "Network Name",
    },
  ];

  const handleDelete = (id) => {
    //console.log('id router',id)
    // dispatch(routerDelete(id))
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
          Lorem ipsum dolor sit amet consectetur. Lorem amet non urna et sit
          fermentum. Cursus ante integer habitant odio velit nisl at Lorem ipsum
          dolor sit amet consectetur. Lorem amet non urna et sit fermentum.
          Cursus ante integer habitant odio velit nisl at
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
                  {data.name}
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
