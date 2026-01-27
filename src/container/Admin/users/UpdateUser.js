import * as React from "react";
import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import AddOrUpdateUser from "../common/AddOrUpdateUser";
import { useParams } from "react-router-dom";
import { UserData } from "../../../APIConfig/adminConfig";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddScenario from "./AddScenario";
import AddCTF from "./AddCTF";
import AddCorporate from "./AddCorporate";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UpdateUser = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { userId } = useParams();

  const [userData, setUserData] = useState(null);

  const breadcrumbs = [
    { name: "Users", link: "/admin/users" },
    { name: "Update User", link: "/admin/updateUser" },
  ];

  useEffect(() => {
    (async () => {
      try {
        const response = await UserData(userId);
        response.data && setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [userId]);
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="User Update" {...a11yProps(0)} />
            <Tab label="Solo Update" {...a11yProps(1)} />
            <Tab label="Squad Update" {...a11yProps(2)} />
            <Tab label="Corporate Update" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {userData && (
            <AddOrUpdateUser
              template="Update User"
              data={userData}
              userId={userId}
            />
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AddCTF />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <AddScenario />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={3}>
          <AddCorporate />
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default UpdateUser;
