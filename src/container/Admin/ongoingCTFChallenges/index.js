import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import {
  Box,
  Button,
  Collapse,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { mapCtfId, unmappedCtf } from "../../../APIConfig/adminConfig";
// import { getctfId } from "../../../APIConfig/CtfConfig";
import SearchBar from "../../../components/ui/SearchBar";
import Cards_Challenge from "./cards_challenge";
import { TransitionGroup } from "react-transition-group";
import attention from "../../../assests/attention-removebg-preview 1.svg";

import { Icons } from "../../../components/icons";
import CustomModal from "../../../components/ui/CustomModal";
import {
  delete_challenge,
  getCTF_Challenge,
  getScenario_Challenge,
} from "../../../APIConfig/challengeConfig";

const OngoingCTFChallenge = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [scenarioChallenge, setScenarioChallenge] = useState([]);
  const [CTFChallenge, setCTFchallenge] = useState([]);
  const [filteredCTFData, setFilteredCTFData] = useState([]);
  const [filteredScenarioData, setFilteredScenarioData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [modalCreateChallenge, setModalCreateChallenge] = useState(false);
  const [modalUnchallenge, setModalUnchallenge] = useState(false);
  const [unchallengeID, setUnChallengeID] = useState(null);

  const handleCreateChallenge = () => {
    setModalCreateChallenge(true);
  };

  // Function to handle server errors and navigate to an error page
  const handleServerError = (error) => {
    if (error.response && error.response.status >= 500) {
      navigate("/error/serverError");
    }
  };

  // Function to fetch unapproved CTFs list and update state
  const CTFhandler = () => {
    getCTF_Challenge()
      .then((response) => {
        setCTFchallenge(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Function to fetch approved CTFs list and update state
  const ScenarioHandler = () => {
    getScenario_Challenge()
      .then((response) => {
        setScenarioChallenge(response?.data);
      })
      .catch((error) => {
        handleServerError(error);
      });
  };

  // Fetches unapproved CTFs list when the component mounts
  useEffect(() => {
    CTFhandler();
  }, []);

  // Handles tab change and fetches the corresponding data
  const handleTabChange = (newValue) => {
    setTabValue(newValue);
    setSearchValue("");

    const clearFilteredData =
      newValue === 0 ? setFilteredCTFData : setFilteredScenarioData;
    clearFilteredData([]);

    newValue === 0 ? CTFhandler() : ScenarioHandler();
  };

  // const mapButtonHandler = async (id) => {
  //   navigate(`/admin/soloRequests/${id}`);
  // };

  const handleCTF = () => {
    navigate("/admin/allSoloScenarios");
  };

  const handleScenario = () => {
    navigate("/admin/allSquadScenarios");
  };

  const handleUnchallenge = () => {
    delete_challenge(unchallengeID).then((response) => {
      if (tabValue === 0) {
        setCTFchallenge(
          CTFChallenge.filter((item) => item.ctf_id !== unchallengeID)
        );
        setFilteredCTFData(
          filteredCTFData.filter((item) => item.ctf_id !== unchallengeID)
        );
        setModalUnchallenge(false);
      } else if (tabValue === 1) {
        setScenarioChallenge(
          scenarioChallenge.filter((item) => item.scenario_id !== unchallengeID)
        );
        setFilteredScenarioData(
          filteredScenarioData.filter(
            (item) => item.scenario_id !== unchallengeID
          )
        );
        setModalUnchallenge(false);
      }
    });
  };

  // Handles search input and updates the filtered data
  const handleSearchInput = (value) => {
    setSearchValue(value);

    const data = tabValue === 0 ? CTFChallenge : scenarioChallenge;
    const setFilteredData =
      tabValue === 0 ? setFilteredCTFData : setFilteredScenarioData;

    if (value.trim() === "") {
      setFilteredData([]);
    } else {
      const filteredData = data.filter(
        (item) =>
          item?.ctf_name?.toLowerCase().includes(value.toLowerCase()) ||
          item?.scenario_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };

  const breadcrumbs = [{ name: "Challenges", link: "/admin/challenges" }];

  return (
    <>
      {/* modal for create Challenge */}
      <CustomModal
        open={modalCreateChallenge}
        onClose={() => setModalCreateChallenge(false)}
        sx={{ width: "35%" }}
        disableExternalClick
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" color={"#EAEAEB !important"}>
            Please Select Challenge Type
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "40px",
            justifyContent: "center",
            mt: "56px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1C1F28",
              color: "#6F727A !important",
              width: "220px",
              height: "160px",
              borderRadius: "16px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              transition: "all 0.3s ease",
              border: "0.5px solid #1C1F28 ",
              gap: "16px",
              cursor: "pointer",
              "&:hover": {
                border: "0.5px solid #00FFFF",
                color: "#00FFFF !important",
                transition: "all 0.3s ease",
              },
              flexDirection: "column",
            }}
            onClick={handleCTF}
          >
            <Icons.CTF style={{ fontSize: "32px" }} />
            <Typography variant="h3" style={{ color: "inherit" }}>
              Solo Challenge
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#1C1F28",
              width: "220px",
              color: "#6F727A !important",
              height: "160px",
              borderRadius: "16px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              transition: "all 0.3s ease",
              border: "0.5px solid #1C1F28 ",
              gap: "16px",
              cursor: "pointer",
              "&:hover": {
                border: "0.5px solid #00FFFF",
                color: "#00FFFF !important",
                transition: "all 0.3s ease",
              },
              flexDirection: "column",
            }}
            onClick={handleScenario}
          >
            <Icons.scenario style={{ fontSize: "32px" }} />
            <Typography variant="h3" style={{ color: "inherit" }}>
              {" "}
              Squad Challenge
            </Typography>
          </Box>
        </Box>
      </CustomModal>

      {/* modal for unchallenge */}
      <CustomModal
        sx={{ py: 5, px: 5 }}
        open={modalUnchallenge}
        onClose={() => setModalUnchallenge(false)}
        hideCloseIcon
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <img
            src={attention}
            alt="upload_file_icon"
            style={{
              height: "52px",
              width: "52px",
            }}
          />
          <Typography variant="h2" color={"#EAEAEB !important"} sx={{ mt: 1 }}>
            Confirm Unchallenged
          </Typography>
          <Typography color={"#9C9EA3 !important"}>
            Are you sure you want to remove this challenge ?
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            mt: "24px",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setModalUnchallenge(false);
              setUnChallengeID(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUnchallenge}>
            unchallenge
          </Button>
        </Box>
      </CustomModal>

      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack px={2} py={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography componant="h1" variant="h2">
            {tabValue === 0
              ? "Ongoing Solo Challenges"
              : "Ongoing Squad Challenges"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "24px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SearchBar
              value={searchValue}
              onChange={(event) =>
                handleSearchInput(event.target.value.trimStart())
              }
            />

            <Button variant="contained" onClick={handleCreateChallenge}>
              Create Challenge
            </Button>
          </Box>
        </Stack>
      </Stack>
      <Stack px={2} py={4}>
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => handleTabChange(newValue)}
        >
          <Tab
            label="Solo Challenges "
            sx={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#EAEAEB",
              textTransform: "capitalize",
            }}
          />
          <Tab
            label="Squad Challenges "
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
            (tabValue === 0 ? filteredCTFData : filteredScenarioData).length ===
            0) ||
            (!searchValue &&
              (tabValue === 0 ? CTFChallenge : scenarioChallenge).length ===
              0) ? (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Typography variant="h4">No Results Found</Typography>
            </Stack>
          ) : (
            <TransitionGroup>
              {(searchValue
                ? tabValue === 0
                  ? filteredCTFData
                  : filteredScenarioData
                : tabValue === 0
                  ? CTFChallenge
                  : scenarioChallenge
              ).map((item) => (
                <Collapse key={tabValue === 0 ? item.ctf_id : item.scenario_id}>
                  {/* setUnChallengeID(tabValue === 0 ? item.ctf_id : item.scenario_id) */}
                  <Cards_Challenge
                    item={item}
                    variant={"challenge"}
                    CTAOnClick={() => {
                      setUnChallengeID(
                        tabValue === 0 ? item.ctf_id : item.scenario_id
                      );
                      setModalUnchallenge(true);
                    }}
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

export default OngoingCTFChallenge;
