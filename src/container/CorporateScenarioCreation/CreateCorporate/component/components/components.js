import { Button, Stack, Typography } from "@mui/material";
import image1 from "../../../../../assests/componentImage.png";

const Components = ({ handleClick }) => {
  return (
    // remove margin 5
    <Stack gap={4}>
      <Stack gap={2}>
        <Typography variant="h1">Inventory</Typography>
        <Typography variant="body1" color="#acacac !important">
          Virtual components in cloud computing are software-defined entities that simulate physical resources, such as virtual machines, virtual networks, virtual storage, virtual appliances, virtual firewalls, and virtual load balancers, providing flexible and scalable environments for deploying applications and services. Browse through the list of components and add them as per your scenario's requirement.
          {" "}

        </Typography>
      </Stack>
      <Stack
        width="100%"
        // height="100%"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <img
          src={image1}
          alt="component image"
          style={{ width: "30%", height: "30%" }}
        />
        <Typography variant="body1" color="#acacac !important">
          Before proceeding, it is essential to create the add networks and
          other components. Currently, none have been created.
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => handleClick(1)}>
          Add Network
        </Button>
      </Stack>
    </Stack>
  );
};

export default Components;
