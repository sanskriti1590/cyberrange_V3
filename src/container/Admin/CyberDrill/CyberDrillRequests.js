import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  approvalCorporateRequests,
  approvedCorporateRequestsFromDB,
  listOfUnApprovedCorporateRequests,
  UnApprovedCorporateRequestsFromDB
} from "../../../APIConfig/adminConfig";
import { toast } from "react-toastify";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { Box, Collapse, Stack, Tab, Tabs, Typography } from "@mui/material";
import SearchBar from "../../../components/ui/SearchBar";
import { TransitionGroup } from "react-transition-group";
import CorporateRequestsCard from "./CyberDrillRequestsCard";

const CorporateRequests = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [unApprovedCorporateRequestsData, setUnApprovedCorporateRequestsData] = useState([]);
  const [approvedCorporateRequestsData, setApprovedCorporateRequestsData] = useState([]);
  const [filteredUnApprovedCorporateRequestsData, setFilteredUnApprovedCorporateRequestsData] = useState([]);
  const [filteredApprovedCorporateRequestsData, setFilteredApprovedCorporateRequestsData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Function to handle server errors and navigate to an error page
  const handleServerError = (error) => {
    if (error.response && error.response.status >= 500) {
      navigate("/error/serverError");
    }
  };

  // Function to fetch unapproved corporate requests list and update state
  const approvedCorporateRequestsClickHandler = () => {
    listOfUnApprovedCorporateRequests()
      .then((response) => {
        setUnApprovedCorporateRequestsData(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Function to fetch approved corporate requests list and update state
  const unApprovedCorporateRequestsClickHandler = () => {
    approvalCorporateRequests()
      .then((response) => {
        setApprovedCorporateRequestsData(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Use the useEffect hook to fetch unapproved corporate requests list when the component mounts
  useEffect(() => {
    approvedCorporateRequestsClickHandler();
  }, []);

  // Handles search input and updates the filtered data
  const handleSearchInput = (value) => {
    setSearchValue(value);

    const data = tabValue === 0 ? unApprovedCorporateRequestsData : approvedCorporateRequestsData;
    const setFilteredData =
      tabValue === 0
        ? setFilteredUnApprovedCorporateRequestsData
        : setFilteredApprovedCorporateRequestsData;

    if (value.trim() === "") {
      setFilteredData([]);
    } else {
      const filteredData = data?.filter((item) =>
        item?.name?.toLowerCase().includes(value.toLowerCase())
      );
      filteredData && setFilteredData(filteredData);

    }
  };

  // Function to handle tab change and fetch the corresponding data
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    if (tabValue === 0) {
      unApprovedCorporateRequestsClickHandler();
    } else {
      approvedCorporateRequestsClickHandler();
    }
  };

  const approveButtonHandler = async (id) => {
    const formData = {
      corporate_id: id,
    };
    try {
      const response = await approvedCorporateRequestsFromDB(formData);
      if (response) {
        setUnApprovedCorporateRequestsData(
          unApprovedCorporateRequestsData.filter((item) => item.id !== id)
        );
        toast.success(response?.data?.message);
      }
    } catch (error) {
    }
  };

  const unApproveButtonHandler = async (id) => {
    const formData = {
      corporate_id: id,
    };
    try {
      const response = await UnApprovedCorporateRequestsFromDB(formData);
      if (response) {
        setApprovedCorporateRequestsData(
          approvedCorporateRequestsData.filter((item) => item.id !== id)
        );
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const breadcrumbs = [
    { name: "Corporate Requests", link: "/admin/corporateRequests" },
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
            All Corporate Requests
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
            label="Approved Requests"
            sx={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#EAEAEB",
              textTransform: "capitalize",
            }}
          />
        </Tabs>
        <Box mt={2}>
          {(searchValue &&
            (tabValue === 0
              ? filteredUnApprovedCorporateRequestsData
              : filteredApprovedCorporateRequestsData
            ).length === 0) ||
            (!searchValue &&
              (tabValue === 0 ? unApprovedCorporateRequestsData : approvedCorporateRequestsData)
                .length === 0) ? (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Typography variant="h4">No Results Found</Typography>
            </Stack>
          ) : (
            <TransitionGroup>
              {(searchValue
                ? tabValue === 0
                  ? filteredUnApprovedCorporateRequestsData
                  : filteredApprovedCorporateRequestsData
                : tabValue === 0
                  ? unApprovedCorporateRequestsData
                  : approvedCorporateRequestsData
              ).map((item) => (
                <Collapse key={item.id}>
                  <CorporateRequestsCard
                    item={item}
                    variant={tabValue === 0 ? "approve" : "unApprove"}
                    CTAOnClick={() =>
                      tabValue === 0
                        ? approveButtonHandler(item.id)
                        : unApproveButtonHandler(item.id)
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

export default CorporateRequests;