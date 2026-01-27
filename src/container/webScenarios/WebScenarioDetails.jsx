import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Backdrop,
  Box,
  Button,
  Skeleton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import fill from "../../../src/assests/Password.png";
import star from "../../../src/assests/Password.png";
import union from "../../../src/assests/Password.png";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Practice from "../ViewScenariosCommon/ScenarioDetails/practice";
import HTMLRenderer from "../../components/HtmlRendering";
import WinningWall from "../../components/winningWall/WinningWall";
import BreadCrumbs from "../../components/navbar/BreadCrumb";
import LoaderImg from "../../components/ui/loader";
import {
  endGameWebScenario,
  getWebScenarioDetail,
  getWinningWallDataWebScenario,
  startGame_webScenario,
} from "../../APIConfig/webScenarioConfig";
import axiosErrorHandler from "../../ErrorHandler/axiosErrHandler";

export const LongText = ({ content, limit }) => {
  const [showAll, setShowAll] = useState(false);
  const showMore = () => setShowAll(true);
  const showLess = () => setShowAll(false);

  if (content?.length <= limit) {
    // there is nothing more to show
    return <div>{content}</div>;
  }
  if (showAll) {
    // We show the extended text and a link to reduce it
    return (
      <div>
        {content}
        <Button varaint="text" color="secondary" onClick={showLess}>
          Read less
        </Button>
      </div>
    );
  }
  // In the final case, we show a text with ellipsis and a `Read more` Button
  const toShow = content?.substring(0, limit) + "...";
  return (
    <div>
      {toShow}
      <Button varaint="text" color="secondary" onClick={showMore}>
        Read more
      </Button>
    </div>
  );
};

