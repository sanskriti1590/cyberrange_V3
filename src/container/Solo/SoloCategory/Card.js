import * as React from "react";
import { useEffect, useState } from "react";
import { Stack, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import HTMLRenderer from "../../../components/HtmlRendering";
import { makeStyles } from "@mui/styles";
import jwtDecode from "jwt-decode";
import { addUserCTF, removeUserCTF } from "../../../APIConfig/adminConfig";
import { toast } from "react-toastify";
import { Icons } from "../../../components/icons";

const useStyles = makeStyles({
  stack: {
    transition: "transform 0.3s", // Add a smooth transition effect

    "&:hover": {
      transform: "scale(1.05)", // Increase the size on hover
    },
  },
});

const CategoryCard = ({ item, variant, CTAOnClick, loading, setLoading }) => {
  const { userId } = useParams();

  const [hide, setHide] = useState(true);
  const [admin, setAdmin] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      let user = jwtDecode(token);
      setAdmin(user?.is_admin);
    }
  }, []);

  const handleChallenge = () => {
    navigate(`/admin/makeSoloChallenge/${item?.ctf_id}`, {
      state: {
        variant,
      },
    });
  };

  //remove CTF data for user
  const handleRemoveUserCtf = async () => {
    try {
      const data = await removeUserCTF(userId, item?.ctf_id); // Call your API function
      if (data) {
        toast.success(data.data.message);
        setLoading(true);
      }
    } catch (error) {
      console.error("Error fetching CTF data:", error);
      setLoading(true);
    }
  };

  // add CTF data for user
  const handleAddUserCtf = async () => {
    setLoading(true);

    try {
      const data = await addUserCTF(userId, item?.ctf_id); // Call your API function
      if (data) {
        toast.success(data.data.message);
      }
    } catch (error) {
      console.error("Error fetching CTF data:", error);
    }
  };

  const renderCTAButton = () => {
    if (admin && variant == "edit") {
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
          onClick={() => navigate(`/admin/editSolo/${item?.ctf_id}`)}
          sx={{ width: "100px" }}
        >
          Edit
        </Typography>
      );
    } else if (variant === "mapCTF") {
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
          Map Solo
        </Typography>
      );
    } else if (variant === "unmapCTF") {
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
          Unmap Solo
        </Typography>
      );
    } else if (variant === "challenge") {
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
          unchallenge
        </Typography>
      );
    } else if (variant === "ctf") {
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
          Make Challenge
        </Typography>
      );
    } else if (variant === "userAddCtf") {
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
          onClick={handleAddUserCtf}
        >
          Add
        </Typography>
      );
    } else if (variant === "userGetCtf") {
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
          onClick={handleRemoveUserCtf}
        >
          Remove
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
                navigate(`/categories/gameDetails/${item.ctf_id}`, {
                  state: { id: item.ctf_id },
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
            `Get ${item.ctf_score} Points`
          )}
        </Typography>
      );
    }
  };

  return (
    <Stack
      direction="row"
      style={{
        maxHeight: "fit-content",
        width: "100%",
        // gap: 24,
        backgroundColor: "#16181F",
        borderRadius: "12px",
        marginBottom: 24,
        filter: item?.display === false && `blur(0.8px)`,
      }}
    >
      {/* image */}
      <img
        src={item.ctf_thumbnail}
        alt="image"
        style={{
          height: "170px",
          aspectRatio: 2 / 3,
          borderRadius: "12px 0 0 12px",
          objectFit: "cover",
        }}
      // onClick={() => navigate('/categories/gameDetails', { state: { id: item.ctf_id } })}
      />
      {/* details */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          // width: "100%",
        }}
      >
        <Stack justifyContent="space-around" style={{ padding: 12 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack
              direction="row"
              justifyContent="space-around"
              gap={2}
              marginVertical={2}
              sx={{ alignItems: "center" }}
            >
              <Typography variant="h2">
                {item.ctf_name.split(" ").length > 10
                  ? item.ctf_name.split(" ").slice(0, 10).join(" ") + "..."
                  : item.ctf_name}
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
                {item.ctf_assigned_severity}
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
                {item.ctf_time} Hour
              </Typography>
            </Stack>
          </Stack>
          {hide ? (
            <Stack sx={{ width: "100%" }}>
              <Typography variant="h5" sx={{ color: "#BCBEC1 !important", wordBreak: 'break-all' }}>
                {item.ctf_description
                  .replace(/(<([^>]+)>)/gi, "")
                  .split(" ")
                  .slice(0, 50)
                  .join(" ") + "..."}{" "}
              </Typography>

              <Typography
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#0FF",
                }}
                onClick={() => setHide(!hide)}
              >
                Read more
              </Typography>
            </Stack>
          ) : (
            <Stack sx={{ width: "100%", wordBreak: 'break-word' }}>
              <HTMLRenderer htmlContent={item.ctf_description} />
              <Typography
                variant="h5"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                  color: "#0FF",
                }}
                onClick={() => setHide(!hide)}
              >
                Read less
              </Typography>
            </Stack>
          )}
        </Stack>
        {/* points */}
        {/*{*/}
        {/*  admin && variant=="edit"*/}
        {/*    ?*/}
        {/*    <Typography variant='h5' style={{*/}
        {/*      cursor: 'pointer',*/}
        {/*      height: 'fit-content',*/}
        {/*      padding: '4px 16px',*/}
        {/*      margin: 24,*/}
        {/*      minWidth: '150px',*/}
        {/*      background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",*/}
        {/*      borderRadius: '16px',*/}
        {/*      textAlign: 'center',*/}
        {/*      color: '#EAEAEB'*/}
        {/*    }} noWrap*/}
        {/*    onClick={()=>navigate(`/admin/editSolo/${item?.ctf_id}`)} sx={{width:"100px"}}>Edit</Typography>*/}
        {/*    :*/}
        {/*    <Typography variant='h5' style={{*/}
        {/*      cursor: 'pointer',*/}
        {/*      height: 'fit-content',*/}
        {/*      padding: '4px 16px',*/}
        {/*      margin: 24,*/}
        {/*      minWidth: '150px',*/}
        {/*      background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",*/}
        {/*      borderRadius: '16px',*/}
        {/*      textAlign: 'center',*/}
        {/*      color: '#EAEAEB'*/}
        {/*    }} noWrap*/}
        {/*      onClick={() => navigate(`/categories/gameDetails/${item.ctf_id}`, { state: { id: item.ctf_id } })}>Get {item.ctf_score} Points</Typography>*/}
        {/*}*/}
        <Box>{renderCTAButton()}</Box>
      </Box>
    </Stack>
  );
};

export default CategoryCard;
