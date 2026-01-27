import * as React from "react";
import { useEffect, useState } from "react";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import WinningWall from "../../components/winningWall/WinningWall";
import { getCTFWinningWall } from "../../APIConfig/CtfConfig";
import { getScenarioWinningWall } from "../../APIConfig/scenarioConfig";
import { getCorporateWinningWall, getWebScenarioWinningWall } from "../../APIConfig/version2Scenario";
import { useNavigate } from "react-router-dom";
import BreadCrumbs from "../../components/navbar/BreadCrumb";
import SearchBar from "../../components/ui/SearchBar";

const CommonWinningWall = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [CTFWinningWallData, setCTFWinningWallData] = useState([]);
  const [scenarioWinningWallData, setScenarioWinningWallData] = useState([]);
  const [corporateWinningWallData, setCorporateWinningWallData] = useState([]);
  const [webScenarioWinningWallData, setWebScenarioWinningWallData] = useState([]);

  const [filteredCTFWinningWallData, setFilteredCTFWinningWallData] = useState([]);
  const [filteredScenarioWinningWallData, setFilteredScenarioWinningWallData] = useState([]);
  const [filteredCorporateWinningWallData, setFilteredCorporateWinningWallData] = useState([]);
  const [filteredWebscenarioWinningWallData, setFilteredWebscenarioWinningWallData] = useState([]);
  // Function to handle server errors and navigate to an error page
  const handleServerError = (error) => {
    if (error.response && error.response.status >= 500) {
      navigate("/error/serverError");
    }
  };

  // Function to fetch CTF (Capture The Flag) data and update state
  const ctfClickHandler = () => {
    getCTFWinningWall()
      .then((response) => {
        setCTFWinningWallData(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Function to fetch Scenario data and update state
  const scenarioClickHandler = () => {
    getScenarioWinningWall()
      .then((response) => {
        setScenarioWinningWallData(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  const corporateClickHandler = () => {
    getCorporateWinningWall()
      .then((response) => {
        setCorporateWinningWallData(response?.data);
      })
      .catch((error) => {
        setCorporateWinningWallData([]);
        handleServerError(error);
      });

      console.log(getCorporateWinningWall,'getCorporateWinningWallgetCorporateWinningWall')
  };

  const webscenarioClickHandler = () => {
    getWebScenarioWinningWall()
      .then((response) => {
        // setWebScenarioWinningWallData(response?.data);
        if (Array.isArray(response?.data) === false) {
          setWebScenarioWinningWallData([]);
          console.log(response?.data, 'responseresponse')

        } else {
          setWebScenarioWinningWallData(response?.data);
        }
      })
      .catch((error) => {

        setWebScenarioWinningWallData([]);
        handleServerError(error);
      });
  };

  // Use the useEffect hook to fetch CTF data when the component mounts
  useEffect(() => {
    ctfClickHandler();
  }, []);

  // Function to handle tab change and fetch the corresponding data
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchValue("");
    if (newValue === 0) {
      setFilteredCTFWinningWallData([]);
      ctfClickHandler();
    }
    if (newValue === 1) {
      setFilteredScenarioWinningWallData([]);
      scenarioClickHandler();
    }
    if (newValue === 2) {
      setFilteredCorporateWinningWallData([]);
      corporateClickHandler();
    }
    if (newValue === 3) {
      setFilteredWebscenarioWinningWallData([]);
      webscenarioClickHandler();
    }
  };

  const searchInputHandler = (value) => {
    setSearchValue(value);

    let data;
    if (tabValue === 0) {
      data = CTFWinningWallData;
    } else if (tabValue === 1) {
      data = scenarioWinningWallData;
    } else if (tabValue === 2) {
      data = corporateWinningWallData;
    } else if (tabValue === 3) {
      data = webScenarioWinningWallData;
    }


    let setFilteredData;
    if (tabValue === 0) {
      setFilteredData = setFilteredCTFWinningWallData;
    } else if (tabValue === 1) {
      setFilteredData = setFilteredScenarioWinningWallData;
    } else if (tabValue === 2) {
      setFilteredData = setFilteredCorporateWinningWallData;
    } else if (tabValue === 3) {
      setFilteredData = setFilteredWebscenarioWinningWallData;
    }

    if (value.trim() === "") {
      setFilteredData([]);
    } else {
      const filteredData = data?.filter((item) =>
        item?.user_full_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };

  const renderWinningWall = (data) => (
    <WinningWall template="winningWall" data={data} />
  );

  const breadcrumbs = [{ name: "Winning Wall", link: "/winningWall" }];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack px={2} py={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography componant="h2" variant="h1">
            Winning Wall
          </Typography>
          <SearchBar
            value={searchValue}
            placeholder="Search"
            onChange={(event) =>
              searchInputHandler(event.target.value.trimStart())
            }
          />
        </Stack>
        <Box my={3}>
          <Tabs value={tabValue} onChange={handleChange}>
            <Tab
              label="Solo"
              sx={{ fontSize: "18px", fontWeight: "500", color: "#EAEAEB" }}
            />
            <Tab
              label="Squad"
              sx={{ fontSize: "18px", fontWeight: "500", color: "#EAEAEB" }}
            />
            <Tab
              label="Corporate"
              sx={{ fontSize: "18px", fontWeight: "500", color: "#EAEAEB" }}
            />
            <Tab
              label="Web-Scenario"
              sx={{ fontSize: "18px", fontWeight: "500", color: "#EAEAEB" }}
            />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <>
            {searchValue && filteredCTFWinningWallData.length === 0 ? (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"


              >
                <Typography variant="h4">No Results Found</Typography>
              </Stack>
            ) : (
              renderWinningWall(
                filteredCTFWinningWallData.length > 0
                  ? filteredCTFWinningWallData
                  : CTFWinningWallData
              )
            )}
          </>
        )}

        {tabValue === 1 && (
          <>
            {searchValue && filteredScenarioWinningWallData.length === 0 ? (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="h4">No Results Found</Typography>
              </Stack>
            ) : (
              renderWinningWall(
                filteredScenarioWinningWallData.length > 0
                  ? filteredScenarioWinningWallData
                  : scenarioWinningWallData
              )
            )}
          </>
        )}

        {tabValue === 2 && (
          <>
            {searchValue && filteredCorporateWinningWallData.length === 0 ? (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="h4">No Results Found</Typography>
              </Stack>
            ) : (
              renderWinningWall(
                filteredCorporateWinningWallData.length > 0
                  ? filteredCorporateWinningWallData
                  : corporateWinningWallData
              )
            )}
          </>
        )}
        {tabValue === 3 && (
          <>
            {searchValue && filteredWebscenarioWinningWallData.length === 0 ? (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="h4">No Results Found</Typography>
              </Stack>
            ) : (
              renderWinningWall(
                filteredWebscenarioWinningWallData.length > 0
                  ? filteredWebscenarioWinningWallData
                  : webScenarioWinningWallData
              )
            )}
          </>
        )}

      </Stack>
    </>
  );
};
export default CommonWinningWall;