const WebScenarioDetails = ({ data }) => {
  const [value, setValue] = React.useState("1");
  const [isActive, setIsActive] = useState(false);
  const [datas, setData] = useState({});
  const [rows, setRows] = useState([]);
  const [hide, setHide] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [winning_wall_data, setWinning_wall_data] = useState([]);

  // Split the URL by slashes and get the last element

  const navigate = useNavigate();

  const handleTabChange = (_, newValue) => {
    setValue(newValue);
  };

  const { gameId } = useParams();

  const getWinningWallData = async (gameId) => {
    try {
      const response = await getWinningWallDataWebScenario(gameId);
      response?.data && setWinning_wall_data(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getValue = async () => {
      try {
        setIsActive(true);
        const response = await getWebScenarioDetail(gameId);
        if (response?.data) {
          setData(response?.data);
          setRows(response?.data?.winning_wall);
        }

        setIsActive(false);
      } catch (error) {
        setIsActive(false);
        // ErrorNavigator(error, navigate);
      } finally {
        setIsActive(false);
      }
    };
    getValue();
    getWinningWallData(gameId);
  }, [gameId]);

  // need to change accordingly when API recive from backend
  const handlePlay = async (game_id) => {
    try {
      setLoading(!loading);
      setIsActive(true);
      const response = await startGame_webScenario(game_id);
      if (response?.data) {

        setIsActive(false);
        if (response) {
          // toast.success(response.data.message);
          navigate(`/consoleWebScenario/${response?.data?._id}`);
        }

      }
      // getConsole(response?.data?.ctf_game_id)
    } catch (error) {
      setIsActive(false);
      // ErrorHandler(error);
      axiosErrorHandler(error);
    } finally {
      setIsActive(false);
    }
  };



  const machineDetails = {
    walkthrough: [datas?.walkthrough_file_url],
    ctf_thumbnail: datas?.thumbnail,
    flagsInformation: `Number of flags : ${datas?.flags}`,
    resources:
      datas?.rules_regulations_text ||
      `<p>Fair Play: Participants must adhere to the principles of fair play , honesty, and integrity throughout the competition. Cheating, exploiting vulnerabilities of the platform, and engaging in any form of unethical behavior are strictly prohibited.:</p><p><br></p><p>Compliance with Laws: Participants must comply with all applicable local, national, and international laws and regulations. Any activities that violate legal statutes, including unauthorized access to systems or networks, are strictly prohibited.</p><p><br></p><p>Respect for Privacy: Participants must respect the privacy of other users and refrain from attempting to access, disclose, or exploit sensitive or personal information.</p><p><br></p><p>Use of Platform: Participants should use the platform solely for the intended purpose of the games and challenges. Unauthorized attempts to disrupt or damage the platform infrastructure or interfere with other participants activities are not allowed.</p><p><br></p><p>Reporting Vulnerabilities: If participants discover any vulnerabilities or weaknesses in the platform, they should report them promptly to the platform administrators, rather than exploiting or sharing them with others.</p><p><br></p><p>Collaboration and Sharing: Participants may collaborate and share knowledge and insights with other participants, but they should not engage in activities that provide unfair advantages or compromise the integrity of the competition.</p><p>Intellectual Property Rights: Participants should respect intellectual property rights and refrain from using copyrighted materials without proper authorization.</p><p><br></p><p>Platform Administration: The platform administrators have the authority to monitor the activities, investigate any violations, and take appropriate actions, including disqualification, suspension, or removal of participants found to be in breach of the rules and regulations.</p><p><br></p><p>Amendments and Disputes: The platform reserves the right to amend the rules and regulations as necessary. In case of any disputes or concerns, participants should contact the platform administrators for resolution.</p><p><br></p><p>By following these rules and regulations, participants can ensure a fair and enjoyable experience while maintaining the integrity of the platform and respecting the rights of others.</p>`,
    prerequisites:
      datas?.flag_content_text ||
      `<ol><li><strong st yle="color: var(--tw-prose-bold);">Basic Networking Knowledge:</strong> Understanding networking concepts, such as IP addressing, subnets, ports, protocols, and network traffic analysis, is fundamental for CTFs.</li><li><strong st yle="color: var(--tw-prose-bold);">Operating System Familiarity:</strong> Proficiency with various operating systems (Linux and Windows) is important for identifying vulnerabilities and exploiting them.</li><li><strong st yle="color: var(--tw-prose-bold);">Programming and Scripting Skills:</strong> Knowledge of programming languages like Python, Bash, and scripting is crucial for automating tasks, writing custom tools, and analyzing code.</li><li><strong st yle="color: var(--tw-prose-bold);">Security Fundamentals:</strong> A good grasp of security fundamentals, including encryption, authentication, access control, and risk management, is essential.</li><li><strong st yle="color: var(--tw-prose-bold);">Web Application Security:</strong> Understanding web application security concepts like OWASP Top 10 vulnerabilities, Cross-Site Scripting (XSS), SQL Injection, and Cross-Site Request Forgery (CSRF) is important for web-related challenges.</li><li><strong st yle="color: var(--tw-prose-bold);">Forensics and Incident Response:</strong> Familiarity with digital forensics, file analysis, and incident response techniques is valuable for investigating incidents and solving related challenges.</li><li><strong st yle="color: var(--tw-prose-bold);">Cryptography:</strong> Basic knowledge of cryptographic algorithms and their applications can be crucial in solving cryptography-related challenges.</li><li><strong st yle="color: var(--tw-prose-bold);">Reverse Engineering:</strong> Experience in reverse engineering and debugging can help when analyzing malware and cracking software challenges.</li><li><strong st yle="color: var(--tw-prose-bold);">Steganography:</strong> Understanding steganography, which involves hiding information within files or images, is useful for challenges that involve hidden data.</li><li><strong st yle="color: var(--tw-prose-bold);">Linux Command Line Skills:</strong> Proficiency in using Linux command-line tools is essential as many Solo challenges are hosted on Linux systems.</li><li><strong st yle="color: var(--tw-prose-bold);">Capture and Analysis Tools:</strong> Familiarity with network packet capture and analysis tools like Wireshark is important for analyzing network traffic.</li><li><strong st yle="color: var(--tw-prose-bold);">Security Tools:</strong> Knowledge of security tools like Nmap, Burp Suite, Metasploit, and others can be advantageous for various challenges.</li><li><strong st yle="color: var(--tw-prose-bold);">Problem-Solving and Critical Thinking:</strong> Strong problem-solving skills and the ability to think outside the box are crucial for CTFs, which often require creative solutions.</li></ol>`,
  };





  const breadcrumbs = [
    { name: "Dashboard", link: "/" },
    {
      name: "Web Scenario",
      link: "/webScenarios/categories",
    },
    { name: "Web Scenario Details" },
  ];

  return (
    <Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <LoaderImg />
      </Backdrop>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <Stack spacing={2} margin={5}>
        <Stack
          style={{ gap: 8, mb: 5 }}
          sx={{ backgroundColor: "custom.main" }}
        >
          <Stack
            direction="row"
            sx={{
              border: "1px solid #12464C",
              borderRadius: "16px",
              padding: 3,
              gap: 2,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <img
              src={datas?.thumbnail}
              alt="img"
              style={{ width: "147px", height: "147px" }}
            />
            {datas ? (
              <Stack width="100%">
                <Stack
                  width="100%"
                  justifyContent="space-between"
                  direction="row"
                >
                  <Typography variant="h1">{datas?.name}</Typography>
                  <Stack direction="row" gap={3}>
                    {datas?.game_status ? (
                      <Stack direction="row" gap={2}>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            navigate(
                              `/consoleWebScenario/${datas?.game_status?._id}`
                            )
                          }
                        >
                          Resume
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          // onClick={() => endGameConsole(datas?.ctf_game_id)}
                          onClick={() =>
                            endGameWebScenario(
                              datas?.game_id,
                              datas?.game_status?._id
                            )
                          }
                        >
                          End
                        </Button>
                      </Stack>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => handlePlay(gameId)}
                      >
                        Join Now
                      </Button>
                    )}

                    {/* <Button
                      variant="contained"
                      onClick={() => handlePlay(gameId)}
                    >
                      Join Now
                    </Button> */}
                  </Stack>
                </Stack>
                <Stack direction="row" gap={2} mb={2}>
                  <Stack direction="row" gap="6px" alignItems="center">
                    <img src={fill} width="16px" height="16px" />
                    <Typography>{datas?.assigned_severity}</Typography>
                    <Box
                      backgroundColor="white"
                      height="18px"
                      width="1px"
                    ></Box>
                  </Stack>
                  {datas?.game_points && (
                    <Stack direction="row" gap="6px" alignItems="center">
                      <img src={star} width="16px" height="16px" />
                      <Typography>{datas?.game_points} Points</Typography>
                      <Box
                        backgroundColor="white"
                        height="18px"
                        width="1px"
                      ></Box>
                    </Stack>
                  )}
                  {datas?.players_count && (
                    <Stack direction="row" gap="6px" alignItems="center">
                      <img src={union} width="16px" height="16px" />
                      <Typography>{datas?.players_count}</Typography>
                    </Stack>
                  )}
                </Stack>
                {hide ? (
                  <Stack sx={{ width: "100%" }}>
                    <Typography>
                      {datas?.description
                        ?.replace(/(<([^>]+)>)/gi, "")
                        .substring(0, 250)}
                    </Typography>
                    <Typography
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#00FFFF",
                      }}
                      onClick={() => setHide(!hide)}
                    >
                      Read more
                    </Typography>
                  </Stack>
                ) : (
                  <Stack sx={{ width: "100%" }}>
                    <HTMLRenderer htmlContent={datas?.description} />
                    <Typography
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "#00FFFF",
                      }}
                      onClick={() => setHide(!hide)}
                    >
                      Read less
                    </Typography>
                  </Stack>
                )}
              </Stack>
            ) : (
              <Skeleton variant="circular" width={40} height={40} />
            )}
          </Stack>
        </Stack>
        {/* tab details */}
        <Stack direction="row" gap={2}>
          <Stack
            sx={{
              backgroundColor: "background.secondary",
              p: 2,
              borderRadius: "16px",
              width: "50%",
            }}
          >
            <TabContext value={value}>
              <Box>
                <TabList
                  onChange={handleTabChange}
                  textColor="#ffffff"
                  TabIndicatorProps={{
                    sx: { backgroundColor: "#b46228" },
                  }}
                >
                  {/* <Tab label="Walkthrough" value="1" /> */}
                  <Tab label="Rules & Regulations" value="1" />
                  <Tab label="Flag Information" value="2" />
                </TabList>
              </Box>

              <TabPanel value="">
                <Stack alignItems="start" gap={2}>
                  {machineDetails?.walkthrough?.map((item, index) => {
                    return (
                      // <Stack direction="row" gap={2}>
                      //   <LaunchIcon  onClick={() => window.open(item, '_blank')} sx={{cursor:'pointer'}}/>
                      //   <Typography varaint="h3">Walk Through</Typography>
                      //   {/* <PdfReader item={item} /> */}
                      // </Stack>
                      <Button
                        key={index}
                        variant="outlined"
                        color="secondary"
                        onClick={() => window.open(item, "_blank")}
                      >
                        WALK THROUGH PDF
                      </Button>
                    );
                  })}
                  <Typography sx={{ marginLeft: 1 }}>
                    {machineDetails?.flagsInformation}
                  </Typography>
                </Stack>
              </TabPanel>

              <TabPanel value="1">
                <Stack
                  sx={{
                    backgroundColor: "custom.main",
                    borderRadius: "16px",
                    height: "500px",
                    overflow: "scroll",
                    px: 4,
                  }}
                >
                  <HTMLRenderer htmlContent={machineDetails.resources} />
                </Stack>
              </TabPanel>
              <TabPanel value="2">
                <Stack sx={{ height: "500px", overflow: "scroll", px: 4 }}>
                  <HTMLRenderer htmlContent={machineDetails?.prerequisites} />
                </Stack>
              </TabPanel>
            </TabContext>
          </Stack>
          {/* practice details */}
          <Stack
            sx={{
              backgroundColor: "background.secondary",
              p: 2,
              borderRadius: "16px",
              width: "50%",
            }}
          >
            <Practice item={machineDetails?.walkthrough} />
          </Stack>
        </Stack>

        {winning_wall_data?.length > 0 && (
          <WinningWall
            template="winningWall"
            data={winning_wall_data}
            header="Achievers"
          />
        )}
      </Stack>
    </Stack>
  );
};
export default WebScenarioDetails;
