import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { Box, Collapse, Stack, Tab, Tabs, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { mapCtfId, unmappedCtf } from "../../../APIConfig/adminConfig";
import { getctfId } from "../../../APIConfig/CtfConfig";
import SearchBar from "../../../components/ui/SearchBar";
import Card from "../../Solo/SoloCategory/Card";
import { TransitionGroup } from "react-transition-group";

const CTFRequests = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [unApprovedCTFData, setUnApprovedCTFData] = useState([]);
  const [approvedCTFData, setApprovedCTFData] = useState([]);
  const [filteredApprovedCTFData, setFilteredApprovedCTFData] = useState([]);
  const [filteredUnApprovedCTFData, setFilteredUnApprovedCTFData] = useState(
    []
  );
  const [searchValue, setSearchValue] = useState("");

  // Function to handle server errors and navigate to an error page
  const handleServerError = (error) => {
    if (error.response && error.response.status >= 500) {
      navigate("/error/serverError");
    }
  };

  // Function to fetch unapproved CTFs list and update state
  const approvedCTFClickHandler = () => {
    getctfId()
      .then((response) => {
        setUnApprovedCTFData(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Function to fetch approved CTFs list and update state
  const unapprovedCTFClickHandler = () => {
    mapCtfId()
      .then((response) => {
        setApprovedCTFData(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Fetches unapproved CTFs list when the component mounts
  useEffect(() => {
    approvedCTFClickHandler();
    unapprovedCTFClickHandler();
  }, []);

  // Handles tab change and fetches the corresponding data
  const handleTabChange = (newValue) => {
    setTabValue(newValue);
    setSearchValue("");

    const clearFilteredData =
      newValue === 0
        ? setFilteredUnApprovedCTFData
        : setFilteredApprovedCTFData;
    clearFilteredData([]);

    newValue === 0 ? unapprovedCTFClickHandler() : approvedCTFClickHandler();
  };

  const mapButtonHandler = async (id) => {
    navigate(`/admin/soloRequests/${id}`);
  };

  const unMapButtonHandler = async (id) => {
    try {
      const response = await unmappedCtf(id);
      if (response) {
        setApprovedCTFData(
          approvedCTFData.filter((item) => item.ctf_mapping_id !== id)
        );
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handles search input and updates the filtered data
  const handleSearchInput = (value) => {
    setSearchValue(value);

    const data = tabValue === 0 ? unApprovedCTFData : approvedCTFData;
    const setFilteredData =
      tabValue === 0
        ? setFilteredUnApprovedCTFData
        : setFilteredApprovedCTFData;

    if (value.trim() === "") {
      setFilteredData([]);
    } else {
      const filteredData = data.filter((item) =>
        item?.ctf_name?.toLowerCase().includes(value.toLowerCase())
      );
      filteredData && setFilteredData(filteredData);
    }
  };

  const breadcrumbs = [{ name: "CTF Requests", link: "/admin/soloRequests" }];

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
            All Solo Requests
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
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => handleTabChange(newValue)}
        >
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
            label="Approved Solo"
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
              ? filteredUnApprovedCTFData
              : filteredApprovedCTFData
            ).length === 0) ||
            (!searchValue &&
              (tabValue === 0 ? unApprovedCTFData : approvedCTFData).length ===
              0) ? (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Typography variant="h4">No Results Found</Typography>
            </Stack>
          ) : (

            <TransitionGroup>
              {(searchValue
                ? tabValue === 0
                  ? filteredUnApprovedCTFData
                  : filteredApprovedCTFData
                : tabValue === 0
                  ? unApprovedCTFData
                  : approvedCTFData
              ).map((item, index) => (
                <Collapse
                  key={tabValue === 0 ? item.ctf_id : item.ctf_mapping_id}
                >
                  <Card
                    item={item}
                    variant={tabValue === 0 ? "mapCTF" : "unmapCTF"}
                    CTAOnClick={() =>
                      tabValue === 0
                        ? mapButtonHandler(item.ctf_id)
                        : unMapButtonHandler(item.ctf_mapping_id)
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

export default CTFRequests;
