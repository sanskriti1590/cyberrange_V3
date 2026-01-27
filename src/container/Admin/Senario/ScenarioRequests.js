import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { Box, Collapse, Stack, Tab, Tabs, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { TransitionGroup } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import {
  approvalSenario,
  approvedScenariofromDb,
  listOfUnApprovedScenario,
  UnapprovedScenariofromDB,
} from "../../../APIConfig/adminConfig";
import Card from "../../ViewScenariosCommon/ScenarioCategory/Card";
import SearchBar from "../../../components/ui/SearchBar";

const ScenarioRequests = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [unApprovedScenarioData, setUnApprovedScenarioData] = useState([]);
  const [approvedScenarioData, setApprovedScenarioData] = useState([]);
  const [filteredUnApprovedScenarioData, setFilteredUnApprovedScenarioData] =
    useState([]);
  const [filteredApprovedScenarioData, setFilteredApprovedScenarioData] =
    useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Function to handle server errors and navigate to an error page
  const handleServerError = (error) => {
    if (error.response && error.response.status >= 500) {
      navigate("/error/serverError");
    }
  };

  // Function to fetch unapproved CTFs list and update state
  const approvedScenarioClickHandler = () => {
    listOfUnApprovedScenario()
      .then((response) => {
        setUnApprovedScenarioData(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Function to fetch approved CTFs list and update state
  const unApprovedScenarioClickHandler = () => {
    approvalSenario()
      .then((response) => {
        setApprovedScenarioData(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Use the useEffect hook to fetch unapproved CTFs list when the component mounts
  useEffect(() => {
    approvedScenarioClickHandler();
  }, []);

  // Handles search input and updates the filtered data
  const handleSearchInput = (value) => {
    setSearchValue(value);

    const data = tabValue === 0 ? unApprovedScenarioData : approvedScenarioData;
    const setFilteredData =
      tabValue === 0
        ? setFilteredUnApprovedScenarioData
        : setFilteredApprovedScenarioData;

    if (value.trim() === "") {
      setFilteredData([]);
    } else {
      const filteredData = data.filter((item) =>
        item?.scenario_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filteredData);
      console.table(filteredData);
    }
  };

  // Function to handle tab change and fetch the corresponding data
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    if (tabValue === 0) {
      unApprovedScenarioClickHandler();
    } else {
      approvedScenarioClickHandler();
    }
  };

  const approveButtonHandler = async (id) => {
    const formData = {
      scenario_id: id,
    };
    try {
      const response = await approvedScenariofromDb(formData);
      if (response) {
        setUnApprovedScenarioData(
          unApprovedScenarioData.filter((item) => item.scenario_id !== id)
        );
        toast.success(response?.data?.message);
      }
    } catch (error) { }
  };

  const unapproveButtonHandler = async (id) => {
    const formData = {
      scenario_id: id,
    };
    try {
      const response = await UnapprovedScenariofromDB(formData);
      if (response) {
        setApprovedScenarioData(
          approvedScenarioData.filter((item) => item.scenario_id !== id)
        );
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const breadcrumbs = [
    { name: "Scenario Requests", link: "/admin/squadRequests" },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack px={2} py={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography componant="h1" variant="h2">
            All Squad Requests
          </Typography>
          <SearchBar
            value={searchValue}
            onChange={(event) =>
              handleSearchInput(event.target.value.trimStart())
            }
          />
        </Stack>
      </Stack>
      <Stack px={2} py={4}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab
            label="Recent Requests"
            sx={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#EAEAEB",
              textTransform: "capitalize",
            }}
          />
          <Tab
            label="Approved Squad"
            sx={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#EAEAEB",
              textTransform: "capitalize",
            }}
          />
        </Tabs>
        {/*<Box mt={2}>*/}
        {/*  {tabValue === 0 && (*/}
        {/*    unApprovedScenarioData && unApprovedScenarioData.length > 0 ? (*/}
        {/*      <TransitionGroup>*/}
        {/*        {unApprovedScenarioData.map((item) => (*/}
        {/*          <Collapse key={item.scenario_id}>*/}
        {/*            <Card item={item} variant='approve' CTAOnClick={() => approveButtonHandler(item.scenario_id)}/>*/}
        {/*          </Collapse>*/}
        {/*        ))}*/}
        {/*      </TransitionGroup>*/}
        {/*    ) : (*/}
        {/*      <UnderConstruction pageHeight='100%'/>*/}
        {/*    )*/}
        {/*  )}*/}

        {/*  {tabValue === 1 &&*/}
        {/*    (approvedScenarioData && approvedScenarioData?.length > 0 ? (*/}
        {/*      <TransitionGroup>*/}
        {/*        {approvedScenarioData.map((item) => (*/}
        {/*          <Collapse key={item.scenario_id}>*/}
        {/*            <Card item={item} variant='unApprove' CTAOnClick={() => unApproveButtonHandler(item.scenario_id)}/>*/}
        {/*          < /Collapse>*/}
        {/*        ))}*/}
        {/*      </TransitionGroup>*/}
        {/*    ) : (*/}
        {/*      <UnderConstruction pageHeight='100%'/>*/}
        {/*    ))*/}
        {/*  }*/}
        {/*</Box>*/}

        <Box mt={2}>
          {(searchValue &&
            (tabValue === 0
              ? filteredUnApprovedScenarioData
              : filteredApprovedScenarioData
            ).length === 0) ||
            (!searchValue &&
              (tabValue === 0 ? unApprovedScenarioData : approvedScenarioData)
                .length === 0) ? (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Typography variant="h4">No Results Found</Typography>
            </Stack>
          ) : (
            <TransitionGroup>
              {(searchValue
                ? tabValue === 0
                  ? filteredUnApprovedScenarioData
                  : filteredApprovedScenarioData
                : tabValue === 0
                  ? unApprovedScenarioData
                  : approvedScenarioData
              ).map((item) => (
                <Collapse key={item.scenario_id}>
                  <Card
                    item={item}
                    variant={tabValue === 0 ? "approve" : "unApprove"}
                    CTAOnClick={() =>
                      tabValue === 0
                        ? approveButtonHandler(item.scenario_id)
                        : unapproveButtonHandler(item.scenario_id)
                    }
                  />
                </Collapse>
              ))}
            </TransitionGroup>
          )}
        </Box>
      </Stack>
    </>
  );
};

export default ScenarioRequests;
