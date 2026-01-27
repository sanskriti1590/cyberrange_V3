import { Stack, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import HTMLRenderer from "../../../components/HtmlRendering";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import {
  addUserCTF,
  addUserCorporate,
  addUserScenario,
  removeUserCorporate,
  removeUserScenario,
} from "../../../APIConfig/adminConfig";
import { Icons } from "../../../components/icons";

const CategoryCard = ({ item, variant, CTAOnClick, loading, setLoading }) => {
  const { userId } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false); // Set the initial state to false (collapsed)
  const [hide, setHide] = useState(true);
  const [admin, setAdmin] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      let user = jwtDecode(token);
      setAdmin(user?.is_admin);
    }
  }, []);


  const handleChallenge = () => {
    navigate(`/admin/makeSquadChallenge/${item?.scenario_id}`, {
      state: {
        variant,
      },
    });
  };

  //remove scenario data for user
  const handleRemoveUserScenario = async () => {
    try {
      const data = await removeUserScenario(userId, item?.scenario_id); // Call your API function
      if (data) {
        toast.success(data.data.message);
        setLoading(true);
      }
    } catch (error) {
      console.error("Error fetching scenario data:", error);
      setLoading(true);
    }
  };

  //remove corporate data for user
  const handleRemoveUserCorporate = async () => {
    try {
      const data = await removeUserCorporate(userId, item?.id); // Call your API function
      if (data) {
        toast.success(data.data.message);
        setLoading(true);
      }
    } catch (error) {
      console.error("Error fetching scenario data:", error);
      setLoading(true);
    }
  };

  const handleAddUserScenario = async () => {
    try {
      setLoading(true);
      const data = await addUserScenario(userId, item?.scenario_id); // Call your API function
      if (data) {
        toast.success(data.data.message);
      }
    } catch (error) {
      console.error("Error fetching CTF data:", error);
    }
  };

  const handleAddUserCorporate = async () => {
    try {
      setLoading(true);
      const data = await addUserCorporate(userId, item?.id); // Call your API function
      if (data) {
        toast.success(data.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderCTAButton = () => {
    if (admin && variant === "edit") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "150px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={() => navigate(`/admin/updateSquad/${item?.scenario_id}`)}
        >
          Edit
        </Typography>
      );
    } else if (variant === "approve") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "120px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={CTAOnClick}
        >
          Approve
        </Typography>
      );
    } else if (variant === "scenarios") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "120px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={handleChallenge}
        >
          Make challenge
        </Typography>
      );
    } else if (variant === "unApprove") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "120px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={CTAOnClick}
        >
          Unapprove
        </Typography>
      );
    } else if (variant === "user-get-scenarios") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "120px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={handleRemoveUserScenario}
        >
          Remove
        </Typography>
      );
    } else if (variant === "user-get-corporate") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "120px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={handleRemoveUserCorporate}
        >
          Remove
        </Typography>
      );
    } else if (variant === "userAddScenarios") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "120px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={handleAddUserScenario}
        >
          Add
        </Typography>
      );
    } else if (variant === "userAddCorporate") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "120px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={handleAddUserCorporate}
        >
          Add
        </Typography>
      );
    } else {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: item?.display === false ? "not-allowed" : "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "150px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={
            item?.display === false
              ? null
              : () =>
                navigate(`/squad/scenarioDetails/${item.scenario_id}`, {
                  state: { from: item.scenario_id },
                })
          }
        >
          {item?.display === false ? (
            <Icons.lock
              style={{
                fontSize: 18, // Sets the size of the icon
                cursor: "not-allowed", // Indicates the element is disabled
                color: "#fff", // Sets the main color of the icon
                stroke: "#fff", // Ensures the stroke color matches the icon color
                strokeWidth: 1.4, // Sets the width of the stroke
                transition: "all 0.3s", // Smooth transition for hover effects
                filter: "drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))", // Adds a subtle shadow
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ccc"; // Changes color on hover
                e.currentTarget.style.transform = "scale(1.3)"; // Slightly enlarges on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#fff"; // Resets color when not hovering
                e.currentTarget.style.transform = "scale(1)"; // Resets size when not hovering
              }}
            />
          ) : (
            `Get ${item.scenario_score} Points`
          )}
        </Typography>
      );
    }
  };

  if (variant === "userAddCorporate" || variant === "user-get-corporate") {
    return (
      <Stack
        direction="row"
        style={{
          maxHeight: "fit-content",
          width: "100%",
          gap: 24,
          backgroundColor: "#16181F",
          borderRadius: "12px",
          marginBottom: 24,
        }}
      >
        {/* image */}
        <img
          src={item?.thumbnail_url}
          alt="image"
          style={{
            height: "170px",
            aspectRatio: 2 / 3,
            borderRadius: "12px 0 0 12px",
            objectFit: "cover",
          }}
        // onClick={() =>
        //   navigate(`/scenarios/scenarioDetails/${item.scenario_id}`, {
        //     state: { from: item.scenario_id },
        //   })
        // }
        />
        {/* details */}
        <Stack justifyContent="space-around" style={{ padding: 12 }}>
          <Stack direction="row" alignItems="center" gap={2} marginVertical={2}>
            <Typography variant="h2">{item?.name}</Typography>
            {item?.severity && (
              <Typography
                variant="body3"
                style={{
                  color: "#BCBEC1 !important",
                  backgroundColor: "#242833",
                  borderRadius: "16px",
                  height: "fit-content",
                  padding: "4px 16px",
                }}
              >
                {item?.severity}
              </Typography>
            )}
            {item?.points && (
              <Typography
                variant="body3"
                style={{
                  color: "#BCBEC1 !important",
                  backgroundColor: "#242833",
                  borderRadius: "16px",
                  height: "fit-content",
                  padding: "4px 16px",
                }}
                noWrap
              >
                {item?.points} Points
              </Typography>
            )}

            {item?.type && (
              <Typography
                variant="body3"
                style={{
                  color: "#BCBEC1 !important",
                  backgroundColor: "#242833",
                  borderRadius: "16px",
                  height: "fit-content",
                  padding: "4px 16px",
                }}
                noWrap
              >
                {item?.type}
              </Typography>
            )}
          </Stack>
          {hide ? (
            <Stack sx={{ width: "100%" }}>
              <Typography variant="h5" sx={{ color: "#BCBEC1 !important" }}>
                {item?.description
                  ?.replace(/(<([^>]+)>)/gi, "")
                  .substring(0, 250)}
              </Typography>
              <Typography
                variant="h5"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#0FF",
                }}
                onClick={() => setHide(!hide)}
              >
                Read More
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ width: "100%" }}>
              <HTMLRenderer htmlContent={item?.description} />
              <Typography
                variant="h5"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#0FF",
                }}
                onClick={() => setHide(!hide)}
              >
                Read Less
              </Typography>
            </Stack>
          )}

          {/* <Stack direction='row' gap={2} my={2}>
          <Button startIcon={<Icons.externalLink/>} variant='contained'
                  sx={{
                    backgroundColor: '#002929',
                    height: 'fit-content', padding: '4px 8px', borderRadius: '4px', border: 'none', fontSize: '12px',
                    fonWeight: '600', '&:hover': {
                      border: 'none',
                    },
                  }}>MITRE Mapping</Button>
          <Button startIcon={<Icons.topology/>} variant='contained'
                  sx={{
                    backgroundColor: '#002929',
                    height: 'fit-content', padding: '4px 8px', borderRadius: '4px', border: 'none', fontSize: '12px',
                    fonWeight: '600', '&:hover': {
                      border: 'none',
                    },
                  }}>Network Topology</Button>
        </Stack> */}

          {/* configuration */}
          {/*<Stack direction="row" gap={5}>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="h5" sx={{ color: "#0FF !important" }}>*/}
          {/*      vCPU*/}
          {/*    </Typography>*/}
          {/*    <Typography>7</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="h5" sx={{ color: "#0FF !important" }}>*/}
          {/*      Disk Space*/}
          {/*    </Typography>*/}
          {/*    <Typography variant="h3">82 GB</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="h5" sx={{ color: "#0FF !important" }}>*/}
          {/*      RAM*/}
          {/*    </Typography>*/}
          {/*    <Typography variant="h3">10 GB</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="h5" sx={{ color: "#0FF !important" }}>*/}
          {/*      VMs*/}
          {/*    </Typography>*/}
          {/*    <Typography variant="h3">4</Typography>*/}
          {/*  </Stack>*/}
          {/*</Stack>*/}
        </Stack>
        {/* points */}
        {renderCTAButton()}
      </Stack>
    );
  } else {
    return (
      <Stack
        direction="row"
        style={{
          maxHeight: "fit-content",
          width: "100%",
          gap: 24,
          backgroundColor: "#16181F",
          borderRadius: "12px",
          marginBottom: 24,
          filter: item?.display === false && `blur(0.8px)`,
        }}
      >
        {/* image */}
        <img
          src={item?.scenario_thumbnail}
          alt="image"
          style={{
            height: "170px",
            aspectRatio: 2 / 3,
            borderRadius: "12px 0 0 12px",
            objectFit: "cover",
          }}
          onClick={() =>
            navigate(`/squad/scenarioDetails/${item.scenario_id}`, {
              state: { from: item.scenario_id },
            })
          }
        />
        {/* details */}
        <Stack justifyContent="space-around" style={{ padding: 12 }}>
          <Stack direction="row" alignItems="center" gap={2} marginVertical={2}>
            <Typography variant="h2">{item.scenario_name}</Typography>
            <Typography
              variant="body3"
              style={{
                color: "#BCBEC1 !important",
                backgroundColor: "#242833",
                borderRadius: "16px",
                height: "fit-content",
                padding: "4px 16px",
              }}
            >
              {item.scenario_assigned_severity}
            </Typography>
            <Typography
              variant="body3"
              style={{
                color: "#BCBEC1 !important",
                backgroundColor: "#242833",
                borderRadius: "16px",
                height: "fit-content",
                padding: "4px 16px",
              }}
              noWrap
            >
              {item.scenario_time} Hour
            </Typography>
          </Stack>
          {hide ? (
            <Stack sx={{ width: "100%" }}>
              <Typography variant="h5" sx={{ color: "#BCBEC1 !important" }}>
                {item.scenario_description
                  ?.replace(/(<([^>]+)>)/gi, "")
                  .substring(0, 250)}
              </Typography>
              <Typography
                variant="h5"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#0FF",
                }}
                onClick={() => setHide(!hide)}
              >
                Read More
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ width: "100%" }}>
              <HTMLRenderer htmlContent={item.scenario_description} />
              <Typography
                variant="h5"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#0FF",
                }}
                onClick={() => setHide(!hide)}
              >
                Read Less
              </Typography>
            </Stack>
          )}

          {/* <Stack direction='row' gap={2} my={2}>
          <Button startIcon={<Icons.externalLink/>} variant='contained'
                  sx={{
                    backgroundColor: '#002929',
                    height: 'fit-content', padding: '4px 8px', borderRadius: '4px', border: 'none', fontSize: '12px',
                    fonWeight: '600', '&:hover': {
                      border: 'none',
                    },
                  }}>MITRE Mapping</Button>
          <Button startIcon={<Icons.topology/>} variant='contained'
                  sx={{
                    backgroundColor: '#002929',
                    height: 'fit-content', padding: '4px 8px', borderRadius: '4px', border: 'none', fontSize: '12px',
                    fonWeight: '600', '&:hover': {
                      border: 'none',
                    },
                  }}>Network Topology</Button>
        </Stack> */}

          {/* configuration */}
          {/*<Stack direction="row" gap={5}>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="h5" sx={{ color: "#0FF !important" }}>*/}
          {/*      vCPU*/}
          {/*    </Typography>*/}
          {/*    <Typography>7</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="h5" sx={{ color: "#0FF !important" }}>*/}
          {/*      Disk Space*/}
          {/*    </Typography>*/}
          {/*    <Typography variant="h3">82 GB</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="h5" sx={{ color: "#0FF !important" }}>*/}
          {/*      RAM*/}
          {/*    </Typography>*/}
          {/*    <Typography variant="h3">10 GB</Typography>*/}
          {/*  </Stack>*/}
          {/*  <Stack>*/}
          {/*    <Typography variant="h5" sx={{ color: "#0FF !important" }}>*/}
          {/*      VMs*/}
          {/*    </Typography>*/}
          {/*    <Typography variant="h3">4</Typography>*/}
          {/*  </Stack>*/}
          {/*</Stack>*/}
        </Stack>
        {/* points */}
        {renderCTAButton()}
      </Stack>
    );
  }
};

export default CategoryCard;
