import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

import BreadCrumbs from "../../components/navbar/BreadCrumb";
import SearchBar from "../../components/ui/SearchBar";
import LoaderImg from "../../components/ui/loader";
import Wtable from "./Wtable";
import ScenarioMachine from "./ScenarioMachine";

import userGroup from "../../assests/user_group.svg";

import {
  scenariolisting,
} from "../../APIConfig/scenarioConfig";
import {
  challengesApi,
  dashboardList,
  getCategory,
  MemberWallApi,
  topPerformerApi,
  UserProfileApi,
} from "../../APIConfig/CtfConfig";
import { totalUserCount } from "../../APIConfig/userConfig";

import ErrorHandler from "../../ErrorHandler";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./index.css";

const useStyles = makeStyles({
  stack: {
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  Button: {
    backgroundColor: "#002929",
    transition: "transform 0.3s",
    fontSize: "14px !important",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "#12464C",
    },
  },
});



const Dashboard = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const [cat, setCat] = useState({});
  const [mem, setMem] = useState([]);
  const [memInput, setMemInput] = useState("");
  const [scanario, setScanario] = useState([]);
  const [data, setData] = useState([]);
  const [member, setMembers] = useState({});
  const [topPerformer, setTopPerformer] = useState([]);
  const [memberWall, setMemberWall] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [totalUser, setTotalUser] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsActive(true);
        const [
          scenarioRes,
          topPerformerRes,
          challengesRes,
          membersRes,
          catRes,
          memWallRes,
          totalUserRes,
        ] = await Promise.all([
          scenariolisting(),
          topPerformerApi(),
          challengesApi(),
          dashboardList(),
          getCategory(),
          MemberWallApi(),
          totalUserCount(),
        ]);

        if (
          scenarioRes?.data &&
          topPerformerRes?.data &&
          challengesRes?.data &&
          membersRes?.data &&
          catRes?.data &&
          memWallRes?.data &&
          totalUserRes?.data
        ) {
          setScanario(scenarioRes);
          setData(scenarioRes?.data);
          setTopPerformer(topPerformerRes?.data);
          setChallenges(challengesRes?.data);
          setMembers(membersRes?.data);
          setCat(catRes);
          setMem(memWallRes?.data);
          setMemberWall(memWallRes?.data);
          setTotalUser(totalUserRes?.data.total_members);
        }
      } catch (error) {
        ErrorHandler(error, navigate);
      } finally {
        setIsActive(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.trimLeft().toLowerCase();

    if (!searchValue) {
      setMemberWall(mem);
      setMemInput("");
      return;
    }

    const filtered = mem.filter((item) =>
      item.user_full_name.toLowerCase().includes(searchValue)
    );
    setMemberWall(filtered);
    setMemInput(searchValue);
  };

  const handleClickTopPerformer = async (user_id) => {
    const userDetails = await UserProfileApi(user_id);
    if (userDetails) {
      navigate(`/playerProfile/${user_id}`);
    }
  };

  const breadcrumbs = [{ name: "Dashboard", link: "/" }];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <LoaderImg />
      </Backdrop>

      <Stack
        sx={{
          display: "flex",
          gap: 6,
          marginTop: '6px',
          padding: '12px',
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack sx={{ width: "100%", gap: 2 }}>
          {/* Header row */}
          <Stack
            direction="row"
            sx={{ width: "100%", gap: "20px", height: "70%" }}
          >
            <Stack
              style={{
                backgroundColor: "#16181F",
                width: "100%",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                padding: "24px"


              }}
              data-aos="fade-left"
            >
              {/*<img*/}
              {/*  style={{*/}
              {/*    objectFit: "contain",*/}
              {/*    filter: "drop-shadow(0 0 8px #00E0FF)"*/}
              {/*  }}*/}
              {/*  width="70%"*/}
              {/*  src={idrbtLogo} alt="user_group" />*/}
            </Stack>
            {/* Total Users */}
            <Stack
              sx={{
                backgroundColor: "#16181F",
                width: "100%",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                padding: "24px",
              }}
              data-aos="fade-left"
            >
              <img src={userGroup} alt="user_group" />
              <Stack
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h2" sx={{ fontSize: "32px !important" }}>
                  {totalUser}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6F727A !important",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  Total User Count
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Categories + Scenarios */}
          <Stack
            direction="row"
            sx={{ width: "100%", gap: 2, borderRadius: "16px" }}
          >
            {/* Categories */}
            <Stack width="36%" data-aos="fade-left">
              <Box sx={{ bgcolor: "custom.main", width: "100%", padding: 3 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h2">Solo Categories</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/categories/soloCategory")}
                  >
                    See All
                  </Button>
                </Stack>

                <Stack
                  sx={{
                    width: "100%",
                    height: "auto",
                    gap: 3,
                    padding: 1,
                    marginTop: 3,
                  }}
                >
                  {cat?.data?.length ? (
                    cat.data.slice(0, 5).map((item, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          width: "100%",
                          height: "50px",
                          borderRadius: "12px",
                          padding: "16px 20px",
                          backgroundColor: "#342D3C",
                          cursor: "pointer",
                        }}
                        className={classes.stack}
                        onClick={() =>
                          navigate("/categories/soloCategory", {
                            state: {
                              id: item.ctf_category_id,
                              index,
                            },
                          })
                        }
                      >
                        <Typography>{item.ctf_category_name}</Typography>
                        <KeyboardArrowRightIcon />
                      </Stack>
                    ))
                  ) : (
                    <Stack alignItems="center">
                      <Typography>No data!!!</Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>

            {/* Scenarios */}
            <Stack
              sx={{
                backgroundColor: "custom.main",
                borderRadius: "16px",
                padding: 3,
              }}
              width="64%"
              data-aos="fade-left"
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h2">Squad</Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/squad/scenarioCategory")}
                >
                  See All
                </Button>
              </Stack>

              <Stack width="100%" gap={5} mt={4}>
                {scanario?.data?.length ? (
                  scanario.data.slice(0, 2).map((item, index) => (
                    <ScenarioMachine item={item} key={index} />
                  ))
                ) : (
                  <Stack alignItems="center">
                    <Typography>No data!!!</Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>

          {/* Member Wall + Top Performers */}
          <Stack sx={{ width: "100%", gap: 4 }} direction="row">
            {/* Member Wall */}
            <Box
              sx={{
                backgroundColor: "custom.main",
                width: "70%",
                borderRadius: "16px",
                padding: 3,
              }}
              data-aos="fade-up"
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h2">Member Wall</Typography>
                <SearchBar
                  value={memInput}
                  placeholder="Search"
                  onChange={handleSearch}
                />
              </Stack>
              <Wtable mem={memberWall} />
            </Box>

            {/* Top Performers */}
            <Stack
              sx={{
                backgroundColor: "custom.main",
                width: "30%",
                height: "575px",
                overflow: "scroll",
                borderRadius: "16px",
                padding: 3,
              }}
              data-aos="fade-up"
            >
              <Typography variant="h2" sx={{ mt: "8px" }}>
                Top Performers
              </Typography>

              {topPerformer.length ? (
                <Stack sx={{ my: 2 }}>
                  {topPerformer.map((item, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      justifyContent="space-between"
                      borderTop="2px solid #2A2C35"
                      sx={{ py: "8px", cursor: "pointer" }}
                      onClick={() => handleClickTopPerformer(item.user_id)}
                    >
                      <Stack
                        sx={{
                          width: "20%",
                          alignItems: "start",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.avatar}
                          sx={{
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            border: "1px solid white",
                          }}
                        />
                      </Stack>
                      <Stack sx={{ width: "53%" }}>
                        <Typography variant="h4">
                          {item.full_name.length > 10
                            ? `${item.full_name.substring(0, 10)}...`
                            : item.full_name}
                        </Typography>
                        <Typography variant="body2">{item.badge}</Typography>
                      </Stack>
                      <Stack sx={{ width: "33%" }}>
                        <Typography variant="h4">
                          {item.total_score}
                        </Typography>
                        <Typography variant="body2">Total Points</Typography>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Stack
                  sx={{
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Typography variant="h3" textAlign="center">
                    Be the first to be on Board!!!
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Dashboard;
