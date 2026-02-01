import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { toast, ToastContainer } from "react-toastify";

import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Button,
  Grid,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";

import Divider from "@mui/material/Divider";
import MediaControlCard from "./cards";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { DraftApi, UserProfileApi } from "../../../APIConfig/CtfConfig";
import truncateString from "../../../utilities/truncateString";
import { getReportList } from "../../../APIConfig/version2Scenario";
import ApiVersion2 from "../../../APIConfig/version2Api";
import ErrorHandler from "../../../ErrorHandler";



const PlayerProfile = () => {
  const user_Id = useParams()
  const [loading, setLoading] = React.useState(false)
  const [user, setUser] = React.useState()
  const [isError, setError] = React.useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const hide = location?.state?.hide;
  const MAX_CHAR_LENGTH = 15;
  const [value, setValue] = React.useState("1");
  const [draft, setDraft] = React.useState([]);
  const [reportData, setReportData] = React.useState();
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };




  useEffect(() => {
    if (user_Id?.userId) {
      const fetchUserData = async () => {

        try {
          setLoading(true)
          const response = await UserProfileApi(user_Id?.userId);
          setUser(response?.data);

          if (!response?.data.user_id) {
            toast.error('Unable to fetch user')
            setError(true)
          }

        } catch (error) {
          ErrorHandler(error);
        } finally {
          setLoading(false)
        }
      };

      fetchUserData()
    }
  }, [user_Id?.userId])

  useEffect(() => {



    const getData = async () => {
      try {
        const response = await DraftApi();
        response?.data && setDraft(response?.data);
      } catch (error) {
        ErrorHandler(error);
      }
    };
    getData();
  }, [user?.user_id]);


  const getReportData = async () => {
    if (user?.user_id) {
      try {
        const data = await getReportList(user?.user_id);
        if (data) {
          setReportData(data?.data);
        }
      } catch (error) {
        ErrorHandler(error);
      }
    }
  };

  const machineSubmittedHeading = [
    { title: "Machine Name", align: "left" },
    { title: "Category", align: "left" },
    { title: "Flags", align: "center" },
    { title: "Solved By", align: "right" },
  ];
  const ctfPlayedHeading = [
    { title: "Machine Name", align: "left" },
    { title: "Category", align: "left" },
    { title: "Flags", align: "center" },
    { title: "Date", align: "center" },
    { title: "Status", align: "right" },
  ];
  const draftHeading = [
    { title: "Machine Name", align: "left" },
    { title: "Category", align: "left" },
    { title: "Flags", align: "center" },
    { title: "Solved By", align: "center" },
    { title: "Submit File", align: "right" },
  ];
  const reportHeading = [
    { title: "S.No", align: "left" },
    { title: "Corporate Name", align: "left" },
    { title: "Corporate Type", align: "center" },
    { title: user?.is_admin ? "participant" : "Score", align: "center" },
    { title: "Download Report", align: "right" },
  ];

  const userColumn = [
    {
      img: user?.user_avatar,
      name: user?.user_full_name,
      aboutUser:
        "Just one more game. Sleep. Eat. Game. Repeat. A gamer truly loves you when he offers to teach you how to play. How to talk to someone when they’re gaming: Don’t. When you finish a game, you don’t know what to do anymore, play again.",
      // score: user.user_ctf_score,
      solo: user?.user_ctf_score,
      Squad: user?.user_scenario_score,
      Corporate: user?.user_corporate_score,
      // totalLikes: 2345,
    },
  ];
  const badgesBeginner = [
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser: "Lorem ipsum dolor sit amet consectetur.",
    },
  ];


  if (isError) return <Stack sx={{ margin: 4, borderRadius: 3 }} height='80vh' direction="row" mb={4} alignItems="center" justifyContent='center'>
    <Typography variant="h4">
      User Not Found
    </Typography>
    <ToastContainer />
  </Stack>

  const shareProfileUrl = () => {
    const currentUrl = window.location.href;

    // Check if the Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: `${user?.user_full_name || 'User'}'s Profile`,
        text: `Check out ${user?.user_full_name || 'this user'}'s profile on our platform`,
        url: currentUrl,
      })
        .then(() => console.log('Profile shared successfully'))
        .catch((error) => console.log('Error sharing profile:', error));
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(currentUrl)
        .then(() => {
          toast.success('Profile URL copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy URL to clipboard:', error);
          toast.error('Failed to copy URL to clipboard');

          // Alternative fallback: show URL in alert
          alert(`Share this profile URL:\n${currentUrl}`);
        });
    }
  };




  return (
    <Stack sx={{ margin: 4, borderRadius: 3 }}>
      <ToastContainer />
      <Stack direction="row" mb={4} alignItems="center">
        <Stack gap={2} width="100%">
          {userColumn.map((user) => {
            return (
              <Stack
                direction="row"
                sx={{
                  backgroundColor: "custom.main",
                  py: 5,
                  px: 1.5,
                  width: "100%",
                  borderRadius: "16px",
                  gap: 5,
                }}
              >

                <Stack
                  direction="row"
                  justifyContent={"space-between"}
                  sx={{
                    backgroundColor: "custom.secondary",
                    width: "100%",
                    borderRadius: "16px",
                    alignItems: "center",
                    padding: 5,
                  }}
                >


                  <Stack
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                  >
                    <img
                      src={user?.img}
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                      }}
                    />
                    <Stack ml={2}>
                      <Stack direction='row' justifyContent='space-between' alignItems='center'>

                        <Typography variant="h1" >
                          {truncateString(user?.name, MAX_CHAR_LENGTH)}

                        </Typography>
                        <ShareIcon
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              color: '#00CCCC',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                          color="error"
                          onClick={shareProfileUrl} />
                      </Stack>
                      <Typography variant="body1">{user?.aboutUser}</Typography>


                    </Stack>
                  </Stack>
                </Stack>
                <Stack sx={{ width: "100%", direction: "column" }}>
                  <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    sx={{
                      backgroundColor: "custom.secondary",
                      width: "100%",
                      borderRadius: "16px",
                      // alignItems: "center",
                      padding: 12,
                      border: "1px solid #b46228",
                      mb: 2,
                    }}
                  >
                    <Stack
                      direction="column"
                      sx={{ alignItems: "center" }}
                      gap={2}
                    >
                      <Typography variant="body1">Solo</Typography>
                      {user?.solo ? (
                        <Typography fontSize="32px" color="#b46228">
                          {user?.solo}
                        </Typography>
                      ) : (
                        <Typography fontSize="32px" color="#b46228">
                          0
                        </Typography>
                      )}
                    </Stack>

                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      color="#f4f4f4"
                      sx={{ height: "100%" }}
                    />
                    <Stack
                      direction="column"
                      sx={{ alignItems: "center" }}
                      gap={2}
                    >
                      <Typography variant="body1">Squad</Typography>
                      {user?.Squad ? (
                        <Typography fontSize="32px" color="#b46228">
                          {user?.Squad}
                        </Typography>
                      ) : (
                        <Typography fontSize="32px" color="#b46228">
                          0
                        </Typography>
                      )}
                    </Stack>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      color="#f4f4f4"
                      sx={{ height: "100%" }}
                    />
                    <Stack
                      direction="column"
                      sx={{ alignItems: "center" }}
                      gap={2}
                    >
                      <Typography variant="body1">Corporate</Typography>
                      {user?.Corporate > 0 ? (
                        <Typography fontSize="32px" color="#b46228">
                          {user?.Corporate}
                        </Typography>
                      ) : (
                        <Typography fontSize="32px" color="#b46228">
                          0
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleTabChange}
            textColor="#ffffff"
            TabIndicatorProps={{
              sx: { backgroundColor: "#b46228" },
            }}
          >
            <Tab label="CTF Played" value="1" />
            <Tab label="Machine Submitted" value="2" />
            {/* <Tab label="Badges" value="3" /> */}

            {!hide ? "" : <Tab label="Draft" value="4" />}
            <Tab label="Report" value="5" onClick={() => getReportData()} />
          </TabList>
        </Box>

        <TabPanel value="1">
          <TableContainer sx={{ maxHeight: "200px" }}>
            <Table
              stickyHeader
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                },

                backgroundColor: "custom.main !important",
                borderRadius: "8px",
              }}
            >
              <TableHead>
                <TableRow>
                  {ctfPlayedHeading.map((item, index) => {
                    return (
                      <TableCell
                        align={item.align}
                        style={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "white"
                        }}
                      // variant="h4"
                      >
                        {item.title}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {user?.ctf_played?.map((ctfPlayed, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" style={{ color: "white" }}>{ctfPlayed.ctf_name}</TableCell>
                    <TableCell align="left" style={{ color: "white" }}>
                      {ctfPlayed.ctf_category_name}
                    </TableCell>
                    <TableCell align="center" style={{ color: "white" }}>
                      {" "}
                      {ctfPlayed.ctf_total_flags}
                    </TableCell>
                    <TableCell align="center">
                      <Stack>
                        <Typography style={{ color: "white" }}>
                          {ctfPlayed.ctf_game_last_played == null
                            ? "none"
                            : ctfPlayed.ctf_game_last_played.split("T", 1)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" style={{ color: "white" }}>
                      {ctfPlayed.ctf_game_status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value="2">
          <TableContainer sx={{ maxHeight: "200px" }}>
            <Table
              stickyHeader
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                },

                backgroundColor: "custom.main !important",
                borderRadius: "8px",
              }}
            >
              <TableHead>
                <TableRow>
                  {machineSubmittedHeading?.map((item, index) => {
                    return (
                      <TableCell
                        align={item.align}
                        style={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "white"
                        }}
                      // variant="h4"
                      >
                        {item.title}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              {user?.ctf_created && <TableBody>
                {user?.ctf_created?.map((machineSubmitted, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" style={{ color: "white" }}>
                      {machineSubmitted.ctf_name}
                    </TableCell>
                    <TableCell align="left" style={{ color: "white" }}>
                      {machineSubmitted.ctf_category_name}
                    </TableCell>
                    <TableCell align="center" style={{ color: "white" }}>
                      {machineSubmitted.ctf_total_flags}
                    </TableCell>

                    <TableCell align="right" style={{ color: "white" }}>
                      {machineSubmitted.ctf_players_count}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>}


            </Table>
          </TableContainer>
          {!user?.ctf_created && <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              // border: "1px solid white",
              height: "100px",
              width: "100%",
              alignItems: "center",
              border: '1px solid white'
            }}
          >
            No Data Found
          </Box>}
        </TabPanel>


        <TabPanel value="3" sx={{ maxHeight: "200px" }}>
          <Stack>
            <Typography variant="h1" mb={1} mt={7}>
              Beginner
            </Typography>
            <Typography variant="body1" mb={4}>
              Lorem ipsum dolor sit amet consectetur. Fringilla urna velit sed
              tempor malesuada vel neque lobortis mi. At arcu fringilla proin
              turpis n malesuada vel neque lobortis mi. At arcu fringilla proin
              turpis n
            </Typography>
          </Stack>
          <Grid container gap={2} mb={5}>
            {badgesBeginner.map((badge) => {
              return (
                // <Stack
                //   direction="row"
                //   sx={{
                //     backgroundColor: "custom.main",
                //     px: 1.5,
                //     width: "100%",
                //     borderRadius: "8px",
                //     gap: 5,
                //   }}
                // >
                //   <Stack
                //     direction="row"
                //     justifyContent={"space-between"}
                //     sx={{
                //       width: "100%",
                //       borderRadius: "16px",
                //       alignItems: "center",
                //       padding: 5,
                //     }}
                //   >
                //     <Stack
                //       direction="row"
                //       justifyContent="left"
                //       alignItems="center"
                //     >
                //       <img
                //         src={badge.img}
                //         style={{
                //           width: "72px",
                //           height: "72px",
                //           borderRadius: "50%",
                //         }}
                //       />
                //       <Stack ml={2}>
                //         <Typography variant="h1">{badge.name}</Typography>
                //         <Typography variant="body1">
                //           {badge.aboutUser}
                //         </Typography>
                //       </Stack>
                //     </Stack>
                //   </Stack>
                // </Stack>
                <Grid item xs={12} sm={12} md={5.8} lg={3.85} xl={2.8} mb={7}>
                  <Stack
                    direction="row"
                    sx={{
                      backgroundColor: "custom.main",
                      px: 1.5,
                      width: "100%",
                      borderRadius: "8px",
                      gap: 5,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent={"space-between"}
                      sx={{
                        // width: "100%",
                        borderRadius: "16px",
                        alignItems: "center",
                        padding: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                        width="100%"
                      >
                        <Stack sx={{ width: "10%", height: "10%" }}>
                          <img
                            src={badge.img}
                            style={{
                              // width: "50%",
                              // height: "132px",
                              borderRadius: "50%",
                            }}
                          />
                        </Stack>
                        <Stack pl={2} sx={{ width: "25%" }}>
                          <Stack>
                            <Typography variant="h1" style={{ color: "white" }}>{badge.name}</Typography>
                          </Stack>
                          <Stack>
                            <Typography variant="body2" style={{ color: "white" }}>
                              {badge.aboutUser}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
          <Stack>
            <Typography variant="h1" mb={1}>
              Intermediate
            </Typography>
            <Typography variant="body1" mb={4}>
              Lorem ipsum dolor sit amet consectetur. Fringilla urna velit sed
              tempor malesuada vel neque lobortis mi. At arcu fringilla proin
              turpis n malesuada vel neque lobortis mi. At arcu fringilla proin
              turpis n
            </Typography>
          </Stack>
          <Grid>
            {" "}
            <MediaControlCard />
          </Grid>
        </TabPanel>

        {/* draft machine */}
        <TabPanel value="4">
          <TableContainer sx={{ maxHeight: "200px" }}>
            <Table
              stickyHeader
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                },

                backgroundColor: "custom.main !important",
                borderRadius: "8px",
              }}
            >
              <TableHead>
                <TableRow>
                  {draftHeading.map((item, index) => {
                    return (
                      <TableCell
                        align={item.align}
                        style={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "white"
                        }}
                      // variant="h4"
                      >
                        {item.title}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {draft?.map((machineSubmitted, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="left" style={{ color: "white" }}>
                        {machineSubmitted.ctf_name}
                      </TableCell>
                      <TableCell align="left" style={{ color: "white" }}>
                        {machineSubmitted.ctf_category_name}
                      </TableCell>
                      <TableCell align="center" style={{ color: "white" }}>
                        {" "}
                        {machineSubmitted.ctf_flag_count}
                      </TableCell>
                      <TableCell align="center" style={{ color: "white" }}>
                        {machineSubmitted?.ctf_created_at.split("T", 1)}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            navigate("/createSolo/uploadFile", {
                              state: { ctf_id: machineSubmitted?.ctf_id },
                            });
                          }}
                        >
                          submit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* report data table tab */}
        <TabPanel value="5">
          <TableContainer sx={{ maxHeight: "400px" }}>
            <Table
              stickyHeader
              sx={{
                [`& .${tableCellClasses.root}`]: {
                  borderBottom: "none",
                },

                backgroundColor: "custom.main !important",
                borderRadius: "8px",
              }}
            >
              <TableHead>
                <TableRow>
                  {reportHeading.map((item, index) => {
                    return (
                      <TableCell
                        align={item.align}
                        style={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "24px",
                          color: "white"
                        }}
                      // variant="h4"
                      >
                        {item.title}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              {reportData?.length > 0 && (
                <TableBody>
                  {reportData?.map((ele, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left" style={{ color: "white" }}>{index + 1}</TableCell>
                        <TableCell align="left" style={{ color: "white" }}>{ele?.name}</TableCell>
                        <TableCell align="center" style={{ color: "white" }}> {ele?.type}</TableCell>
                        <TableCell align="center" style={{ color: "white" }}>{user?.is_admin ?

                          ele?.participant?.map(item => {
                            return (
                              <Typography>{item?.user_full_name}</Typography>
                            )
                          })

                          : (ele?.score)}</TableCell>
                        <TableCell align="right">

                          <Typography
                            sx={{
                              pr: 5,
                            }}
                          >
                            <SaveAltIcon
                              sx={{ fontSize: "24px", cursor: "pointer" }}
                              onClick={() =>
                                 navigate(`/report/${ele?.active_scenario_id}`)
                              }
                            />
                          </Typography>

                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          {!reportData?.length && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                // border: "1px solid white",
                height: "100px",
                width: "100%",
                alignItems: "center",
              }}
            >
              No Data Found
            </Box>
          )}
        </TabPanel>
      </TabContext>
    </Stack>
  );

};

export default PlayerProfile;