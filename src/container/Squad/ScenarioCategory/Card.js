import { Stack, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import HTMLRenderer from "../../../components/HtmlRendering";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Icons } from "../../../components/icons";
import { ToastContainer, toast } from "react-toastify";

const CategoryCardVersion2 = ({ item, variant, CTAOnClick }) => {
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
  // Function to toggle the showFullDescription state
  const toggleDescription = () => {
    setShowFullDescription(
      (prevShowFullDescription) => !prevShowFullDescription
    );
  };

  // Function to truncate the description to a specified word limit
  const truncateDescription = (text, limit) => {
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };

  const handleChallenge = () => {
    navigate(`/admin/makeSquadChallenge/${item?.id}`, {
      state: {
        variant,
      },
    });
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
          onClick={() => navigate(`/admin/updateSquad/${item?.id}`)}
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
                navigate(`/corporate/details/${item.id}`, {
                  state: { from: item.id },
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
            `Get ${item.points} Points`
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
        justifyContent: "space-between",
        width: "100%",
        gap: 24,
        backgroundColor: "#16181F",
        borderRadius: "12px",
        marginBottom: 24,
        filter: item?.display === false && `blur(0.8px)`,
      }}
    >
      <Stack direction="row">
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
        //   navigate(`/scenarios/scenarioDetails/${item.id}`, {
        //     state: { from: item.id },
        //   })
        // }
        />
        {/* details */}
        <Stack justifyContent="space-around" style={{ padding: 12 }}>
          <Stack direction="row" alignItems="center" gap={2} marginVertical={2}>
            <Typography variant="h2">{item.name}</Typography>
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
              {item.severity}
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
              {item?.points} points
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
              {item?.type}
            </Typography>
          </Stack>
          {hide ? (
            <Stack sx={{ width: "100%" }}>
              <Typography variant="h5" sx={{ color: "#BCBEC1 !important", wordBreak: 'break-word' }}>
                {item.description
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
            <Stack sx={{ width: "100%", wordBreak: 'break-word' }}>
              <HTMLRenderer htmlContent={item.description} />
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
        </Stack>
      </Stack>
      {/* points */}
      {renderCTAButton()}
    </Stack>
  );
};

export default CategoryCardVersion2;
